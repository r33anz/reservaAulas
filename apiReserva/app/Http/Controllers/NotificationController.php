<?php

namespace App\Http\Controllers;

use App\Events\NotificationCreated;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function marcarNotificacionLeida(Request $request){
        $idUsuario = $request->input('idUsuario');
        $notificacionesId = $request->input('notificacionesID'); //[]

        $user = User::find($idUsuario);
        foreach($notificacionesId as $notificacion){
            $noti = $user->notifications()->find($notificacion);
            if($noti){
                $noti->markAsRead();
            }
        }

        return response()->json([
            'message' => 'Notificaciones marcadas como leídas'
        ]);
    }

    public function recuperarNotificacionesNoLeidas($idUsuario){
        $user = User::find($idUsuario);
        $notificacionesNoLeidas = $user->unreadNotifications;
    
        return response()->json($notificacionesNoLeidas);
    }


    public function recuperarNotificaciones($idUsuario){
        $user = User::find($idUsuario);
        $notificaciones = $user->notifications;
    
        return response()->json($notificaciones);
    }
    public function sendNotification(Request $request)
    {
        $message = $request->input('message');
        
        event(new NotificationCreated($message));
        
        return response()->json(['status' => 'Notification sent!']);
    }

}
