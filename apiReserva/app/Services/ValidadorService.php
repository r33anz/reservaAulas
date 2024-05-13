<?php

namespace App\Services;
use App\Models\Inhabilitado;
use Illuminate\Support\Facades\DB;
use App\Models\Solicitud;
class ValidadorService{

    public function ambienteValido($idAmbiente, $fecha, $idPeriodosT){ //verifica si un ambiente/fecha/periodo
                                      // sigue siendo valido, ya que alguine podira haberle ganado
        if(count($idPeriodosT) == 1){
                $idPeriodos[] = $idPeriodosT[0];
        }else{
            for ($i=$idPeriodosT[0] ; $i <= $idPeriodosT[count($idPeriodosT) - 1] ; $i++ ) { 
                $idPeriodos[] = $i;
            }
        }
       $ambienteDisponible = true;
        $coincidenciasInhabilitados = Inhabilitado::where('ambiente_id', $idAmbiente)
                                                ->where('fecha', $fecha)
                                                ->whereIn('periodo_id', $idPeriodos)
                                                ->exists();
        if($coincidenciasInhabilitados){
            return false;
        }
        
        $idSolicitudes = DB::table('ambiente_solicitud')
            ->where('ambiente_id', $idAmbiente)
            ->pluck('solicitud_id');

        $solicitudesCoincidencia = Solicitud::where('estado', 'aprobado')
            ->whereDate('fechaReserva', $fecha)
            ->whereIn('id', $idSolicitudes)
            ->pluck('id');   
        if(!$solicitudesCoincidencia->isEmpty()){
            foreach ($solicitudesCoincidencia as $id) {
                $solicitud = Solicitud::find($id);
                // Verificar si algún período de la solicitud coincide con alguno de los periodos de $idPeriodos
                foreach ($idPeriodos as $periodo) {
                    if ($solicitud->periodo_ini_id <= $periodo && $solicitud->periodo_fin_id >= $periodo) {
                        return false;
                    }
                }
            }
        }
        return $ambienteDisponible;
    }
}
