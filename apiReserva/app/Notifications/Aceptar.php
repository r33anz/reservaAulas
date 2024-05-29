<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Mail\SolicitudAceptada;

class Aceptar extends Notification
{
    use Queueable;

    protected $nombreAmbiente;
    protected $fecha;
    protected $ini;
    protected $fin;
    public function __construct( $nombreAmbiente,$fecha,$ini,$fin) 
    {
        
        $this->nombreAmbiente = $nombreAmbiente;
        $this->fecha =$fecha;
        $this->ini =$ini;
        $this->fin =$fin;
        
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new SolicitudAceptada($this->nombreAmbiente, $this->fecha, $this->ini, $this->fin))
        ->to($notifiable->email); }

    public function toDatabase($notifiable)
    {   
        return [
            'message' => 'Solicitud aceptada.',
            'data' => $this->formatearTextoNotificacion()
        ];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'Solicitud aceptada.',
            'data' => $this->formatearTextoNotificacion()
        ];
    }

    private function formatearTextoNotificacion()
    {
        return "Solicitud del ambiente " . $this->nombreAmbiente . "\n"
             . " con fecha " . $this->fecha . " y periodos \n"
             . $this->ini . "-" . $this->fin . " fue aprobada";
    }
}
