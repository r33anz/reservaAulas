<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ambiente;
use App\Models\Piso;
use App\Http\Requests\AmbienteRequest;
use App\Models\Inhabilitado;
use App\Models\Solicitud;
use App\Services\AmbienteService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class AmbienteController extends Controller
{

    protected $ambientesTodos;

    public function __construct(AmbienteService $ambientes)
    {
        $this->ambientesTodos = $ambientes;
    }

    public function index()
    {
        $ambientes = Ambiente::all()->map(function ($ambiente) {
            return [
                'id' => $ambiente->id,
                'nombre' => $ambiente->nombre,
            ];
        });
    
        return response()->json(['respuesta' => $ambientes]);
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
        $patronSinEspacios = trim($patron);

        if (empty($patronSinEspacios)) {
            return response()->json(["respuesta"  =>  []]);
        }
        $resultado = Ambiente::where('nombre','like','%'.$patron.'%')
                                ->select('id','nombre')
                                ->get();
        return response()->json([
            'respuesta' => $resultado
        ]);
    }

    public function buscarV2(Request $request){
        $patron = $request->input('patron');
        $patronSinEspacios = trim($patron);

        if (empty($patronSinEspacios)) {
            return response()->json(["coincidencias"  =>  []]);
        }
        $resultados = Ambiente::where('nombre', 'like', '%'.$patron.'%')
        ->get();
       
        $listaCoincidencias = [];
        foreach ($resultados as $resultado){
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

    public function ambientesMismoBloque($id){
            $ambiente = Ambiente::findOrFail($id);
            $ambientesEnMismoBloque = Ambiente::whereHas('piso', function ($query) use ($ambiente) {
                $query->where('bloque_id', $ambiente->piso->bloque_id);
            })->get();

            return response()->json(['ambientes' => $ambientesEnMismoBloque]);
    }

    public function ambientesMismoPiso($id){
        $ambiente = Ambiente::findOrFail($id);
        $ambientesEnMismoPiso = $ambiente->piso->ambientes;

        return response()->json(['ambientes' => $ambientesEnMismoPiso]);
    }

    public function buscarPorCapacidad(Request $request){ //buscador HU
        $minCapacidad = $request->input('minCapacidad', 0);
        $maxCapacidad = $request->input('maxCapacidad', 100);

        // Realiza la búsqueda en la base de datos
        $resultados = Ambiente::whereBetween('capacidad', [$minCapacidad, $maxCapacidad])->get();

        $ambientes = [];
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

            $ambientes[] = $detalleAula;
        }
        return response()->json([
            'respuesta' => $ambientes
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
    // buscar ambinnetes por cantidad
    public function busquedaMonoAmbiente($cantidad) {
        list($min, $max) = $this->establecerRango($cantidad);
        // Intentar encontrar un solo ambiente que cumpla con el rango
        $ambientes = Ambiente::where('capacidad', '>=', $min)
                            ->where('capacidad', '<=', $max)
                            ->get();

        return $ambientes;
    }

    public function busquedaMultiAmbientes($cantidad) {  
        list($min, $max) = $this->establecerRango($cantidad);

        // Obtener todos los ambientes y agruparlos por piso_id
        $ambientes = Ambiente::orderBy('piso_id')
                            ->orderBy('id')
                            ->get()
                            ->groupBy('piso_id');

        $result = [];
        foreach ($ambientes as $piso_id => $ambientesPiso) {
            $combinations = $this->combinaciones($ambientesPiso->all(), $min, $max);
            foreach ($combinations as $combination) {
                $result[] = $combination;
            }
        }

        return $result;
    }

    public function establecerRango($cantidad){
        $maxCapacidad = Ambiente::max('capacidad');
        $minCapacidad = Ambiente::min('capacidad');
        
        // Si la cantidad solicitada es mayor que la capacidad máxima disponible
        if ($cantidad > $maxCapacidad) {
            $min = $maxCapacidad;
            $max = $cantidad; // Ajustar el rango máximo a la cantidad solicitada
        } else {
            if ($cantidad <= $minCapacidad) {
                $min = $minCapacidad;
                $max = $cantidad + 20;
            }else 
            {
                $min = max(10, $cantidad - 20);
                $max = min(200, $cantidad + 20);
            }
        }
        
        return [$min, $max];
    }
    
    public function combinaciones($ambientes, $min, $max){
        $combinations = [];
        $count = count($ambientes);

        // Generar todas las combinaciones posibles de 2 o más ambientes
        for ($i = 0; $i < (1 << $count); $i++) {
            $combination = [];
            $sum = 0;
            for ($j = 0; $j < $count; $j++) {
                if ($i & (1 << $j)) {
                    $combination[] = $ambientes[$j];
                    $sum += $ambientes[$j]->capacidad;
                }
            }
            if ($sum >= $min && $sum <= $max && count($combination) > 1) {
                // Verificar que todos los ambientes en la combinación pertenezcan al mismo piso
                $samePiso = true;
                $piso_id = $combination[0]->piso_id;
                foreach ($combination as $ambiente) {
                    if ($ambiente->piso_id != $piso_id) {
                        $samePiso = false;
                        break;
                    }
                }
                if ($samePiso) {
                    $combinations[] = $combination;
                }
            }
        }
        return $combinations;
    }

    //buscar ambientes por fecha/periodo
    public function fechaPeriodo($fecha,$periodos){

        if (count($periodos) === 1) {
            $periodoInicial = $periodos[0];
            $periodoFinal = $periodos[0];
        } else {
            $periodoInicial = $periodos[0];
            $periodoFinal = $periodos[count($periodos) - 1];
        }
    
        $ambientes = Ambiente::all();
        $ambientesInhabilitados = Inhabilitado::where('fecha', $fecha)
            ->whereBetween('periodo_id', [$periodoInicial, $periodoFinal])
            ->pluck('ambiente_id');
    
        $reservas = Solicitud::whereDate('fechaReserva', $fecha)
            ->where('estado', 'aprobado')
            ->where('periodo_ini_id', '>=', $periodoInicial)
            ->where('periodo_fin_id', '<=', $periodoFinal)
            ->pluck('id');
    
        $ambientesReservados = DB::table('ambiente_solicitud')
            ->whereIn('solicitud_id', $reservas)
            ->pluck('ambiente_id')
            ->unique()
            ->values();
    
        $solicitudes = Solicitud::whereDate('fechaReserva', $fecha)
            ->where('estado', 'en espera')
            ->where('periodo_ini_id', '>=', $periodoInicial)
            ->where('periodo_fin_id', '<=', $periodoFinal)
            ->pluck('id');
    
        $ambientesSolicitados = DB::table('ambiente_solicitud')
            ->whereIn('solicitud_id', $solicitudes)
            ->pluck('ambiente_id')
            ->unique()
            ->values();
    
        $ambientesInhabilitadosArray = $ambientesInhabilitados->toArray();
        $ambientesReservadosArray = $ambientesReservados->toArray();
        $ambientesSolicitadosArray = $ambientesSolicitados->toArray();
    
        // Depuración: Verificar IDs inhabilitados, reservados y solicitados
        Log::info('Inhabilitados IDs: ', $ambientesInhabilitadosArray);
        Log::info('Reservados IDs: ', $ambientesReservadosArray);
        Log::info('Solicitados IDs: ', $ambientesSolicitadosArray);
    
        // Eliminar los ambientes inhabilitados y reservados de la lista general de ambientes
        $ambientesDisponibles = $ambientes->reject(function ($ambiente) use ($ambientesInhabilitadosArray, $ambientesReservadosArray, $ambientesSolicitadosArray) {
            return in_array($ambiente->id, $ambientesInhabilitadosArray) 
                || in_array($ambiente->id, $ambientesReservadosArray)
                || in_array($ambiente->id, $ambientesSolicitadosArray);
        });
    
        // Obtener solo los IDs de los ambientes disponibles
        $ambientesDisponibles = $ambientesDisponibles->pluck('id');
    
        // Depuración: Verificar ambientes disponibles
        Log::info('Available Ambientes IDs: ', $ambientesDisponibles->toArray());
    
        return $ambientesDisponibles;
    }

    //
    public function busquedaAmbientesporCantidadFechaPeriodo(Request $request){
        $cantidad = $request->input('cantidad');
        $fecha = $request->input('fecha');
        $periodos = $request->input('periodos');

        $busquedaFechaPeriodos = $this->fechaPeriodo($fecha, $periodos);
        $availableIds = $busquedaFechaPeriodos->toArray();
        Log::info('Available IDs: ', $availableIds);

        $result = [];
        $busquedaCantidadMono = $this->busquedaMonoAmbiente($cantidad);
        Log::info('Single Ambiente Result: ', $busquedaCantidadMono ? $busquedaCantidadMono->toArray() : []);

        foreach ($busquedaCantidadMono as $ambiente) {
            if (in_array($ambiente->id, $availableIds)) {
                $result[] = [$ambiente]; 
            }
        }
        $busquedaCantidadMulti = $this->busquedaMultiAmbientes($cantidad);
        Log::info('Multi Ambiente Combinations: ', $busquedaCantidadMulti);
        foreach ($busquedaCantidadMulti as $combination) {
            $allAvailable = true;
            foreach ($combination as $ambiente) {
                if (!in_array($ambiente->id, $availableIds)) {
                    $allAvailable = false;
                    break;
                }
            }
            if ($allAvailable) {
                $result[] = $combination;
            }
        }
        Log::info('Final Result: ', $result);

        return response()->json($result);
    }
}