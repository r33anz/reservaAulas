<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bloque extends Model
{
    use HasFactory;
    public function pisos(): HasMany{
        return $this->hasMany(Piso::class);
    }
}
