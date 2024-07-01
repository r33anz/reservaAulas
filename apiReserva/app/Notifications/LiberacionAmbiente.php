<?php

namespace App\Notifications;

use App\Mail\AmbienteLiberado;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LiberacionAmbiente extends Notification
{
    use Queueable;

    protected $nombreAmbiente;
    protected $fechaReserva;
    protected $horaInicio;
    protected $horaFin;

    public function __construct($nombreAmbiente, $fechaReserva, $horaInicio, $horaFin)
    {
        $this->nombreAmbiente = $nombreAmbiente;
        $this->fechaReserva = $fechaReserva;
        $this->horaInicio = $horaInicio;
        $this->horaFin = $horaFin;
    }

    
    public function via($notifiable)
    {
        return ['mail','database'];
    }

    
    public function toMail($notifiable)
    {
        return (new AmbienteLiberado($this->nombreAmbiente, $this->fechaReserva,$this->horaInicio,$this->horaFin))
        ->to($notifiable->email); 
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'Ambiente Liberado',
            'data' => "El ambiente ".$this->nombreAmbiente." a sido liberado \n"
                    ."en la fecha ".$this->fechaReserva. " de los periodos\n"
                    .$this->horaInicio." hasta ".$this->horaFin
        ];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => 'Ambiente Liberado',
            'data' => "El ambiente ".$this->nombreAmbiente." a sido liberado \n"
                    ."en la fecha ".$this->fechaReserva. " de los periodos\n"
                    .$this->horaInicio." hasta ".$this->horaFin
        ];
    }
}
