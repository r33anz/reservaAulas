<?php

namespace App\Services;
use App\Models\Ambiente;
class AmbienteService{

    public function todosAmbientes(){
        $ambientes = collect(Ambiente::all(['id', 'nombre'])->toArray())->unique()->values();
        return $ambientes;
    }
}
