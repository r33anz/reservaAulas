<?php

namespace App\Http\Controllers;

use App\Models\Ambiente;
use App\Models\Docente;
use App\Models\Solicitud;
use App\Services\ValidadorService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class SolicitudController extends Controller
{
    protected $ambienteValido;

    public function __construct(ValidadorService $ambienteValido)
    {
        $this->ambienteValido = $ambienteValido;
    }

    // FINISH
    public function conseguirFechas()  // devuelve objetos donde esta compuesto por una fecha
    {// y las reservas y solicitudes de la respectiva fecha
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

    //FINISH
    public function registroSolicitud(Request $request)
    {
        /**
         * docente / materia / grupo / cantidad / razon / fecha / estado :false
         * preProcesamineto: periodoId
         * el idAmbiente y el idSolicitud ponerlo en tabla pivote.
         */
        $idDocente = $request->input('idDocente');
        $materia = $request->input('materia');
        $grupo = $request->input('grupo');
        $cantidad = $request->input('capacidad');
        $razon = $request->input('razon');
        $fechaReserva = $request->input('fechaReserva');
        $estado = false;
        $idAmbiente = $request->input('ambiente');
        $periodos = $request->input('periodos');
        // verificar si el ambiente es valido
        $ambienteDisponible = $this->ambienteValido->ambienteValido($idAmbiente, $fechaReserva, $periodos);

        echo $ambienteDisponible;
        if (!$ambienteDisponible) {
            return response()->json(['mensaje' => 'El ambiente no esta disponible en la fecha y periodos especificados'], 400);
        }

        if (count($periodos) === 1) {
            $periodoInicial = $periodos[0];
            $periodoFinal = $periodos[0]+1;
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
            'estado' => $estado,
        ]);

        // Obtener el ID de la solicitud recién creada
        $ultimoIdSolicitud = $solicitud->latest()->value('id');

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id' => $idAmbiente,
            'solicitud_id' => $ultimoIdSolicitud,
        ]);

        return response()->json([
            'mensaje' => 'Resgistro existoso',
        ]);
    }

    //FINISH
    public function informacionSolicitud(Request $request)
    {
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
            'cantidad' => $solicitud->cantidad,
            'razon' => $solicitud->razon,
            'periodo_ini_id' => $solicitud->periodo_ini_id,
            'periodo_fin_id' => $solicitud->periodo_fin_id,
            'fecha' => $solicitud->fechaReserva,
            'ambiente_nombre' => $ambiente->nombre,
            
        ]);
    }

    public function recuperarInformacion($idSolicitud){
        $solicitud = Solicitud::find($idSolicitud);

        $idAmbiente = DB::table('ambiente_solicitud')->where('solicitud_id', $idSolicitud)->value('ambiente_id');
        $ambiente = Ambiente::where('id', $idAmbiente)->first();

        $docente = Docente::find($solicitud->docente_id);
        return response()->json([
            'nombreDocente' => $docente->nombre,
            'materia' => $solicitud->materia,
            'grupo'=>$solicitud->grupo,
            'cantidad' => $solicitud->cantidad,
            'razon' => $solicitud->razon,
            'periodo_ini_id' => $solicitud->periodo_ini_id,
            'periodo_fin_id' => $solicitud->periodo_fin_id,
            'fecha' => $solicitud->fechaReserva,


            'ambiente_nombre' => $ambiente->nombre,
            'ambienteCantidadMax' => $ambiente->capacidad
        ]);
    }


    // FINISH
    public function solicitudesPorLlegada()
    {
        $solicitudes = Solicitud::where('estado', false)
            ->orderBy('created_at', 'asc')
            ->get();

        $datosSolicitudes = [];

        foreach ($solicitudes as $solicitud) {
            // Obtener el nombre del docente
            $docente = Docente::find($solicitud->docente_id);

            // Obtener el ID del ambiente asociado a la solicitud desde la tabla ambiente_solicitud
            $idAmbiente = DB::table('ambiente_solicitud')
                ->where('solicitud_id', $solicitud->id)
                ->value('ambiente_id');

            // Obtener el nombre del ambiente
            $nombreAmbiente = null;
            if ($idAmbiente) {
                $ambiente = Ambiente::find($idAmbiente);
                if ($ambiente) {
                    $nombreAmbiente = $ambiente->nombre;
                }
            }

            $datosSolicitud = [
                'id_docente' => $solicitud->docente_id,
                'nombre_docente' => $docente->nombre ?? null, // Suponiendo que el campo se llama "nombre" en la tabla de docentes
                'materia' => $solicitud->materia,
                'grupo' => $solicitud->grupo,
                'cantidad' => $solicitud->cantidad,
                'razon' => $solicitud->razon,
                'fechaReserva' => $solicitud->fechaReserva,
                'periodo_ini_id' => $solicitud->periodo_ini_id,
                'periodo_fin_id' => $solicitud->periodo_fin_id,
                'ambiente_nombre' => $nombreAmbiente,
            ];

            // Agregar los datos de la solicitud al array de datos de solicitudes
            $datosSolicitudes[] = $datosSolicitud;
        }

        return response()->json(['solicitudes_por_llegada' => $datosSolicitudes]);
    }

    public function solicitudesAtendidas()
    {
        $idsSolicitudesAceptadas = DB::table('reservas')->pluck('idSolicitud');

        // Obtener los datos de las solicitudes correspondientes a esos IDs
        $solicitudesAceptadas = Solicitud::whereIn('id', $idsSolicitudesAceptadas)->get();

        $datosSolicitudesAceptadas = [];

        foreach ($solicitudesAceptadas as $solicitud) {
            // Obtener el nombre del docente
            $docente = Docente::find($solicitud->docente_id);

            // Obtener el ID del ambiente asociado a la solicitud desde la tabla ambiente_solicitud
            $idAmbiente = DB::table('ambiente_solicitud')
                ->where('solicitud_id', $solicitud->id)
                ->value('ambiente_id');

            // Obtener el nombre del ambiente
            $nombreAmbiente = null;
            if ($idAmbiente) {
                $ambiente = Ambiente::find($idAmbiente);
                if ($ambiente) {
                    $nombreAmbiente = $ambiente->nombre;
                }
            }

            $datosSolicitud = [
                'id_docente' => $solicitud->docente_id,
                'materia' => $solicitud->materia,
                'grupo' => $solicitud->grupo,
                'cantidad' => $solicitud->cantidad,
                'razon' => $solicitud->razon,
                'fechaReserva' => $solicitud->fechaReserva,
                'periodo_ini_id' => $solicitud->periodo_ini_id,
                'periodo_fin_id' => $solicitud->periodo_fin_id,
                'ambiente_nombre' => $nombreAmbiente,
            ];

            // Agregar los datos de la solicitud al array de datos de solicitudes aceptadas,
            // agrupados por el nombre del profesor
            $profesorNombre = $docente->nombre ?? 'Desconocido'; // Si no se encuentra el nombre del profesor, se asigna 'Desconocido'
            if (!isset($datosSolicitudesAceptadas[$profesorNombre])) {
                $datosSolicitudesAceptadas[$profesorNombre] = [];
            }
            $datosSolicitudesAceptadas[$profesorNombre][] = $datosSolicitud;
        }

        return response()->json(['solicitudes_aceptadas_por_profesor' => $datosSolicitudesAceptadas]);
    }

    //FINISH
    public function aceptarSolicitud(Request $request){
        $id = $request->input('id');
        $solicitud = Solicitud::find($id);
        if (!$solicitud) {
            return response()->json(['mensaje' => 'Solicitud no encontrada'], 404);
        }
        $solicitud->estado = true;
        $solicitud->save();

        // Inserta datos en tablas externas
        DB::table('reservas')->insert([
            "idSolicitud" => $id,
        ]);

        // Retorna una respuesta de éxito
        return response()->json(['mensaje' => 'Solicitud atendida correctamente']);
    }

    //TO DO
    public function rechazarSolicitud(Request $request){
        $id = $request->input('id');
        $razon = $request->input('razonRechazo');
        $solicitud = Solicitud::find($id);
        if (!$solicitud) {
            return response()->json(['mensaje' => 'Solicitud no encontrada'], 404);
        }
        $solicitud->estado = true;
        $solicitud->save();

        // Inserta datos en tablas externas
        DB::table('rechazados')->insert([
            "idSolicitud" => $id,
            "razonRechazo" =>$razon
        ]);

        // Retorna una respuesta de éxito
        return response()->json(['mensaje' => 'Solicitud atendida correctamente']);
    }
}
