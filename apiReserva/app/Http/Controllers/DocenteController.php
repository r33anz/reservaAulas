<?php

namespace App\Http\Controllers;

use App\Models\User;
class DocenteController extends Controller
{
    public function getMaterias($id){ 
        $docente = User::findOrFail($id);
        $materiasConGrupos = $docente->materias()->get()->groupBy('nombreMateria')->map(function ($materias) {
            $grupos = $materias->pluck('pivot.grupo');
            return [
                'grupos' => $grupos
            ];
        });

        return response()->json([
            'nombre'=>  $docente->name,
            'materias' => $materiasConGrupos
        ]);
    }
    
    public function getAllDocenteNames(){
        $docentes = User::whereHas('materias')->with('materias')->get();
        // Ordenar los docentes por nombre
        $docentes = $docentes->sortBy('name')->values();
        // Estructurar los datos
        $docentesConMaterias = $docentes->map(function ($docente) {
            $materiasConGrupos = $docente->materias->groupBy('nombreMateria')->map(function ($materias) {
                $grupos = $materias->pluck('pivot.grupo');
                return [
                    'grupos' => $grupos
                ];
            });

            return [
                'id' => $docente->id,
                'nombre' => $docente->name,
                'email'=> $docente->email,
                'materias' => $materiasConGrupos
            ];
        });

        return response()->json($docentesConMaterias);
    }
}
