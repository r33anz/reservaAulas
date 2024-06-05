<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SolicitudRealizada extends Mailable
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
        $texto = "La solicitud que usted realizo con \n"
               . "la fecha " . $this->fecha . " ,del ambiente " . $this->nombreAmbiente . "\n"
               . "con los periodos reservados de " . $this->ini . " hasta " . $this->fin . " se realizo con exito.";

        return $this->from('gestoradeambientesumss@gmail.com', 'Administracion')
                    ->text('mails.base')
                    ->with('texto', $texto);
    }
}
