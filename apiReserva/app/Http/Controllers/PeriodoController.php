<?php

namespace App\Http\Controllers;

use App\Models\Periodo;
use Illuminate\Http\Request;

class PeriodoController extends Controller
{
    public function index()
    {
        $Periodos = Periodo::all();
        return response()->json($Periodos);
    }

    public function show($id)
    {
        $Periodo = Periodo::find($id);
        if (!$Periodo) {
            return response()->json(['error' => 'Periodo no encontrado'], 404);
        }
        return response()->json($Periodo);
    }

    public function getPeriodos()
    {

        $periodos = Periodo::select('horainicial', 'horafinal')->get();
        return response()->json($periodos);
    }
}
