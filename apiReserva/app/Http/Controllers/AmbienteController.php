<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ambiente;
use App\Models\Piso;
class AmbienteController extends Controller
{
    public function index()
    {
        $ambientes = Ambiente::all();
        return response()->json($ambientes);
    }

    public function show($id)
    {
        $ambiente = Ambiente::find($id);
        if (!$ambiente) {
            return response()->json(['error' => 'Ambiente no encontrado'], 404);
        }
        return response()->json($ambiente);
    }

    public function store(Request $request){
        $nombre = $request->input('nombre');
        $capacidad = $request->input('capacidad');
        $idBloque = $request->input('idBloque');
        $piso = $request->input('piso');
        $tipo = $request->input('tipo');
        $descripcion = $request->input('descripcion');

        $idPiso = Piso::where('bloque_id', $idBloque)
                    ->where('nroPiso', $piso)
                    ->first();

        Ambiente::create([
            'piso_id' => $idPiso->id,
            'nombre' => $nombre,
            'capacidad' => $capacidad,
            'tipo' => $tipo,
            'descripcion' => $descripcion
        ]);

        return response()->json([
            'success' => true,
        ]);
         
    }

    public function buscar(Request $request){
        $patron = $request->input('patron');
        $resultado = Ambiente::where('nombre','like','%'.$patron.'%')
                                ->select('id','nombre')
                                ->get();
        return response()->json([
            'respuesta' => $resultado
        ]);
    }
}
