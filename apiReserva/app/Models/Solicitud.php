<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solicitud extends Model
{
    use HasFactory;
    protected $fillable = ['docente_id', 'materia', 'cantidad', 'razon', 'fechaReserva', 'periodo_ini_id', 'periodo_fin_id', 'estado', 'grupo'];


    public function docente()
    {
        return $this->belongsTo(Docente::class);
    }

    public function ambientes()
    {
        return $this->belongsToMany(Ambiente::class, 'ambiente_solicitud', 'solicitud_id', 'ambiente_id');
    }

    public function periodoInicial()
    {
        return $this->belongsTo(Periodo::class, 'periodo_ini_id');
    }

    public function periodoFinal()
    {
        return $this->belongsTo(Periodo::class, 'periodo_fin_id');
    }
}
