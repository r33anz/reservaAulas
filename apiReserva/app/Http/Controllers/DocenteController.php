<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Http\Resources\DocenteResource;
class DocenteController extends Controller
{
    public function getMaterias($id){
        $docente = Docente::findOrFail($id);

        $materiasConGrupos = $docente->materias()->get()->groupBy('nombreMateria')->map(function ($materias) {
            $grupos = $materias->pluck('pivot.grupo');
            return [
                'grupos' => $grupos
            ];
        });

        return response()->json([
            'nombre'=>  $docente->nombre,
            'materias' => $materiasConGrupos
        ]);
    }
    public function getAllDocenteNames()
    {
        $docentes = Docente::with('materias')->get();
        $docentes = $docentes->sortBy('nombre')->values();

        // Estructurar los datos
        $docentesConMaterias = $docentes->map(function ($docente) {
            $materiasConGrupos = $docente->materias->groupBy('nombreMateria')->map(function ($materias) {
                $grupos = $materias->pluck('pivot.grupo');
                return [
                    'grupos' => $grupos
                ];
            });

            return [
                'nombre' => $docente->nombre,
                'materias' => $materiasConGrupos
            ];
        });

        return response()->json($docentesConMaterias);
    }
}
