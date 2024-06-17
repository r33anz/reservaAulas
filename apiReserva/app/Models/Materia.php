<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
class Materia extends Model
{
    use HasFactory;
    protected $guardered = [];

    protected $table = 'materias';

    public function docentes():BelongsToMany
    {
        return $this->belongsToMany(User::class, 'docente_materia')
                    ->withPivot('grupo')
                    ->withTimestamps();
    }
}



