<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Mail\SolicitudRechazada;
class Rechazar extends Notification
{
    use Queueable;

    protected $nombreAmbiente;
    protected $fecha;
    protected $ini;
    protected $fin;
    protected $razon;
    public function __construct( $nombreAmbiente,$fecha,$ini,$fin,$razon) 
    {
        $this->nombreAmbiente = $nombreAmbiente;
        $this->fecha =$fecha;
        $this->ini =$ini;
        $this->fin =$fin;
        $this->razon =$razon;
    }

    public function via($notifiable)
    {
        return ['mail','database'];
    }

    
    public function toMail($notifiable)
    {
        return (new SolicitudRechazada($this->nombreAmbiente, $this->fecha, $this->ini, $this->fin,$this->razon))->to($notifiable->email);
    }

    public function toDatabase($notifiable)
    {   
        
        return [
            'message' => 'Solicitud rechazada.',
            'data' => $this->formatearTextoNotificacion()
        ];
    }
    public function toArray($notifiable)
    {
        
        return [
            'message' => 'Solicitud rechazada.',
            'data' => $this->formatearTextoNotificacion()
        ];
    }

    private function formatearTextoNotificacion()
    {
        return "Solcitud del ambiente ".$this->nombreAmbiente."\n"
        ." con fecha ".$this->fecha." y periodos \n"
        .$this->ini."-".$this->fin." fue rechazada \n"
        ."debido a ".$this->razon;
    }
    
}
