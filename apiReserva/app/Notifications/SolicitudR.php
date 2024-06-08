<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Mail\SolicitudRealizada;
class SolicitudR extends Notification
{
   
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
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new SolicitudRealizada($this->nombreAmbiente, $this->fecha, $this->ini, $this->fin))
        ->to($notifiable->email); 
    }

    public function toArray($notifiable)
    {
        return [
        ];
    }
}
