<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inhabilitado extends Model
{
    use HasFactory;
    protected $fillable = ['id_ambiente','id_periodo','fecha'];

    public function ambiente()
    {
        return $this->belongsTo(Ambiente::class);
    }

    public function periodo()
    {
        return $this->belongsTo(Periodo::class);
    }
}
