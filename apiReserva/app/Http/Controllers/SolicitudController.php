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

    // FINISH v2
    public function conseguirFechas()  // devuelve objetos donde esta compuesto por una fecha
    {                                   // y las reservas y solicitudes de la respectiva fecha
        $fechas = Solicitud::distinct()->pluck('fechaReserva');
        $listaFechas = [];
        foreach ($fechas as $fecha) {
            $solicitudesEspera = Solicitud::where('fechaReserva', $fecha)
                ->where('estado', 'espera')
                ->pluck('id');

            $solicitudesReserva = Solicitud::where('fechaReserva', $fecha)
                ->where('estado', 'aprobado')
                ->pluck('id');

            $listaFechas[] = [
                'fecha' => $fecha,
                'solicitudes' => $solicitudesEspera,
                'reservas' => $solicitudesReserva,
            ];
        }
        return response()->json(['listaFechas' => $listaFechas]);
    }

    //FINISH v2
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
        $estado = "espera";
        $idAmbiente = $request->input('ambiente');
        $periodos = $request->input('periodos');
        // verificar si el ambiente es valido
        $ambienteDisponible = $this->ambienteValido->ambienteValido($idAmbiente, $fechaReserva, $periodos);

        echo $ambienteDisponible;
        if (!$ambienteDisponible) {
            return response()->json(['mensaje' => 'El ambiente no esta disponible en la fecha y/o periodos especificados'], 400);
        }

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
    
    //FINISH T
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

    //FINISH T
    public function recuperarInformacion($idSolicitud){
        $solicitud = Solicitud::find($idSolicitud);

        $idAmbiente = DB::table('ambiente_solicitud')->where('solicitud_id', $idSolicitud)->value('ambiente_id');
        $ambiente = Ambiente::where('id', $idAmbiente)->first();

        $docente = Docente::find($solicitud->docente_id);

        return response()->json([
            'nombreDocente' => $docente->nombre,
            'materia' => $solicitud->materia,
            'grupo' => $solicitud->grupo,
            'cantidad' => $solicitud->cantidad,
            'razon' => $solicitud->razon,
            'periodo_ini_id' => $solicitud->periodo_ini_id,
            'periodo_fin_id' => $solicitud->periodo_fin_id,
            'fecha' => $solicitud->fechaReserva,

            'ambiente_nombre' => $ambiente->nombre,
            'ambienteCantidadMax' => $ambiente->capacidad,
        ]);
    }
    

    //TO DO
    public function verListas(Request $request){
        $estado = $request->input('estado');

    if ($estado === "aprobadas") {
        $solicitudes = Solicitud::where('estado', 'aprobado')->paginate(3);
    } elseif ($estado === "rechazadas") {
        $solicitudes = Solicitud::where('estado', 'rechazado')->paginate(3);
    } elseif ($estado === "espera") {
        $solicitudes = Solicitud::where('estado', 'esperando')->paginate(3);
    } else {
        return response()->json(['error' => 'Estado no válido'], 400);
    }

    $datosSolicitudes = [];

    foreach ($solicitudes as $solicitud) {
        $idAmbiente = DB::table('ambiente_solicitud')->where('solicitud_id', $solicitud->id)->value('ambiente_id');
        $ambiente = Ambiente::find($idAmbiente);
        $docente = Docente::find($solicitud->docente_id);

        $datosSolicitud = [
            'nombreDocente' => $docente->nombre,
            'materia' => $solicitud->materia,
            'grupo' => $solicitud->grupo,
            'cantidad' => $solicitud->cantidad,
            'razon' => $solicitud->razon,
            'periodo_ini_id' => $solicitud->periodo_ini_id,
            'periodo_fin_id' => $solicitud->periodo_fin_id,
            'fecha' => $solicitud->fechaReserva,
            'ambiente_nombre' => $ambiente->nombre,
            'ambienteCantidadMax' => $ambiente->capacidad
        ];

        if ($estado === "aprobadas") {
            $datosSolicitud['fechaAtendida'] = $solicitud->fechaAtendida;
        } elseif ($estado === "rechazadas") {
            $datosSolicitud['fechaAtendida'] = $solicitud->fechaAtendida;
            $datosSolicitud['razonRechazo'] = $solicitud->razonRechazo;
        }

        $datosSolicitudes[] = $datosSolicitud;
    }

    return response()->json(['solicitudes' => $datosSolicitudes]);
    }
    /*
    // FINISH  paginacion
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
                'fechaEnviada' => substr($solicitud->created_at, 0, 10),
            ];

            // Agregar los datos de la solicitud al array de datos de solicitudes
            $datosSolicitudes[] = $datosSolicitud;
        }

        return response()->json(['solicitudes_por_llegada' => $datosSolicitudes]);
    }
    // FINISH  paginacion
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
                'fechaEnviada' => substr($solicitud->created_at, 0, 10),
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
    }*/

    //FINISH v2
    public function aceptarSolicitud(Request $request){
        $id = $request->input('idSolicitud');
        $fechaAtendido = $request->input('fechaAtendida');
        $solicitud = Solicitud::find($id);
        if (!$solicitud) {
            return response()->json(['mensaje' => 'Solicitud no encontrada'], 404);
        }
        $solicitud->estado = 'aprobado';
        $solicitud->fechaAtendida = $fechaAtendido;
        $solicitud->save();
        return response()->json(['mensaje' => 'Solicitud atendida correctamente']);
    }

    //FINISH v2
    public function rechazarSolicitud(Request $request){
        $id = $request->input('id');
        $fechaAtendido = $request->input('fechaAtendida');
        $razon = $request->input('razonRechazo');
        $solicitud = Solicitud::find($id);
        if (!$solicitud) {
            return response()->json(['mensaje' => 'Solicitud no encontrada'], 404);
        }
        $solicitud->estado = 'rechazado';
        $solicitud->razonRechazo = $razon;
        $solicitud->fechaAtendida = $fechaAtendido;
        $solicitud->save();
        return response()->json(['mensaje' => 'Solicitud rechazada correctamente']);
    }
}
