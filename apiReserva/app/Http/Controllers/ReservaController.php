<?php

namespace App\Http\Controllers;

use App\Models\Ambiente;
use App\Models\Docente;
use App\Models\Reserva;
use App\Models\Solicitud;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservaController extends Controller
{
    public function reservasPorDocente(Request $request)
{
    // Obtener el ID del docente del request
    $docenteId = $request->input('docente_id');
    $estado = $request->input('estado');
    $pagina = $request->input('pagina', 1);

    // Filtrar las solicitudes por estado y paginar los resultados
    if ($estado === 'aprobadas') {
        $solicitudes = Solicitud::where('estado', 'aprobado')->where('docente_id', $docenteId)->paginate(3, ['*'], 'pagina', $pagina);
    } elseif ($estado === 'en espera') {
        $solicitudes = Solicitud::where('estado', 'en espera')->where('docente_id', $docenteId)->paginate(3, ['*'], 'pagina', $pagina);
    } elseif ($estado === 'canceladas') {
        $solicitudes = Solicitud::where('estado', 'cancelado')->where('docente_id', $docenteId)->paginate(3, ['*'], 'pagina', $pagina);
    } else {
        // Excluir las solicitudes con estado rechazado en la consulta general
        $solicitudes = Solicitud::where('docente_id', $docenteId)
            ->whereNotIn('estado', ['rechazado'])
            ->paginate(3, ['*'], 'pagina', $pagina);
    }

    // Transformar los datos de las solicitudes
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
        ];

        if ($estado === 'aprobadas') {
            $datosSolicitud['fechaAtendida'] = $solicitud->fechaAtendida;
        }

        $datosSolicitudes[] = $datosSolicitud;
    }

    // Retornar los resultados como JSON
    return response()->json([
        'numeroItemsPagina' => $solicitudes->perPage(),
        'paginaActual' => $solicitudes->currentPage(),
        'numeroPaginasTotal' => $solicitudes->lastPage(),
        'contenido' => $datosSolicitudes,
    ]);
}




    public function cancelarReserva($id)
    {
        // Buscar la solicitud asociada al ID de la reserva
        $solicitud = Solicitud::find($id);

        // Verificar si se encontró la solicitud
        if (!$solicitud) {
            return response()->json(['message' => 'No se encontró la solicitud asociada a la reserva'], 404);
        }

        // Cambiar el estado de la solicitud a "cancelado"
        $solicitud->estado = 'cancelado';
        $solicitud->save();

        return response()->json(['message' => 'Reserva cancelada correctamente'], 200);
    }

}

