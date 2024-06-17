<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SolicitudRAdmin extends Notification
{
    use Queueable;

    
    protected $nombreAmbiente;
    protected $docente;
    protected $materia;
    public function __construct( $nombreAmbiente,$docente,$materia) 
    {
        $this->nombreAmbiente = $nombreAmbiente;
        $this->docente = $docente;
        $this->materia = $materia;
        
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
             . " solicito reserva del ambiente " . $this->nombreAmbiente . "\n"
             ." para la materia ".$this->materia;
    }
}
