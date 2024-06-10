<?php

namespace App\Http\Controllers;

use App\Events\NotificationCreated;
use App\Models\User;
use Illuminate\Http\Request;
use App\Events\TeacherNotification;
use App\Events\BroadcastNotification;
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





    /*public function sendNotification(Request $request)
    {
        $message = $request->input('message');
        
        event(new NotificationCreated($message));
        
        return response()->json(['status' => 'Notification sent!']);
    }*/

    public function notificacionIndividual(Request $request){
        $id = $request->input('id');
        $mensaje = $request->input('mensaje');
    }

    public function broadcast(Request $request){
        $mensaje = $request->input('mensaje');
    }

    public function sendNotification(Request $request)
    {
        $teacherId = $request->input('teacher_id');
        $message = $request->input('message');
        
        event(new TeacherNotification($teacherId, $message));
        
        return response()->json(['status' => 'Notification sent!']);
    }

    public function sendBroadcastNotification(Request $request)
    {
        $message = $request->input('message');

        event(new BroadcastNotification($message));

        return response()->json(['status' => 'Broadcast notification sent!']);
    }

}
