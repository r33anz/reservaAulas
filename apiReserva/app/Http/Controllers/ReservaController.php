<?php

namespace App\Http\Controllers;

use App\Models\Ambiente;
use App\Models\User;
use App\Models\Reserva;
use App\Models\Solicitud;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Periodo;
use App\Models\Inhabilitado;
use App\Services\InhabilitadorService;
use App\Services\NotificadorService;
use App\Events\NotificacionUsuario;
class ReservaController extends Controller
{

    protected $inhabilitadorService;
    protected $notificadorService;

    public function __construct(InhabilitadorService $inhabilitadorService, NotificadorService $notificadorService)
    {
        $this->inhabilitadorService = $inhabilitadorService;
        $this->notificadorService = $notificadorService;
    }

    public function reservasPorDocente(Request $request){
        $userId = $request->input('docente_id');
        $estado = $request->input('estado');
        $pagina = $request->input('pagina', 1);

        if ($estado === 'aprobadas') {
            $solicitudes = Solicitud::where('estado', 'aprobado')->where('user_id', $userId)->paginate(5, ['*'], 'pagina', $pagina);
        } elseif ($estado === 'rechazadas') {
            $solicitudes = Solicitud::where('estado', 'rechazado')->where('user_id', $userId)->paginate(5, ['*'], 'pagina', $pagina);
        } elseif ($estado === 'en espera') {
            $solicitudes = Solicitud::where('estado', 'en espera')->where('user_id', $userId)->paginate(5, ['*'], 'pagina', $pagina);
        } elseif ($estado === 'canceladas') {
            $solicitudes = Solicitud::where('estado', 'cancelado')->where('user_id', $userId)->paginate(5, ['*'], 'pagina', $pagina);
        } else {
            $solicitudes = Solicitud::where('user_id', $userId)->paginate(5, ['*'], 'pagina', $pagina);
        }

        $datosSolicitudes = [];

        foreach ($solicitudes as $solicitud) {
            $idAmbiente = DB::table('ambiente_solicitud')->where('solicitud_id', $solicitud->id)->value('ambiente_id');
            $ambiente = Ambiente::find($idAmbiente);
            $docente = User::find($solicitud->user_id);

            $datosSolicitud = [
                'id'=> $solicitud->id,
                'nombreDocente' => $docente->name,
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
            ];

            if ($estado === 'aprobadas' || $estado === 'rechazadas') {
                $datosSolicitud['fechaAtendida'] = $solicitud->fechaAtendida;
            }

            if ($estado === 'rechazadas') {
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

    public function cancelarReserva($id){
        $solicitud = Solicitud::find($id);
        if (!$solicitud) {
            return response()->json(['message' => 'No se encontró la solicitud asociada a la reserva'], 404);
        }
        $solicitud->estado = 'cancelado';
        $solicitud->save();
        //notificar admin cancelacion 
        //$this->notificadorService->cancelarReserva($id);
        return response()->json(['message' => 'Reserva cancelada correctamente'], 200);
    }

    public function periodosReservados($fecha,$idAmbiente){
        $coincidencias = DB::table('solicituds')
            ->join('ambiente_solicitud', 'solicituds.id', '=', 'ambiente_solicitud.solicitud_id')
            ->where('solicituds.fechaReserva', $fecha)
            ->where('ambiente_solicitud.ambiente_id', $idAmbiente)
            ->where('solicituds.estado', 'aprobado')
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

    //agregar tabla Inhabilitado  rango: [periodoIni, periodoFin]
    //cambiar estado de reserva-> inhabilitada 
    //notificar [idSolicitud, idambiente, fecha, docente]

    public function inhabilitarReserva(Request $request){ //[] lista de idSolicitudes

        $idSolicitudes = $request->input('idSolicitudes');

        foreach ($idSolicitudes as $idSolicitud) {
            // Inhabilitar la solicitud
            $this->inhabilitadorService->inhabilitar($idSolicitud);

            // Notificar sobre la inhabilitación
            $this->notificadorService->notificarInhabilitacion($idSolicitud);
        }

        return response()->json(['message' => 'Solicitudes inhabilitadas y notificaciones enviadas'], 200);
    }

}

