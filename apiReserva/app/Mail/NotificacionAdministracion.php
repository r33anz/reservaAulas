<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificacionAdministracion extends Mailable
{
    use Queueable, SerializesModels;


    
    protected $mensaje;
    public function __construct($mensaje)
    {
        $this->mensaje = $mensaje;   
    }

    
    public function build()
    {
        return $this->from('gestoradeambientesumss@gmail.com', 'Administracion')
                    ->text('mails.base')
                    ->with('texto', $this->mensaje);
    }
}
