<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ambiente;
use App\Models\Piso;
use App\Http\Requests\AmbienteRequest;
use App\Services\AmbienteService;

class AmbienteController extends Controller
{

    protected $ambienteService;

    public function __construct(AmbienteService $ambientes){
        $this->ambienteService = $ambientes;
    }

    public function index(){
        $ambientes = $this->ambienteService->todosAmbientes();
    
        return response()->json(['respuesta' => $ambientes]);
    }

    public function show($id){
        $ambiente = Ambiente::find($id);
        if (!$ambiente) {
            return response()->json(['error' => 'Ambiente no encontrado'], 404);
        }
        
        $piso = $ambiente->piso;
        $bloque = $piso->bloque;
        $nombreBloque = $bloque->nombreBloque;
        $nroPiso = $piso->nroPiso;

        return response()->json([
            'nombre' => $ambiente->nombre,
            'capacidad' => $ambiente->capacidad,
            'tipo' => $ambiente->tipo,
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

        $idPiso = Piso::where('bloque_id', $idBloque)
                      ->where('nroPiso', $piso)
                      ->first();
        
        Ambiente::create([
            'piso_id' => $idPiso->id,
            'nombre' => $nombre,
            'capacidad' => $capacidad,
            'tipo' => $tipo
        ]);

        return response()->json([
            'success' => true,
        ]);
         
    }

    
    public function buscarV2(Request $request){
        $patron = $request->input('patron');
        $patronSinEspacios = trim($patron);

        if (empty($patronSinEspacios)) {
            return response()->json(["coincidencias" => []]);
        }

        $resultados = $this->ambienteService->buscarPorNombre($patronSinEspacios);
        
        return response()->json([
            'coincidencias' => $resultados
        ]);
    }

    public function buscarPorCapacidad(Request $request){ 
        $minCapacidad = $request->input('minCapacidad', 0);
        $maxCapacidad = $request->input('maxCapacidad', 100);

        $resultados = $this->ambienteService->buscarPorCapacidad($minCapacidad, $maxCapacidad);

        return response()->json([
            'respuesta' => $resultados
        ]);
    }

    public function maximoMinimo(){
        $maxCapacidad = Ambiente::max('capacidad');
        $minCapacidad = Ambiente::min('capacidad');

        return response()->json([
            'maxCapacidad' => $maxCapacidad,
            'minCapacidad' => $minCapacidad
        ]);
    }

    public function busquedaAmbientesporCantidadFechaPeriodo(Request $request){
        $cantidad = $request->input('cantidad');
        $fecha = $request->input('fecha');
        $periodos = $request->input('periodos');
        
        $response = $this->ambienteService->busquedaAmbientesporCantidadFechaPeriodo($cantidad, $fecha, $periodos);

        if (isset($response[0]->mensaje)) {
            return response()->json($response);
        }

        return response()->json($response);
    }

    
}