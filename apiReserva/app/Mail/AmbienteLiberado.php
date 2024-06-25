<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AmbienteLiberado extends Mailable
{
    use Queueable, SerializesModels;

    public $nombreAmbiente;
    public $fechaReserva;
    public $horaInicio;
    public $horaFin;

    public function __construct($nombreAmbiente, $fechaReserva, $horaInicio, $horaFin)
    {
        $this->nombreAmbiente = $nombreAmbiente;
        $this->fechaReserva = $fechaReserva;
        $this->horaInicio = $horaInicio;
        $this->horaFin = $horaFin;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $texto = "El ambiente ".$this->nombreAmbiente." a sido liberado \n"
                ."en la fecha ".$this->fechaReserva. " de los periodos\n"
                .$this->horaInicio." hasta ".$this->horaFin;

        return $this->from('gestoradeambientesumss@gmail.com', 'Administracion')
                    ->text('mails.base')
                    ->with('texto', $texto);
    }
}
