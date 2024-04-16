<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ambiente extends Model
{
    use HasFactory;
    protected $fillable = [
        'piso_id', 'nombre', 'capacidad', 'tipo', 'descripcion',
    ];

    public function piso(): BelongsTo
    {
        return $this->belongsTo(Piso::class);
    }

    public function inhabilitados()
    {
        return $this->hasMany(Inhabilitado::class);
    }
}
