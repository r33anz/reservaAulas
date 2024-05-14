<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ambiente;
use App\Models\Piso;
use App\Http\Requests\AmbienteRequest;
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
        
        
        $piso = $ambiente->piso;
        $bloque = $piso->bloque;
        $nombreBloque = $bloque->nombreBloque;
        $nroPiso = $piso->nroPiso;

        return response()->json([
        'nombre'=>$ambiente->nombre,
        'capacidad'=>$ambiente->capacidad,
        'tipo'=>$ambiente->tipo,
        'nombreBloque' => $nombreBloque,
        'nroPiso' => $nroPiso
        ]);
    }

    public function store(AmbienteRequest $request){
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
            //'descripcion' => $descripcion
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

    public function buscarV2(Request $request){
        $patron = $request->input('patron');
        $resultados = Ambiente::where('nombre', 'like', '%' . $patron . '%')
        ->with(['piso.bloque'])
        ->get();

    $listaCoincidencias = [];
    foreach ($resultados as $resultado) {
        $piso = $resultado->piso;
        $bloque = $piso->bloque;

        $detalleAula = [
            'id' => $resultado->id,
            'nombre' => $resultado->nombre,
            'capacidad' => $resultado->capacidad,
            'tipo' => $resultado->tipo,
            'nombreBloque' => $bloque->nombreBloque,
            'nroPiso' => $piso->nroPiso,
        ];

        $listaCoincidencias[] = $detalleAula;
    }

    return response()->json([
        'coincidencias' => $listaCoincidencias
    ]);
    }
    public function ambientesMismoBloque($id)
        {
            $ambiente = Ambiente::findOrFail($id);
            $ambientesEnMismoBloque = Ambiente::whereHas('piso', function ($query) use ($ambiente) {
                $query->where('bloque_id', $ambiente->piso->bloque_id);
            })->get();

            return response()->json(['ambientes' => $ambientesEnMismoBloque]);
        }

    public function ambientesMismoPiso($id)
    {
        $ambiente = Ambiente::findOrFail($id);
        $ambientesEnMismoPiso = $ambiente->piso->ambientes;

        return response()->json(['ambientes' => $ambientesEnMismoPiso]);
    }
}
