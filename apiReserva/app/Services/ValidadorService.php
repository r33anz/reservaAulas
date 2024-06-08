<?php

namespace App\Services;
use App\Models\Inhabilitado;
use Illuminate\Support\Facades\DB;
use App\Models\Solicitud;
use App\Models\Periodo;

class ValidadorService{

    public function ambienteValido($idAmbiente, $fecha, $idPeriodosT,$idUsuario){ //verifica si un ambiente/fecha/periodo
                                      // sigue siendo valido, ya que alguine podira haberle ganado
        if(count($idPeriodosT) == 1){
                $idPeriodos[] = $idPeriodosT[0];
        }else{
            for ($i=$idPeriodosT[0] ; $i <= $idPeriodosT[count($idPeriodosT) - 1] ; $i++ ) { 
                $idPeriodos[] = $i;
            }
        }
       
        $coincidenciasInhabilitados = Inhabilitado::where('ambiente_id', $idAmbiente)
                                                ->where('fecha', $fecha)
                                                ->whereIn('periodo_id', $idPeriodos)
                                                ->exists();
        if($coincidenciasInhabilitados){
            return $this->crearRespuesta("Los ambientes que busca están deshabilitados.", false,'advertencia'); //rojo
        }
        
        //Verificacion si hay reserva con choques de ambientes
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
                        $ini = Periodo::find($solicitud->periodo_ini_id);
                        $fin = Periodo::find($solicitud->periodo_fin_id);
                        return $this->crearRespuesta("Ya hay una reserva con estos periodos " .  $ini->horainicial . "-" .  $fin->horafinal, false,'advertencia'); //rojo                    
                    }
                }
            }
        }
        //
        //Verificacion si hay solicitudes con choques de ambientes
        $solicitudesCoincidenciaEnEspera = Solicitud::where('estado', 'en espera')
            ->whereDate('fechaReserva', $fecha)
            ->whereIn('id', $idSolicitudes)
            ->pluck('id');
        if(!$solicitudesCoincidenciaEnEspera->isEmpty()){
            foreach ($solicitudesCoincidenciaEnEspera as $id) {
                $solicitud = Solicitud::find($id);
                // Verificar si algún período de la solicitud coincide con alguno de los periodos de $idPeriodos
                foreach ($idPeriodos as $periodo) {
                    if ($solicitud->periodo_ini_id <= $periodo && $solicitud->periodo_fin_id >= $periodo) {
                        $ini = Periodo::find($solicitud->periodo_ini_id);
                        $fin = Periodo::find($solicitud->periodo_fin_id);
                        return $this->crearRespuesta("Ya hay una solicitud con estos periodos " . $ini->horainicial . "-" .  $fin->horafinal, true,'alerta'); //amarillo
                    }
                }
                }
            }
        //
        //verificacion de si un usuario hizo las misma solicitudes
        $solicitudesUsuario = Solicitud::where('estado', '!=', 'rechazado')
            ->where('docente_id', $idUsuario)
            ->where('fechaReserva', $fecha)
            ->whereHas('ambientes', function($query) use ($idAmbiente) {
                $query->where('ambiente_id', $idAmbiente);
            })
            ->pluck('id');

        foreach ($solicitudesUsuario as $id) {
            $solicitud = Solicitud::find($id);
            foreach ($idPeriodos as $periodo) {
                if ($solicitud->periodo_ini_id <= $periodo && $solicitud->periodo_fin_id >= $periodo) {
                    $ini = Periodo::find($solicitud->periodo_ini_id);
                    $fin = Periodo::find($solicitud->periodo_fin_id);
                    return $this->crearRespuesta("Usted ya ha realizado una solicitud con estos periodos " . $ini->horainicial . "-" .  $fin->horafinal, false, 'advertencia'); //rojo
                }
            }
        }
        //


        return $this->crearRespuesta("Ambiente disponible", true,'exito'); //verde
    }


    public function antenderAmbiente($idAmbiente, $fecha, $idPeriodosT){ //verifica si un ambiente/fecha/periodo para atender solicitud
        // sigue siendo valido, ya que alguine podira haberle ganado
        if(count($idPeriodosT) == 1){
            $idPeriodos[] = $idPeriodosT[0];
        }else{
            for ($i=$idPeriodosT[0] ; $i <= $idPeriodosT[count($idPeriodosT) - 1] ; $i++ ) { 
                $idPeriodos[] = $i;
            }
        }

        $coincidenciasInhabilitados = Inhabilitado::where('ambiente_id', $idAmbiente)
                        ->where('fecha', $fecha)
                        ->whereIn('periodo_id', $idPeriodos)
                        ->exists();
        if($coincidenciasInhabilitados){
            return $this->crearRespuesta("Los ambientes que busca están deshabilitados.", false,'advertencia'); //rojo
        }

        //Verificacion si hay reserva con choques de ambientes
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
                        $ini = Periodo::find($solicitud->periodo_ini_id);
                        $fin = Periodo::find($solicitud->periodo_fin_id);
                        return $this->crearRespuesta("Ya hay una reserva con estos periodos " .  $ini->horainicial . "-" .  $fin->horafinal, false,'advertencia'); //rojo                    
                    }
                }
            }   
        }
            return $this->crearRespuesta("Ambiente disponible", true,'exito'); //verde
        }

        
    private function crearRespuesta($mensaje, $estado,$alerta)
    {
        return (object) [
            'mensaje' => $mensaje,
            'estado' => $estado,
            'alerta' => $alerta
        ];
    }
}
