<?php

namespace App\Http\Controllers;

use App\Models\Ambiente;
use App\Models\Docente;
use App\Models\Solicitud;
use App\Services\ValidadorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\NotificadorService;
use App\Events\SolicitudCreada;
use App\Models\User;
use App\Models\Periodo;
use App\Notifications\SolicitudR;
class SolicitudController extends Controller
{
    protected $ambienteValido;
    protected $notificadorService;

    public function __construct(ValidadorService $ambienteValido, NotificadorService $notificadorService){
        $this->ambienteValido = $ambienteValido;
        $this->notificadorService = $notificadorService;
    }

    // devuelve objetos donde esta compuesto por una fecha
    // y las reservas y solicitudes de la respectiva fecha
    public function conseguirFechas(){     
        $listas = Solicitud::conseguirFechas();                              
        return response()->json(['listaFechas' => $listas]);
    }
    
    public function realizarSolicitud(Request $request){
        $data = $request->all();
        $result = Solicitud::realizarSolicitud($data, $this->ambienteValido);

        if (isset($result->alerta) && $result->alerta != 'exito') {
            return response()->json([$result]);
        }

        return response()->json($result);
    }
   
    public function informacionSolicitud(Request $request){
        $id = $request->input('id');
        $informacion = Solicitud::getInformacionSolicitud($id);
        if (!$informacion) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }
        return response()->json($informacion, 200);
    }

    public function recuperarInformacion($idSolicitud){
        $informacion = Solicitud::recuperarInformacion($idSolicitud);
        if (!$informacion) {
            return response()->json(['message' => 'Información no encontrada'], 404);
        }
        return response()->json($informacion, 200);
    }
    
    public function verListas(Request $request){

        $estado = $request->input('estado');
        $pagina = $request->input('pagina', 1);
        $listas = Solicitud::verListas($estado, $pagina);
        return response()->json($listas, 200);
        
    }

    public function aceptarSolicitud(Request $request){
        $id = $request->input('idSolicitud');
        $fechaAtendido = $request->input('fechaAtendida');
        $solicitud = Solicitud::find($id);
        if (!$solicitud) {
            return response()->json(['mensaje' => 'Solicitud no encontrada'], 404);
        }
        $solicitud->aceptar($fechaAtendido, $this->notificadorService);
        return response()->json(['mensaje' => 'Solicitud atendida correctamente']);
    }

    public function rechazarSolicitud(Request $request){
        $id = $request->input('id');
        $fechaAtendido = $request->input('fechaAtendida');
        $razon = $request->input('razonRechazo');
        $solicitud = Solicitud::find($id);
        if (!$solicitud) {
            return response()->json(['mensaje' => 'Solicitud no encontrada'], 404);
        }
        $solicitud->rechazar($fechaAtendido, $razon, $this->notificadorService);
        return response()->json(['mensaje' => 'Solicitud rechazada correctamente']);
    }

    public function periodosSolicitados($fecha, $idAmbiente)
    {
        $periodosReservados = Solicitud::obtenerPeriodosSolicitados($fecha, $idAmbiente);

        return response()->json([
            "periodosReservados" => $periodosReservados
        ]);
    }

    public function fechasReserva($fecha){
        $solicitudes = Solicitud::obtenerSolicitudesPorFecha($fecha, 'aprobado');

        if (!$solicitudes) {
            return response()->json(['mensaje' => 'No se encontraron solicitudes aprobadas para la fecha proporcionada'], 404);
        }

        return response()->json($solicitudes);
    }

    public function fechasSolicitud($fecha){
        $solicitudes = Solicitud::obtenerSolicitudesPorFecha($fecha, 'en espera');

        if (!$solicitudes) {
            return response()->json(['mensaje' => 'No se encontraron solicitudes en espera para la fecha proporcionada'], 404);
        }

        return response()->json($solicitudes);
    }
    
}
