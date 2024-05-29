<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SolicitudAceptada extends Mailable
{
    use Queueable, SerializesModels;

    
    protected $nombreAmbiente;
    protected $fecha;
    protected $ini;
    protected $fin;

    public function __construct($nombreAmbiente, $fecha, $ini, $fin)
    {
        $this->nombreAmbiente = $nombreAmbiente;
        $this->fecha = $fecha;
        $this->ini = $ini;
        $this->fin = $fin;
    }

    public function build()
    {
        $texto = "Motivo de informarle que la solicitud que usted realizo con \n"
               . "la fecha " . $this->fecha . " ,del ambiente " . $this->nombreAmbiente . "\n"
               . "con los periodos reservados de " . $this->ini . " hasta " . $this->fin . " ha sido aceptada.";

        return $this->from('gestoradeambientesumss@gmail.com', 'Administracion')
                    ->text('mails.base')
                    ->with('texto', $texto);
    }
}
