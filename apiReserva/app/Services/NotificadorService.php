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
use App\Notifications\LiberacionAmbiente;


class NotificadorService
{

    protected function obtenerDatosSolicitud($idSolicitud){
        $solicitud = Solicitud::findOrFail($idSolicitud);
        $idAmbiente = DB::table('ambiente_solicitud')
                        ->where('solicitud_id', $idSolicitud)
                        ->value('ambiente_id');
        $nombreAmbiente = Ambiente::findOrFail($idAmbiente)->nombre;
        $ini = Periodo::findOrFail($solicitud->periodo_ini_id);
        $fin = Periodo::findOrFail($solicitud->periodo_fin_id);
        $user = User::findOrFail($solicitud->user_id);

        return compact('solicitud', 'nombreAmbiente', 'ini', 'fin', 'user');
    }


    public function notificarInhabilitacion($idSolicitud){
        $datos = $this->obtenerDatosSolicitud($idSolicitud);

        // Disparar evento
        event(new NotificacionUsuario($datos['solicitud']->user_id, 'Nueva notificacion.'));
        $datos['user']->notify(new Inhabilitar(
            $datos['nombreAmbiente'],
            $datos['solicitud']->fechaReserva,
            $datos['ini']->horainicial,
            $datos['fin']->horafinal
        ));
    }
    
    public function notificarAceptacion($idSolicitud)
    {
        $datos = $this->obtenerDatosSolicitud($idSolicitud);
        $datos['user']->notify(new Aceptar(
            $datos['nombreAmbiente'],
            $datos['solicitud']->fechaReserva,
            $datos['ini']->horainicial,
            $datos['fin']->horafinal
        ));
    }

    public function notificarRechazo($idSolicitud)
    {
        $datos = $this->obtenerDatosSolicitud($idSolicitud);
        $datos['user']->notify(new Rechazar(
            $datos['nombreAmbiente'],
            $datos['solicitud']->fechaReserva,
            $datos['ini']->horainicial,
            $datos['fin']->horafinal,
            $datos['solicitud']->razonRechazo
        ));
    }

    public function solicitudRealizada($idSolicitud)
    {
        $datos = $this->obtenerDatosSolicitud($idSolicitud);
        $datos['user']->notify(new SolicitudR(
            $datos['nombreAmbiente'],
            $datos['solicitud']->fechaReserva,
            $datos['ini']->horainicial,
            $datos['fin']->horafinal
        ));
    }

    public function cancelarReserva($idSolicitud)
    {
        $datos = $this->obtenerDatosSolicitud($idSolicitud);

        // Encuentra a todos los docentes excepto al creador de la solicitud
        $docentes = User::role('docente')->where('id', '!=', $datos['solicitud']->user_id)->get();

        foreach ($docentes as $docente) {
            event(new NotificacionUsuario($docente->id, 'Ambiente Liberado.'));
            $docente->notify(new LiberacionAmbiente(
                $datos['nombreAmbiente'],
                $datos['solicitud']->fechaReserva,
                $datos['ini']->horainicial,
                $datos['fin']->horafinal
            ));
        }
    }

}
