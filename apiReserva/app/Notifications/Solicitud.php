<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class Solicitud extends Notification
{
    use Queueable;

    
    public function __construct()
    {
       
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    
    public function toMail($notifiable)
    {
        
    }

    
    public function toArray($notifiable)
    {
        return [
            'message' => 'Nueva solicitud realizada'
        ];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => 'Nueva solicitud realizada'
        ];
    }
}
