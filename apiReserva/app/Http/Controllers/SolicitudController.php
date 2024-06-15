<?php

namespace App\Http\Controllers;

use App\Models\Ambiente;
use App\Models\Docente;
use App\Models\Solicitud;
use App\Services\ValidadorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\NotificadorService;
use App\Mail\SolicitudRealizada;
use App\Events\NotificacionUsuario;

class SolicitudController extends Controller
{
    protected $ambienteValido;
    protected $notificadorService;
    public function __construct(ValidadorService $ambienteValido, NotificadorService $notificadorService)
    {
        $this->ambienteValido = $ambienteValido;
        $this->notificadorService = $notificadorService;
    }

    // FINISH v2
    public function conseguirFechas()  // devuelve objetos donde esta compuesto por una fecha
    {                                   // y las reservas y solicitudes de la respectiva fecha
        $fechas = Solicitud::distinct()->pluck('fechaReserva');
        $listaFechas = [];
        foreach ($fechas as $fecha) {
            $solicitudesEspera = Solicitud::where('fechaReserva', $fecha)
                ->where('estado', 'en espera')
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

    // FINISH v2
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
        $estado = 'en espera';
        $idAmbiente = $request->input('ambiente');
        $periodos = $request->input('periodos');
        // verificar si el ambiente es valido
        $ambienteDisponible = $this->ambienteValido->ambienteValido($idAmbiente, $fechaReserva, $periodos, $idDocente, $materia, $grupo, $razon);

        // echo $ambienteDisponible;
        if ($ambienteDisponible->alerta != 'exito') {
            return response()->json([$ambienteDisponible]);
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

        $ultimoIdSolicitud = $solicitud->latest()->value('id');

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id' => $idAmbiente,
            'solicitud_id' => $ultimoIdSolicitud,
        ]);
        // notificar nuevo registro de solicitud al docente
        $this->notificadorService->solicitudRealizada($ultimoIdSolicitud);
        //avisar al administrador la creacion de una nueva solicitud
        event(new NotificacionUsuario(0, 'Nueva solicitud realizada.'));
        return response()->json([
            'mensaje' => 'Resgistro existoso',
        ]);
    }

    public function registroSolicitudP2(Request $request)
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
        $estado = 'en espera';
        $idAmbiente = $request->input('ambiente');
        $periodos = $request->input('periodos');

        if (count($periodos) === 1) {
            $periodoInicial = $periodos[0];
            $periodoFinal = $periodos[0];
        } else {
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

        $ultimoIdSolicitud = $solicitud->latest()->value('id');

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id' => $idAmbiente,
            'solicitud_id' => $ultimoIdSolicitud,
        ]);
        // notificar nuevo registro de solicitud al docente
        $this->notificadorService->solicitudRealizada($ultimoIdSolicitud);
        //avisar al administrador la creacion de una nueva solicitud
        event(new NotificacionUsuario(0, 'Nueva solicitud realizada.'));
        return response()->json([
            'mensaje' => 'Resgistro existoso',
        ]);
    }

    // FINISH T
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

        $nombreDocente = Docente::where('id', $solicitud->docente_id)
            ->value('nombre');
        return response()->json([
            'cantidad' => $solicitud->cantidad,
            'materia' => $solicitud->materia,
            'nombreDocente' => $nombreDocente,
            'razon' => $solicitud->razon,
            'periodo_ini_id' => $solicitud->periodo_ini_id,
            'periodo_fin_id' => $solicitud->periodo_fin_id,
            'fecha' => $solicitud->fechaReserva,
            'ambiente_nombre' => $ambiente->nombre,
        ]);
    }

    // FINISH T
    public function recuperarInformacion($idSolicitud)
    {
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
            'id_ambiente' => $idAmbiente,
        ]);
    }

    //FINISH v2
    public function verListas(Request $request)
    {
        $estado = $request->input('estado');
        $pagina = $request->input('pagina', 1);
        $fechaActual = now();
        //$query = Solicitud::orderBy('created_at', 'desc');
        if ($estado === 'aprobadas') {
            $query = Solicitud::orderBy('updated_at', 'asc');
            $query->where('estado', 'aprobado');
        } elseif ($estado === 'rechazadas') {
            $query = Solicitud::orderBy('updated_at', 'asc');
            $query->where('estado', 'rechazado');
        } elseif ($estado === 'en espera') {
            $query = Solicitud::orderBy('updated_at', 'desc');
            $query->where('estado', 'en espera');
        } elseif ($estado === 'canceladas') {
            $query = Solicitud::orderBy('updated_at', 'asc');
            $query->where('estado', 'cancelado');
        } elseif ($estado === 'inhabilitada') {
            $query = Solicitud::orderBy('updated_at', 'asc');
            $query->where('estado', 'inhabilitada');
        } elseif ($estado === 'prioridad') {
            $query = Solicitud::where('estado', 'en espera')
                ->orderByRaw("
                      CASE
                          WHEN fechaReserva < ? THEN 0
                          ELSE 1
                      END, ABS(DATEDIFF(fechaReserva, ?))
                  ", [$fechaActual, $fechaActual]);
        } else {
            $query = Solicitud::orderBy('updated_at', 'desc');
        }


        $solicitudes = $query->paginate(3, ['*'], 'pagina', $pagina);
        $datosSolicitudes = [];

        foreach ($solicitudes as $solicitud) {
            $idAmbiente = DB::table('ambiente_solicitud')->where('solicitud_id', $solicitud->id)->value('ambiente_id');
            $ambiente = Ambiente::find($idAmbiente);
            $docente = Docente::find($solicitud->docente_id);

            $datosSolicitud = [
                'id' => $solicitud->id,
                'nombreDocente' => $docente->nombre,
                'materia' => $solicitud->materia,
                'grupo' => $solicitud->grupo,
                'cantidad' => $solicitud->cantidad,
                'razon' => $solicitud->razon,
                'periodo_ini_id' => $solicitud->periodo_ini_id,
                'periodo_fin_id' => $solicitud->periodo_fin_id,
                'fechaReserva' => $solicitud->fechaReserva,
                'ambiente_nombre' => $ambiente->nombre,
                'ambienteCantidadMax' => $ambiente->capacidad,
                'fechaEnviada' => substr($solicitud->created_at, 0, 10),
                'estado' => $solicitud->estado,
                'updated_at' => substr($solicitud->updated_at, 0, 10),
            ];

            if ($estado === 'aprobadas') {
                $datosSolicitud['fechaAtendida'] = $solicitud->fechaAtendida;
            } elseif ($estado === 'rechazadas') {
                $datosSolicitud['fechaAtendida'] = $solicitud->fechaAtendida;
                $datosSolicitud['razonRechazo'] = $solicitud->razonRechazo;
            }

            $datosSolicitudes[] = $datosSolicitud;
        }

        return response()->json([
            'numeroItemsPagina' => $solicitudes->perPage(),
            'paginaActual' => $solicitudes->currentPage(),
            'numeroPaginasTotal' => $solicitudes->lastPage(),
            'contenido' => $datosSolicitudes,
        ]);
    }

    //FINISH v2
    public function aceptarSolicitud(Request $request)
    {
        $id = $request->input('idSolicitud');
        $fechaAtendido = $request->input('fechaAtendida');
        $solicitud = Solicitud::find($id);
        if (!$solicitud) {
            return response()->json(['mensaje' => 'Solicitud no encontrada'], 404);
        }
        $solicitud->estado = 'aprobado';
        $solicitud->fechaAtendida = $fechaAtendido;
        $solicitud->save();


        //disparar notificacion
        $this->notificadorService->notificarAceptacion($id);
        //disparar evento
        event(new NotificacionUsuario($solicitud->docente_id, 'Nueva notificacion.'));
        return response()->json(['mensaje' => 'Solicitud atendida correctamente']);
    }

    //FINISH v2
    public function rechazarSolicitud(Request $request)
    {
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


        //disparar notificacion
        $this->notificadorService->notificarRechazo($id);
        //disparar evento
        event(new NotificacionUsuario($solicitud->docente_id, 'Nueva notificacion.'));
        return response()->json(['mensaje' => 'Solicitud rechazada correctamente']);
    }

    public function periodosSolicitados($fecha,$idAmbiente){
        $coincidencias = DB::table('solicituds')
            ->join('ambiente_solicitud', 'solicituds.id', '=', 'ambiente_solicitud.solicitud_id')
            ->where('solicituds.fechaReserva', $fecha)
            ->where('ambiente_solicitud.ambiente_id', $idAmbiente)
            ->where('solicituds.estado', 'en espera')
            ->select('solicituds.id', 'solicituds.periodo_ini_id', 'solicituds.periodo_fin_id')
            ->get();
        $periodosReservados = [];
        // Procesar las solicitudes para determinar los periodos reservados
        foreach ($coincidencias as $coincidencia) {
            $periodoIni = $coincidencia->periodo_ini_id;
            $periodoFin = $coincidencia->periodo_fin_id;

            $periodos = range($periodoIni, $periodoFin);
            $periodosReservados[] = [
                'idSolicitud' => $coincidencia->id,
                'periodos' => $periodos
            ];
        }
        return response()->json([
            "periodosReservados" => $periodosReservados
        ]);
    }
}
