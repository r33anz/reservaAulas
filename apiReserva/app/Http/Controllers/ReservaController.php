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
class ReservaController extends Controller
{

    protected $inhabilitadorService;
    protected $notificadorService;

    public function __construct(InhabilitadorService $inhabilitadorService, NotificadorService $notificadorService){
        $this->inhabilitadorService = $inhabilitadorService;
        $this->notificadorService = $notificadorService;
    }

    public function reservasPorDocente(Request $request){
        $userId = $request->input('docente_id');
        $estado = $request->input('estado');
        $pagina = $request->input('pagina', 1);

        if ($estado === 'aprobadas') {
            $solicitudes = Solicitud::where('estado', 'aprobado')->where('user_id', $userId)->paginate(8, ['*'], 'pagina', $pagina);
        } elseif ($estado === 'rechazadas') {
            $solicitudes = Solicitud::where('estado', 'rechazado')->where('user_id', $userId)->paginate(8, ['*'], 'pagina', $pagina);
        } elseif ($estado === 'en espera') {
            $solicitudes = Solicitud::where('estado', 'en espera')->where('user_id', $userId)->paginate(8, ['*'], 'pagina', $pagina);
        } elseif ($estado === 'canceladas') {
            $solicitudes = Solicitud::where('estado', 'cancelado')->where('user_id', $userId)->paginate(8, ['*'], 'pagina', $pagina);
        } else {
            $solicitudes = Solicitud::where('user_id', $userId)->paginate(6, ['*'], 'pagina', $pagina);
        }

        $datosSolicitudes = [];

        foreach ($solicitudes as $solicitud) {
            $idAmbientes = DB::table('ambiente_solicitud')->where('solicitud_id', $solicitud->id)->pluck('ambiente_id');
            $ambientes = Ambiente::whereIn('id', $idAmbientes)->get();

            $docente = User::find($solicitud->user_id);

            $ini = Periodo::find($solicitud->periodo_ini_id);
            $fin = Periodo::find($solicitud->periodo_fin_id);

            $nombresAmbientes = $ambientes->pluck('nombre')->implode(', ');
            $capacidadesAmbientes = $ambientes->pluck('capacidad')->implode(', ');

            $datosSolicitud = [
                'id'=> $solicitud->id,
                'nombreDocente' => $docente->name,
                'materia' => $solicitud->materia,
                'grupo' => $solicitud->grupo,
                'cantidad' => $solicitud->cantidad,
                'razon' => $solicitud->razon,
                'periodo_ini_id' => $ini->horainicial,
                'periodo_fin_id' => $fin->horafinal,
                'fechaReserva' => $solicitud->fechaReserva,
                'ambiente_nombres' => $nombresAmbientes,
                'capacidadesAmbientes' => $capacidadesAmbientes,
                'fechaEnviada' => substr($solicitud->created_at, 0, 10),
                'estado' => $solicitud->estado,
                'updated_at' => substr($solicitud->updated_at, 0, 10),
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
        
        $this->notificadorService->cancelarReserva($id);
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

