<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SolicitudCreada
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    
    public $idSolicitud;
    public function __construct($idSolicitud)
    {
        $this->idSolicitud = $idSolicitud;
    }

}
