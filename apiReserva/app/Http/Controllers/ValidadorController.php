<?php

namespace App\Http\Controllers;
use App\Services\AmbienteService;
use Illuminate\Http\Request;
use App\Models\Inhabilitado;
use Illuminate\Support\Carbon;
use App\Models\Solicitud;
use Illuminate\Support\Facades\DB;


class ValidadorController extends Controller
{
    protected $ambientesTodos;

    public function __construct(AmbienteService $ambientes)
    {
        $this->ambientesTodos = $ambientes;
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
            ->where('periodo_ini_id', '>=', $periodoInicial)
            ->where('periodo_fin_id', '<=', $periodoFinal)
            ->pluck('id');

        $solicitudesReservadas = DB::table('reservas')
            ->whereIn('idSolicitud', $solicitudes)
            ->pluck('idSolicitud')
            ->unique()
            ->values();

        $ambientesReservados = DB::table('ambiente_solicitud')
            ->whereIn('solicitud_id', $solicitudesReservadas)
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
}
