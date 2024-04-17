<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Http\Resources\DocenteResource;
class DocenteController extends Controller
{
    public function getMaterias($id){
        $docente = Docente::findOrFail($id);
        $materias = $docente->materias()->get()->map(function ($materia) {
            return [
                'nombreMateria' => $materia->nombreMateria,
                'grupo' => $materia->pivot->grupo
            ];
        });
    
        return response()->json([
            'materias' => $materias
        ]);
    }
}
