<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inhabilitado;
use App\Models\Periodo;
use App\Models\Ambiente;

class InhabilitadoController extends Controller
{
    /// Habilitar ambiente
    public function habilitarAmbiente(Request $request){
        $idAmbiente = $request->input('idAmbiente');
        $idPeriodos = $request->input('idPeriodos');
        $fecha = $request->input('fecha');

        Inhabilitado::habilitar($idAmbiente, $idPeriodos, $fecha);
        return response()->json(['message' => 'Registros eliminados con éxito'], 200);
        
    }

    // Inhabilitar ambiente
    public function inhabilitarAmbiente(Request $request){
        $idAmbiente = $request->input('idAmbiente');
        $idPeriodos = $request->input('idPeriodos');
        $fecha = $request->input('fecha');

        Inhabilitado::inhabilitar($idAmbiente, $idPeriodos, $fecha);
        return response()->json(['message' => 'Registros agregados con éxito'], 200);
        
    }

    // Buscar periodos inhabilitados
    public function buscarPeriodos(Request $request){
        $idAmbiente = $request->input('idAmbiente');
        $fecha = $request->input('fecha');

        $periodosInhabilitados = Inhabilitado::buscarPeriodos($idAmbiente, $fecha);
        return response()->json(['periodos' => $periodosInhabilitados], 200);
    }

}