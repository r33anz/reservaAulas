<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Materia;
class Docente extends Model
{
    use HasFactory;
    protected $guarded = [];


    public function materias(){
        return $this->belongsToMany(Materia::class,'docente_materia')->withPivot('grupo');
    }

    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
} 
