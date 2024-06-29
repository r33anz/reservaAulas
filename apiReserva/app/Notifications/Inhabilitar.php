<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Mail\ReservaInhabilitada;
class Inhabilitar extends Notification
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
        return ['mail','database'];
    }

    
    public function toMail($notifiable)
    {
        return (new ReservaInhabilitada($this->nombreAmbiente, $this->fecha, $this->ini, $this->fin))->to($notifiable->email);
    }

    
    public function toDatabase($notifiable)
    {   
            return [
            'message' => 'Reserva/Solicitud Cancelada.',
            'data' => $this->formatearTextoNotificacion()
        ];
    }
    public function toArray($notifiable)
    {
        return [
            'message' => 'Reserva/Solicitud Cancelada.',
            'data' => $this->formatearTextoNotificacion()
        ];
    }

    private function formatearTextoNotificacion()
    {
        return "Reserva/Solicitud del ambiente ".$this->nombreAmbiente."\n"
        ."con fecha ".$this->fecha." y periodos \n"
        .$this->ini."-".$this->fin." fue cancelada por\n la inhabilitación de los periodos del ambiente\n" 
        ."Realize otra reserva con las nueva disponibilidades de horarios.";
    }
}
