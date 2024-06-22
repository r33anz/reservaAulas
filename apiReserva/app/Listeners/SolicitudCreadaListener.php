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
class SolicitudCreadaListener
{
    
    public function handle(SolicitudCreada $event)
    {   
        $solicitud = Solicitud::find($event->idSolicitud);
        $usuario = User::find($solicitud->user_id);
        // Calcula los días faltantes
        $fechaReserva = Carbon::parse($solicitud->fechaReserva);
        $horasFaltantes = Carbon::now()->diffInHours($fechaReserva, false);

        $adminUsers = User::role('admin')->get();

        if($horasFaltantes <= 48){
            foreach ($adminUsers as $admin) {
                event(new NotificacionUsuario($admin->id,"Solicitud Nueva."));
                $admin->notify(new SolicitudUrgenteN($horasFaltantes,
                             $usuario->name, $solicitud->fechaReserva));
            }
        }else{
            foreach ($adminUsers as $admin) {
                event(new NotificacionUsuario($admin->id,"Soliciutd Nueva."));
                $admin->notify(new SolicitudRAdmin($usuario->name,
                                 $solicitud->fechaReserva));
            }    
        }
    }
}
