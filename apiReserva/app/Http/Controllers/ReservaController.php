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
        // Obtener los IDs de las solicitudes del docente
        $idsSolicitudes = Solicitud::where('docente_id', $id)->pluck('id');

        // Obtener los IDs de las reservas asociadas a las solicitudes del docente
        $idsReservas = DB::table('reservas')->whereIn('idSolicitud', $idsSolicitudes)->pluck('idSolicitud');

        // Obtener los datos de las solicitudes correspondientes a esos IDs
        $solicitudesAceptadas = Solicitud::whereIn('id', $idsReservas)->get();

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
        // Buscar la reserva asociada al ID de la solicitud
        $reserva = Reserva::where('idSolicitud', $id)->first();

        // Verificar si se encontró la reserva
        if (!$reserva) {
            return response()->json(['message' => 'No se encontró la reserva asociada a la solicitud'], 404);
        }

        // Eliminar la reserva encontrada
        $reserva->delete();

        return response()->json(['message' => 'Reserva cancelada correctamente'], 200);
    }

}

