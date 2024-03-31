<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inhabilitado;
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
            Inhabilitado::where('ambiente_id', $idAmbiente)
                        ->where('periodo_id', $idPeriodo)
                        ->where('fecha', $fecha)
                        ->delete();
        }
        return response()
            ->json(['message' => 'Registros eliminados con éxito']);

    }
    //inhabilitar ambiemte
        //agregar
    
    public function inhabilitarAmbiente(Request $request){
        $idAmbiente = $request->input('idAmbiente');
        $idPeriodos = $request->input('idPeriodos'); // lista []
        $fecha = $request->input('fecha');
        
        foreach ($idPeriodos as $idPeriodo) {
            
            Inhabilitado::create([
                'ambiente_id' => $idAmbiente,
                'periodo_id' => $idPeriodo,
                'fecha' => $fecha,
            ]);
        }
        return response()
            ->json(['message' => 'Registros agregados con éxito']);
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
