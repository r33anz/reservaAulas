<?php

namespace App\Http\Controllers;

use App\Events\NotificacionGeneral;
use App\Events\NotificacionUsuario;
use App\Models\User;
use App\Notifications\Individual;
use Illuminate\Http\Request;
use App\Jobs\NotificacionGeneralJ;
class NotificationController extends Controller
{
    public function marcarNotificacionLeida(Request $request){
        $idUsuario = $request->input('idUsuario');
        $notificacionId = $request->input('notificacionId');

        $user = User::find($idUsuario);    
        $noti = $user->notifications()->find($notificacionId);
        if($noti){
            $noti->markAsRead();
        }
    }

    public function recuperarNotificaciones($idUsuario){
        $user = User::find($idUsuario);
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $notificaciones = $user->notifications()->orderBy('created_at', 'desc')->get()->map(function($notificacion) {
            return [
                'id' => $notificacion->id,
                'type' => $notificacion->type,
                'data' => $notificacion->data,
                'read_at' => $notificacion->read_at,
                'created_at'=>$notificacion->created_at
            ];
        });

        return response()->json($notificaciones);
    }

    public function notificacionIndividual(Request $request){
        $id = $request->input('id');
        $mensaje = $request->input('mensaje');

        
        $user = User::find($id);
        $user->notify(new Individual($mensaje));
        event(new NotificacionUsuario($id,'Nueva notificacion.'));
        return response()->json([
            'mensaje' => 'Mensaje mandado exitosamente'
        ]);
    }

    public function broadcast(Request $request){
        $mensaje = $request->input('mensaje');

        NotificacionGeneralJ::dispatch($mensaje);
        event(new NotificacionGeneral($mensaje));
        return response()->json([
            'mensaje' => 'Mensaje mandado exitosamente'
        ]);
    }

}
