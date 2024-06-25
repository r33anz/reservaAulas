<?php

namespace App\Services;
use App\Models\Solicitud;
use App\Models\Ambiente;
use Illuminate\Support\Facades\DB;
use App\Models\Periodo;
use App\Models\User;
use App\Notifications\SolicitudR;
use App\Notifications\Aceptar;
use App\Notifications\Rechazar;
use App\Notifications\Inhabilitar;
use App\Events\NotificacionUsuario;
use App\Models\Docente;
use App\Notifications\Cancelada;
use App\Notifications\LiberacionAmbiente;
use App\Notifications\SolicitudRAdmin;

class NotificadorService
{
    public function notificarInhabilitacion($idSolicitud){
        $solicitud = Solicitud::find($idSolicitud);
        $idAmbiente = DB::table('ambiente_solicitud')
                            ->where('solicitud_id', $idSolicitud)
                            ->value('ambiente_id');
        $nombreAmbiente = Ambiente::where('id', $idAmbiente)
                                    ->value('nombre');

        $periodoIdIni=$solicitud->periodo_ini_id;
        $periodoIdFin=$solicitud->periodo_fin_id;

        $ini = Periodo::find($periodoIdIni);
        $fin = Periodo::find($periodoIdFin);

        $user = User::find($solicitud->user_id);
        //disparar evento
        event(new NotificacionUsuario($solicitud->user_id,'Nueva notificacion.'));
        $user->notify(new Inhabilitar($nombreAmbiente, $solicitud->fechaReserva, $ini->horainicial, $fin->horafinal));

    }

    public function notificarAceptacion($idSolicitud){
        
        $solicitud = Solicitud::find($idSolicitud);
        $idAmbiente = DB::table('ambiente_solicitud')
                            ->where('solicitud_id', $idSolicitud)
                            ->value('ambiente_id');
        $nombreAmbiente = Ambiente::where('id', $idAmbiente)
                                    ->value('nombre');

        $periodoIdIni = $solicitud->periodo_ini_id;
        $periodoIdFin = $solicitud->periodo_fin_id;

        $ini = Periodo::find($periodoIdIni);
        $fin = Periodo::find($periodoIdFin);

        $user = User::find($solicitud->user_id);
        $user->notify(new Aceptar($nombreAmbiente, $solicitud->fechaReserva, $ini->horainicial, $fin->horafinal));
    }

    public function notificarRechazo($idSolicitud){
        $solicitud = Solicitud::find($idSolicitud);
        $idAmbiente = DB::table('ambiente_solicitud')
                            ->where('solicitud_id', $idSolicitud)
                            ->value('ambiente_id');
        $nombreAmbiente = Ambiente::where('id', $idAmbiente)
                                    ->value('nombre');

        $periodoIdIni=$solicitud->periodo_ini_id;
        $periodoIdFin=$solicitud->periodo_fin_id;

        $ini = Periodo::find($periodoIdIni);
        $fin = Periodo::find($periodoIdFin);

        $user = User::find($solicitud->user_id);
        $user->notify(new Rechazar($nombreAmbiente, $solicitud->fechaReserva, $ini->horainicial, $fin->horafinal,$solicitud->razonRechazo));
    }

    public function solicitudRealizada($idSolicitud){
        $solicitud = Solicitud::find($idSolicitud);
        $idAmbiente = DB::table('ambiente_solicitud')
                            ->where('solicitud_id', $idSolicitud)
                            ->value('ambiente_id');
        $nombreAmbiente = Ambiente::where('id', $idAmbiente)
                                    ->value('nombre');

        $periodoIdIni=$solicitud->periodo_ini_id;
        $periodoIdFin=$solicitud->periodo_fin_id;

        $ini = Periodo::find($periodoIdIni);
        $fin = Periodo::find($periodoIdFin);
        $user = User::find($solicitud->user_id);
        $user->notify(new SolicitudR($nombreAmbiente,$solicitud->fechaReserva,$ini->horainicial,$fin->horafinal));
    }

    public function cancelarReserva($idSolicitud){
        $solicitud = Solicitud::find($idSolicitud);
        $idAmbiente = DB::table('ambiente_solicitud')
                            ->where('solicitud_id', $idSolicitud)
                            ->value('ambiente_id');
        $nombreAmbiente = Ambiente::where('id', $idAmbiente)
                                    ->value('nombre');

        $periodoIdIni=$solicitud->periodo_ini_id;
        $periodoIdFin=$solicitud->periodo_fin_id;

        $ini = Periodo::find($periodoIdIni);
        $fin = Periodo::find($periodoIdFin);
        
        // Encuentra a todos los docentes excepto al creador de la solicitud
        $docentes = User::role('docente')->where('id', '!=', $solicitud->user_id)->get();

        foreach ($docentes as $docente) {
            event(new NotificacionUsuario($docente->id, 'Ambiente Liberado.'));
            $docente->notify(new LiberacionAmbiente($nombreAmbiente, $solicitud->fechaReserva,
                                                         $ini->horainicial, $fin->horafinal));
        }
    }

}
