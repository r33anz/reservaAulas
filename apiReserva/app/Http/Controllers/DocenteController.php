<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Http\Resources\DocenteResource;
class DocenteController extends Controller
{
    public function getMaterias($id){
        $docente = Docente::findOrFail($id);
        $materias = $docente->materias->pluck('nombreMateria');
        return  response()->json([
            'materias' => $materias
        ]);
    }
}
