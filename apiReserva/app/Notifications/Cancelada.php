<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class Cancelada extends Notification
{
    use Queueable;


    protected $nombreAmbiente;
    protected $fecha;
    protected $ini;
    protected $fin;
    protected $nombre;
    public function __construct( $nombreAmbiente,$fecha,$ini,$fin,$nombre) 
    {
        
        $this->nombreAmbiente = $nombreAmbiente;
        $this->fecha =$fecha;
        $this->ini =$ini;
        $this->fin =$fin;
        $this->nombre=$nombre;
    }

    
    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            
        ];
    }

    public function toDatabase($notifiable)
    {   
        return [
            'message' => 'Reserva Cancelada.',
            'data' => $this->formatearTextoNotificacion()
        ];
    }

    private function formatearTextoNotificacion()
    {
        return "El docente " .$this->nombre." cancelo su reserva del ambiente ". $this->nombreAmbiente . "\n"
             . " con fecha " . $this->fecha . " y periodos \n"
             . $this->ini . "-" . $this->fin .".";
    }
}
