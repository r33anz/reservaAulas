<?php

namespace App\Services;
use App\Models\Inhabilitado;
use Illuminate\Support\Facades\DB;
use App\Models\Solicitud;
class ValidadorService{

    public function ambienteValido($idAmbiente, $fecha, $idPeriodos){ //verifica si un ambiente/fecha/periodo
                                      // sigue siendo valido, ya que alguine podira haberle ganado

        $ambienteDisponible = true;

        // Verificar para cada periodo si el ambiente está inhabilitado
        foreach ($idPeriodos as $periodo) {
            $ambientesInhabilitados = Inhabilitado::where('fecha', $fecha)
                ->where('periodo_id', $periodo)
                ->where('ambiente_id', $idAmbiente)
                ->exists();

            // Si el ambiente está inhabilitado en algún periodo, marcar como no disponible
            if ($ambientesInhabilitados) {
                $ambienteDisponible = false;
                break; // No es necesario seguir verificando los siguientes períodos
            }
        }

        if($ambienteDisponible){
            $idSolicitudes = DB::table('ambiente_solicitud')
                                ->where('ambiente_id', $idAmbiente)
                                ->pluck('solicitud_id');
            if ($idSolicitudes->isEmpty()) {
                // No hay solicitudes reservadas para este ambiente
                $ambienteDisponible = true;
            } else {
                $solicitudesCoincidencia = Solicitud::where('estado', true)
                    ->whereDate('fechaReserva', $fecha)
                    ->where(function ($query) use ($idPeriodos) {
                        foreach ($idPeriodos as $periodo) {
                            $query->orWhere(function ($query) use ($periodo) {
                                $query->where('periodo_ini_id', '<=', $periodo)
                                    ->where('periodo_fin_id', '>=', $periodo);
                            });
                        }
                    })
                    ->whereIn('id', $idSolicitudes)
                    ->pluck('id');
            
                if ($solicitudesCoincidencia->isEmpty()) {
                    // No hay coincidencias en las solicitudes, el ambiente está disponible
                    $ambienteDisponible = true;
                } else {
                    // Hay solicitudes disponibles, verifiquemos si alguna coincide con las reservas
                    $reservas = DB::table('reservas')
                        ->whereIn('idSolicitud', $solicitudesCoincidencia)
                        ->count();
            
                    // Si hay coincidencias en las reservas, el ambiente no está disponible
                    if ($reservas > 0) {
                        $ambienteDisponible = false;
                    }
                }
            }
        }
                                            
        return $ambienteDisponible;
    }
}
