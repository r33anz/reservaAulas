<?php

namespace App\Listeners;

use App\Events\NotificacionUsuario;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\SolicitudCreada;
use App\Models\Solicitud;
use App\Models\User;
use App\Notifications\SolicitudRAdmin;
use App\Notifications\SolicitudUrgenteN;
use Illuminate\Support\Carbon;
use App\Models\Periodo;
use App\Notifications\SolicitudAutomatica;
use Illuminate\Support\Facades\DB;
use App\Services\ValidadorService; 
use App\Services\NotificadorService;

class SolicitudCreadaListener
{   
    protected $ambienteValido;
    protected $notificadorService;

    public function __construct(ValidadorService $ambienteValido, NotificadorService $notificadorService)
    {
        $this->ambienteValido = $ambienteValido;
        $this->notificadorService = $notificadorService;
    }

    
    public function handle(SolicitudCreada $event)
    {   
        $solicitud = Solicitud::find($event->idSolicitud);
        $usuario = User::find($solicitud->user_id);

        // Obtén la hora inicial del período
        $periodoInicial = Periodo::find($solicitud->periodo_ini_id);
        $horaInicial = Carbon::parse($periodoInicial->horainicial);
        $fechaHoraReserva = Carbon::parse($solicitud->fechaReserva . ' ' . $horaInicial->format('H:i:s'));
        $horasFaltantes = Carbon::now()->diffInHours($fechaHoraReserva, false);

        $adminUsers = User::role('admin')->get();

        if($horasFaltantes < 4 ){ // atencion automatica
            // Verificar si el ambiente está disponible
            $fecha = $solicitud->fechaReserva;
            $ambiente = DB::table('ambiente_solicitud')->where('solicitud_id', $solicitud->id)->pluck('ambiente_id');
            $periodos = [$solicitud->periodo_ini_id, $solicitud->periodo_fin_id];
            $ambienteDisponible = $this->ambienteValido->antenderAmbiente($ambiente, $fecha, $periodos, $solicitud->user_id);

            if ($ambienteDisponible->alerta === 'exito') {
                // Aceptar solicitud
                $solicitud->estado = 'aprobado';
                $solicitud->fechaAtendida = Carbon::now();
                $solicitud->save();

                // Notificar al usuario de aceptación
                $this->notificadorService->notificarAceptacion($solicitud->id);
                event(new NotificacionUsuario($solicitud->user_id, 'Su solicitud ha sido aprobada.'));
            } else {
                // Rechazar solicitud
                $solicitud->estado = 'rechazado';
                $solicitud->razonRechazo = 'Ambiente no disponible';
                $solicitud->fechaAtendida = Carbon::now();
                $solicitud->save();

                // Notificar al usuario de rechazo
                $this->notificadorService->notificarRechazo($solicitud->id);
                event(new NotificacionUsuario($solicitud->user_id, 'Su solicitud ha sido rechazada. Ambiente no disponible.'));
            }

            foreach ($adminUsers as $admin) {
                event(new NotificacionUsuario($admin->id, "Solicitud Atentidad Automaticamente."));
                $admin->notify(new SolicitudAutomatica($horasFaltantes, $usuario->name, $solicitud->fechaReserva));
            }
            
        }else if($horasFaltantes <= 48){ //notificacion urgente
            foreach ($adminUsers as $admin) {
                event(new NotificacionUsuario($admin->id, "Solicitud Nueva."));
                $admin->notify(new SolicitudUrgenteN($horasFaltantes, $usuario->name, $solicitud->fechaReserva));
            }
        }else{////notificacion normal
            foreach ($adminUsers as $admin) {
                event(new NotificacionUsuario($admin->id, "Solicitud Nueva."));
                $admin->notify(new SolicitudRAdmin($usuario->name, $solicitud->fechaReserva));
            }   
        }
    }
}
