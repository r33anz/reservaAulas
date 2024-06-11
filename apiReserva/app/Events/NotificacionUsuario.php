<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificacionUsuario implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $idUsuario;
    protected $mensaje;
    public function __construct($idUsuario,$mensaje)
    {
        $this->idUsuario = $idUsuario;
        $this->mensaje = $mensaje;
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
        return ['message' => $this->mensaje];
    }
}
