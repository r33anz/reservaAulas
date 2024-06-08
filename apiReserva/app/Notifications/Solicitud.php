<?php

namespace App\Notifications;

use App\Mail\SolicitudRealizada;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class Solicitud extends Notification
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
        return ['email'];
    }

    public function toMail($notifiable)
    {
        return (new SolicitudRealizada($this->nombreAmbiente, $this->fecha, $this->ini, $this->fin))
        ->to($notifiable->email); 
    }

}
