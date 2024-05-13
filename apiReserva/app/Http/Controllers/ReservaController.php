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
    public function reservasPorDocente($id)
    {
        // Obtener los IDs de las solicitudes aprobadas del docente
        $idsSolicitudesAprobadas = Solicitud::where('docente_id', $id)
            ->where('estado', 'aprobado')
            ->pluck('id');

        // Obtener los datos de las solicitudes correspondientes a esos IDs
        $solicitudesAceptadas = Solicitud::whereIn('id', $idsSolicitudesAprobadas)->get();

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
                'id' => $solicitud->id,
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

        return response()->json(['reservas' => $datosSolicitudesAceptadas]);
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

