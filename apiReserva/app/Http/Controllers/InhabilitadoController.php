<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inhabilitado;
use App\Models\Periodo;
use App\Models\Ambiente;

class InhabilitadoController extends Controller
{
    //habilitar ambiente curso/fecha/periodo
    //eliminar
    public function habilitarAmbiente(Request $request){
        $idAmbiente = $request->input('idAmbiente');
        $idPeriodos = $request->input('idPeriodos'); // lista []
        $fecha = $request->input('fecha');
        
        foreach ($idPeriodos as $idPeriodo) {
            // Eliminar registros que coincidan con los tres parámetros
            if (!Periodo::find($idPeriodo)) {
                return response()->json(['message' => 'El periodo no existe.'], 404);
            }
            if (!Ambiente::find($idAmbiente)) {
                return response()->json(['message' => 'El curso  introducido  no existe.'], 404);
            }
            Inhabilitado::where('ambiente_id', $idAmbiente)
                        ->where('periodo_id', $idPeriodo)
                        ->where('fecha', $fecha)
                        ->delete();
        }
        return response()
            ->json(['message' => 'Registros eliminados con éxito'],200);
    }

    //inhabilitar ambiemte
    //agregar
    public function inhabilitarAmbiente(Request $request){
        $idAmbiente = $request->input('idAmbiente');
        $idPeriodos = $request->input('idPeriodos'); // lista []
        $fecha = $request->input('fecha');
        
        foreach ($idPeriodos as $idPeriodo) {
            
            if (!Periodo::find($idPeriodo)) {
                return response()->json(['message' => 'El periodo ' . $idPeriodo . ' no existe.'], 404);
            }
            if (!Ambiente::find($idAmbiente)) {
                return response()->json(['message' => 'El curso  introducido ' . $idPeriodo . ' no existe.'], 404);
            }
            Inhabilitado::create([
                'ambiente_id' => $idAmbiente,
                'periodo_id' => $idPeriodo,
                'fecha' => $fecha,
            ]);
        }
        return response()
            ->json(['message' => 'Registros agregados con éxito'],200);
    }
    //buscar inhabilitados
    // devuelve lista de periodos inhabilitados
    public function buscarPeriodos(Request $request){
        $idAmbiente = $request->input('idAmbiente');
        $fecha = $request->input('fecha');

        $periodosInhabilitados = Inhabilitado::select('periodo_id')
                                        ->where('ambiente_id', $idAmbiente)
                                        ->where('fecha', $fecha)
                                        ->pluck('periodo_id')
                                        ->toArray();

        return response()->json(['periodos' => $periodosInhabilitados], 200);
    }

}