<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SolicitudUrgente extends Mailable
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
                "para la fecha ".$this->fecha." urgiendole en atenderla lo mas pronto posible \n".
                "las horas faltantes para la expiracion son ".$this->horasFaltantes;

        return $this->from('gestoradeambientesumss@gmail.com', 'Administracion')
                    ->text('mails.base')
                    ->with('texto', $texto);
    }
}
