<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class Cancelada extends Notification
{
    use Queueable;


    public function __construct()
    {
        
    }

    
    public function via($notifiable)
    {
        return ['database','mail'];
    }

    public function toArray($notifiable)
    {
        return [
            
        ];
    }
}
