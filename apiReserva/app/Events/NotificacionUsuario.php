<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificacionUsuario
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $idUsuario;
    public function __construct($idUsuario)
    {
        $this->idUsuario = $idUsuario;
    }

    public function broadcastOn()
    {
        return new Channel('usuario.'.$this->idUsuario);
    }
    public function broadcastAs()
    {
        return 'NotificacionUsuario';
    }

    public function broadcastWith()
    {
        return ['message' => 'Nueva Notificacion'];
    }
}
////

/* Docente
const userID = sessionStorage.getItem('id');

    useEffect(() => {
        if (userID) {
            console.log(`Subscribing to channel: usuario.${userID}`);
                const userChannel = echo.channel(`usuario.${userID}`);
                userChannel.listen('.NotificacionUsuario', (e) => {
                    console.log(`Event received: ${e.message}`);
                });

                const broadcastChannel = echo.channel('broadcast');
                broadcastChannel.listen('.BroadcastNotification', (e) => {
                    console.log(`Broadcast event received: ${e.message}`);
                });

            return () => {
                userChannel.stopListening('.NotificacionUsuario');
                echo.leaveChannel(`usuario.${userID}`);

                broadcastChannel.stopListening('.BroadcastNotification');
                echo.leaveChannel('broadcast');
            };
        }
    }, [userID]);
*/

/* Admin
const userID = sessionStorage.getItem('id');
useEffect(() => {
        if (userID) {
            console.log(`Subscribing to channel: usuario.${userID}`);
                const userChannel = echo.channel(`usuario.${userID}`);
                userChannel.listen('.NotificacionUsuario', (e) => {
                    console.log(`Event received: ${e.message}`);
                });

            return () => {
                userChannel.stopListening('.NotificacionUsuario');
                echo.leaveChannel(`usuario.${userID}`);

            };
        }
    }, [userID]);
*/

/* echo 

*/