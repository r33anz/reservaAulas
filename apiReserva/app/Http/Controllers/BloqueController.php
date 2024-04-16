<?php

namespace App\Http\Controllers;

use App\Models\Bloque;
use Illuminate\Http\Request;
use App\Models\Piso;
class BloqueController extends Controller
{
    /*public function index(){
        $piso = Piso::find(1);
        return view("index",compact("piso"));

    }*/
    public function index()
    {
        $bloques = Bloque::all();
        return response()->json($bloques);
    }

    public function show($id)
    {
        $bloque = Bloque::find($id);
        if (!$bloque) {
            return response()->json(['error' => 'Bloque no encontrado'], 404);
        }
        return response()->json($bloque);
    }
}
