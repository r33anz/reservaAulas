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

    public function __construct(AmbienteService $ambientes,ValidadorService $ambienteValido){
        $this->ambientesTodos = $ambientes;
        $this->ambienteValido = $ambienteValido;
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
