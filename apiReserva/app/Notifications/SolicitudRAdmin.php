<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SolicitudRAdmin extends Notification
{
    use Queueable;

    protected $docente;
    protected $fecha;
    public function __construct( $docente,$fecha) 
    {
        
        $this->docente = $docente;
        $this->fecha = $fecha;
        
    }

    public function via($notifiable)
    {
        return ['database'];
    }

  
    public function toDatabase($notifiable)
    {   
        return [
            'message' => 'Solicitud realizada.',
            'data' => $this->formatearTextoNotificacion()
        ];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'Solicitud realizada.',
            'data' => $this->formatearTextoNotificacion()
        ];
    }

    private function formatearTextoNotificacion()
    {
        return "El docente " . $this->docente . "\n"
             . " acaba de realizar una solicitud \n"
             ." para la fecha ".$this->fecha;
    }
}
