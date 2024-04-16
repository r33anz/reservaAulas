<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solicitud extends Model
{
    use HasFactory;
    protected $fillable = ['docente_id','materia','cantidad','razon','fechaReserva','periodo_ini_id','periodo_fin_id','estado','grupo'];

                        
    public function docente()
        {
            return $this->belongsTo(Docente::class);
        }                    

    
}
