<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReservaInhabilitada extends Mailable
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
        
        
        $texto = "Motivo de informarle que la reserva que usted tenia \n"
                ."la fecha ".$this->fecha." ,del ambiente ".$this->nombreAmbiente."\n"
                ."con los periodos reservados de ".$this->ini." hasta ".$this->fin." han sido inhabilitados \n"
                ."Pedirle que realize otra solicitud de reserva consultando la nueva disponibilidad de horarios.";

        return $this->from('gestoradeambientesumss@gmail.com','Administracion')
                    ->text('mails.base')
                    ->with('texto',$texto);
    }
}
