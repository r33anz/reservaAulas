<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Solicitud;
use App\Services\ValidadorService;
use App\Models\Ambiente;
class SolicitudController extends Controller
{   
    protected $ambienteValido;

    public function __construct(ValidadorService $ambienteValido)
    {
        $this->ambienteValido = $ambienteValido;
    }

    public function conseguirFechas(){  // devuelve objetos donde esta compuesto por una fecha y las reservas y solicitudes de la respectiva fecha
        $fechasSolicitudes = Solicitud::distinct()->pluck('fechaReserva');
        $idsReservas = DB::table('reservas')->pluck('idSolicitud');
        $fechas = [];
        $fechasSolicitudes->each(function ($fecha) use (&$fechas) {
            $fechas[] = Carbon::parse($fecha)->toDateString();
        });
        $idsReservas->each(function ($idReserva) use (&$fechas) {
            $solicitud = Solicitud::find($idReserva);
            if ($solicitud) {
                $fechaReserva = Carbon::parse($solicitud->fechaReserva)->toDateString();
                if (!in_array($fechaReserva, $fechas)) {
                    $fechas[] = $fechaReserva;
                }
            }
        });
        sort($fechas);
        $listaFechas = [];

        foreach ($fechas as $fecha) {
            $solicitudes = Solicitud::where('fechaReserva', $fecha)->pluck('id');

            $idsReservasFecha = $idsReservas->filter(function ($idReserva) use ($fecha) {
                $solicitud = Solicitud::find($idReserva);
                return $solicitud && Carbon::parse($solicitud->fechaReserva)->toDateString() === $fecha;
            });
            $listaFechas[] = [
                'fecha' => $fecha,
                'solicitudes' => $solicitudes,
                'reservas' => $idsReservasFecha,
            ];
        }

        return response()->json(['listaFechas' => $listaFechas]);

    }

    public function registroSolicitud(Request $request){
        /**
        * docente / materia / grupo / cantidad / razon / fecha / estado :false
        * preProcesamineto: periodoId
        * el idAmbiente y el idSolicitud ponerlo en tabla pivote
        */
        
        $idDocente = $request->input('idDocente');
        $materia = $request->input('materia');
        $grupo = $request->input('grupo');
        $cantidad = $request->input('cantidad');
        $razon = $request->input('razon');
        $fechaReserva = $request->input('fechaReserva');
        $estado = false;
        $idAmbiente = $request->input('idAmbinete');
        $periodos = $request->input('periodos');
        //verificar si el ambiente es valido
        $ambienteDisponible = $this->ambienteValido->ambienteValido($idAmbiente, $fechaReserva, $periodos);

        if (!$ambienteDisponible) {
            return response()->json(['mensaje' => 'El ambiente no está disponible en la fecha y periodos especificados'], 400);
        }
        //
        
        if (count($periodos) === 1) {
            $periodoInicial = $periodos[0];
            $periodoFinal = $periodos[0];
        } else { // Si hay más de un periodo, determina el periodo inicial y final
            $periodoInicial = $periodos[0];
            $periodoFinal = $periodos[count($periodos) - 1];
        }

        $solicitud = Solicitud::create([
            'docente_id' => $idDocente,
            'materia' => $materia,
            'grupo' => $grupo,
            'cantidad' => $cantidad,
            'razon' => $razon,
            'fechaReserva' => $fechaReserva,
            'periodo_ini_id' => $periodoInicial,
            'periodo_fin_id' => $periodoFinal,
            'estado' => $estado
        ]);
        
        // Obtener el ID de la solicitud recién creada
        $ultimoIdSolicitud = $solicitud->latest()->value('id');
        
        DB::table('ambiente_solicitud')->insert([
            'ambiente_id'=>$ultimoIdSolicitud,
            'solicitud_id'=>$idAmbiente
        ]);

        return response()->json([
            "mensaje"=>"Resgistro existoso"
        ]);

    }

    public function informacionSolicitud(Request $request){
        $id = $request->input('id');
        $solicitud = Solicitud::find($id);
        
        if (!$solicitud) {
            return response()->json(['mensaje' => 'Solicitud no encontrada'], 404);
        }
        $idAmbiente = DB::table('ambiente_solicitud')->where('solicitud_id', $id)->value('ambiente_id');
        $ambiente = Ambiente::where('id', $idAmbiente)->first();

        if (!$ambiente) {
            return response()->json(['mensaje' => 'No se encontró información del ambiente asociado a la solicitud'], 404);
        }

        return response()->json([
            "cantidad" => $solicitud->cantidad,
            "razon" => $solicitud->razon,
            "periodo_ini_id" => $solicitud->periodo_ini_id,
            "periodo_fin_id" => $solicitud->periodo_fin_id,
            "fecha" => $solicitud->fechaReserva,
            "ambiente_nombre" => $ambiente->nombre, 
            "ambiente_bloque" => $ambiente->bloque, 
            "ambiente_piso" => $ambiente->piso,     
        ]);
    }

    public function solicitudesPorLlegada(){
        $solicitudes = Solicitud::where('estado', false)
        ->orderBy('created_at', 'asc')
        ->get();
        
        return response()->json(['solicitudes' => $solicitudes]);
    }
}
