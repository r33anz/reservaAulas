<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function marcarNotificacionLeida(Request $request){ // se hara de forma individual
        $idUsuario = $request->input('idUsuario');
        $notificacionId = $request->input('notificacioneID');

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
            ];
        });

        return response()->json($notificaciones);
    }

    public function notificacionIndividual(Request $request){
        $id = $request->input('id');
        $mensaje = $request->input('mensaje');
    }

    public function broadcast(Request $request){
        $mensaje = $request->input('mensaje');
    }

}
