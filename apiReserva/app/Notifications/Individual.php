<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Mail\NotificacionAdministracion;
class Individual extends Notification
{
    use Queueable;

    protected $mensaje;
    public function __construct($mensaje)
    {
        $this->mensaje = $mensaje;
    }

    
    public function via($notifiable)
    {
        return ['mail','database'];
    }

    
    public function toMail($notifiable)
    {
        return (new NotificacionAdministracion($this->mensaje))
        ->to($notifiable->email);
    }

    public function toDatabase($notifiable){
        return [
            'message' => 'Notificacion',
            'data' => $this->mensaje
        ];
    }
    public function toArray($notifiable)
    {
        return [
            'message' => 'Notificacion',
            'data' => $this->mensaje
        ];
    }
}
