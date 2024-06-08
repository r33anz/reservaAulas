<?php

namespace App\Http\Controllers;
use App\Services\AmbienteService;
use Illuminate\Http\Request;
use App\Models\Inhabilitado;
use Illuminate\Support\Carbon;
use App\Models\Solicitud;
use App\Services\ValidadorService;
use Illuminate\Support\Facades\DB;


class ValidadorController extends Controller
{
    protected $ambientesTodos;
    protected $ambienteValido;

    public function __construct(AmbienteService $ambientes,ValidadorService $ambienteValido)
    {
        $this->ambientesTodos = $ambientes;
        $this->ambienteValido = $ambienteValido;
    }

    
    public function consultaFechaPeriodo(Request $request){
        $fecha = $request->input('fecha');
        $periodos = $request->input('periodos');

        // Si hay solo un periodo, asigna ese periodo tanto como inicial como final
        if (count($periodos) === 1) {
            $periodoInicial = $periodos[0];
            $periodoFinal = $periodos[0];
        } else { // Si hay más de un periodo, determina el periodo inicial y final
            $periodoInicial = $periodos[0];
            $periodoFinal = $periodos[count($periodos) - 1];
        }

        $ambientes = $this->ambientesTodos->todosAmbientes();

        $ambientesInhabilitados = Inhabilitado::where('fecha', $fecha)
            ->whereBetween('periodo_id', [$periodoInicial, $periodoFinal])
            ->pluck('ambiente_id');

        $solicitudes = Solicitud::whereDate('fechaReserva', $fecha)
            ->where('estado', 'aprobado') 
            ->where('periodo_ini_id', '>=', $periodoInicial)
            ->where('periodo_fin_id', '<=', $periodoFinal)
            ->pluck('id');

        $ambientesReservados = DB::table('ambiente_solicitud')
            ->whereIn('solicitud_id', $solicitudes)
            ->pluck('ambiente_id')
            ->unique()
            ->values();

        $ambientesInhabilitadosArray = $ambientesInhabilitados->toArray();
        $ambientesReservadosArray = $ambientesReservados->toArray();

        // Eliminar los ambientes inhabilitados y reservados de la lista general de ambientes
        $ambientesDisponibles = $ambientes->reject(function ($ambiente) use ($ambientesInhabilitadosArray, $ambientesReservadosArray) {
            return in_array($ambiente['id'], $ambientesInhabilitadosArray) || in_array($ambiente['id'], $ambientesReservadosArray);
        });

        // Obtener solo los IDs y nombres de los ambientes disponibles
        $ambientesDisponibles = $ambientesDisponibles->map(function ($ambiente) {
            return [
                'id' => $ambiente['id'],
                'nombre' => $ambiente['nombre']
            ];
        });

        return response()->json(['ambientes_disponibles' => $ambientesDisponibles]);
    }

    public function consultarFechaPeriodoAmbiente(Request $request){
        $fecha = $request->input('fechaReserva');
        $periodos = $request->input('periodos');
        $ambiente = $request->input('ambiente');
        $docente = $request->input('idDocente');
        $ambienteDisponible = $this->ambienteValido->ambienteValido($ambiente, $fecha, $periodos,$docente);
        return response()->json([
            $ambienteDisponible
        ]);
    }

    public function solicitudAtendida($idSolicitud){
        $solicitud = Solicitud::find($idSolicitud);
        if($solicitud->estado === "en espera"){
            return response()->json([ "atendida" => false]);
        }else{
            return response()->json([ "atendida" => true]);
        }
    }
}
