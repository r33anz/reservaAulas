<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AtencionAutomatica extends Mailable
{
    use Queueable, SerializesModels;

    protected $horasFaltantes;
    protected $docente;
    protected $fecha;
    public function __construct($horasFaltantes,$docente,$fecha)
    {
        $this->horasFaltantes = $horasFaltantes;
        $this->docente = $docente;
        $this->fecha = $fecha;
    }

    public function build()
    {
        $texto = "El docente ".$this->docente." acaba de realizar  una solicitud \n ".
        "para la fecha ".$this->fecha." las horas faltantes para la expiracion son ".$this->horasFaltantes." \n"
        ." por lo que el sistema atendio automaticamente esta solicitud.";

        return $this->from('gestoradeambientesumss@gmail.com', 'Administracion')
                    ->text('mails.base')
                    ->with('texto', $texto);
    }
}
