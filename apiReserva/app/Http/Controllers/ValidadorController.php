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

        if (count($periodos) === 1) {
            $periodoInicial = $periodos[0];
            $periodoFinal = $periodos[0];
        } else { 
            $periodoInicial = $periodos[0];
            $periodoFinal = $periodos[count($periodos) - 1];
        }

        $ambientes = $this->ambientesTodos->todosAmbientes();
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
        $ambientesSolicitadossArray = $ambientesSolicitados->toArray();


        // Eliminar los ambientes inhabilitados y reservados de la lista general de ambientes
        $ambientesDisponibles = $ambientes->reject(function ($ambiente) use ($ambientesInhabilitadosArray,
                                $ambientesReservadosArray,$ambientesSolicitadossArray) {

            return in_array($ambiente['id'], $ambientesInhabilitadosArray) 
            || in_array($ambiente['id'], $ambientesReservadosArray)
            || in_array($ambiente['id'], $ambientesSolicitadossArray);
        });

        // Obtener solo los IDs y nombres de los ambientes disponibles
        $ambientesDisponibles = $ambientesDisponibles->map(function ($ambiente) {
            return [
                'id' => $ambiente['id'],
            ];
        });
        return response()->json(['ambientes_disponibles' => $ambientesDisponibles]);
    }

    public function consultarFechaPeriodoAmbiente(Request $request){
        $fecha = $request->input('fechaReserva');
        //$periodos = $request->input('periodos');
        $ambiente = $request->input('ambiente');
        $id = $request->input("idSolicitud");
        $solicitud = Solicitud::find($id);
        $periodos = [$solicitud->periodo_ini_id,$solicitud->periodo_fin_id]; 
        $ambienteDisponible = $this->ambienteValido->antenderAmbiente($ambiente, $fecha, $periodos,$solicitud->user_id);
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
