<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Mail\SolicitudUrgente;
class SolicitudUrgenteN extends Notification
{
    use Queueable;

    protected $horasFaltantes;
    protected $docente;
    protected $fecha;
    public function __construct($horasFaltantes,$docente,$fecha)
    {
        $this->horasFaltantes = $horasFaltantes;
        $this->docente = $docente;
        $this->fecha = $fecha;
    }

    
    public function via($notifiable)
    {
        return ['mail','database'];
    }


    public function toMail($notifiable)
    {
        return (new SolicitudUrgente($this->horasFaltantes, $this->docente, $this->fecha))
        ->to($notifiable->email); }

    public function toDatabase($notifiable)
    {   
        return [
            'message' => 'Solicitud urgente realizada.',
            'data' => $this->formatearTextoNotificacion()
        ];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'Solicitud urgente realizada.',
            'data' => $this->formatearTextoNotificacion()
        ];
    }

    private function formatearTextoNotificacion()
    {
        return "El docente ".$this->docente." acaba de realizar  una solicitud \n ".
                "para la fecha ".$this->fecha." urgiendole en atenderla lo mas pronto posible \n".
                "las horas faltantes para la expiracion son ".$this->horasFaltantes;
    }
}
