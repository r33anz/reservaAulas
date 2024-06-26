<?php

namespace App\Services;

use App\Models\Ambiente;
use App\Models\Inhabilitado;
use Illuminate\Support\Facades\DB;
use App\Models\Solicitud;
use App\Models\Periodo;

class ValidadorService{

    public function antenderAmbiente($idAmbiente, $fecha, $idPeriodosT,$idUsuario){ 
        //verifica si un ambiente/fecha/periodo para atender solicitud
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
            return $this->crearRespuesta("Los ambientes están deshabilitados.",'advertencia'); //rojo
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
                        if ($solicitud->user_id === $idUsuario) {
                            return $this->crearRespuesta("Choque de reserva del mismo usuario para los periodos " . $ini->horainicial . "-" . $fin->horafinal, 'exito');
                        } else {
                            return $this->crearRespuesta("Ya hay una reserva con estos periodos " . $ini->horainicial . "-" . $fin->horafinal, 'advertencia');
                        }               
                    }
                }
            }   
        }
            return $this->crearRespuesta("Ambiente disponible",'exito'); //verde
    }
        
    public function validarAmbientesGrupos($idAmbientes, $fecha, $idPeriodosT, $idUsuario, $materia, $grupo, $razon) {
        $idPeriodos = count($idPeriodosT) == 1 ? [$idPeriodosT[0]] : range($idPeriodosT[0], $idPeriodosT[count($idPeriodosT) - 1]);

        $mensaje = $this->verificarAmbientesInhabilitados($idAmbientes, $fecha, $idPeriodos);
        if ($mensaje) return $this->crearRespuesta($mensaje, 'advertencia');

        $mensaje = $this->verificarSolicitudExistente($idUsuario, $materia, $grupo, $razon);
        if ($mensaje) return $this->crearRespuesta($mensaje, 'advertencia');

        $mensaje = $this->verificarReservasCoincidentes($idAmbientes, $fecha, $idPeriodos);
        if ($mensaje) return $this->crearRespuesta($mensaje, 'advertencia');

        $mensaje = $this->verificarSolicitudesCoincidentes($idAmbientes, $fecha, $idPeriodos);
        if ($mensaje) return $this->crearRespuesta($mensaje, 'advertencia');

        return $this->crearRespuesta("Ambiente disponible", 'exito');

    }

    protected function verificarAmbientesInhabilitados($idAmbientes, $fecha, $idPeriodos){
        foreach ($idAmbientes as $idAmbiente) {
            $coincidenciasInhabilitados = Inhabilitado::where('ambiente_id', $idAmbiente)
                ->where('fecha', $fecha)
                ->whereIn('periodo_id', $idPeriodos)
                ->exists();

            if ($coincidenciasInhabilitados) {
                $nombre = Ambiente::find($idAmbiente);
                return "El ambiente " . $nombre->nombre . " está deshabilitado en los periodos que seleccionó.";
            }
        }
        return null;
    }

    protected function verificarSolicitudExistente($idUsuario, $materia, $grupo, $razon){
        $solicitudExistenteAprobada = Solicitud::where('estado', 'aprobado')
            ->where('user_id', $idUsuario)
            ->where('materia', $materia)
            ->where('grupo', $grupo)
            ->where('razon', $razon)
            ->exists();

        if ($solicitudExistenteAprobada) {
            return "Usted ya tiene reserva para la misma materia, grupo y razón.";
        }

        $solicitudExistenteEnEspera = Solicitud::where('estado', 'en espera')
            ->where('user_id', $idUsuario)
            ->where('materia', $materia)
            ->where('grupo', $grupo)
            ->where('razon', $razon)
            ->exists();

        if ($solicitudExistenteEnEspera) {
            return "Usted ya tiene una solicitud para la misma materia, grupo y razón.";
        }

        return null;
    }

    protected function verificarReservasCoincidentes($idAmbientes, $fecha, $idPeriodos){
        $idSolicitudesAmbiente = DB::table('ambiente_solicitud')
            ->whereIn('ambiente_id', $idAmbientes)
            ->pluck('solicitud_id')
            ->unique()
            ->toArray();

        $solicitudesCoincidencia = Solicitud::where('estado', 'aprobado')
            ->whereDate('fechaReserva', $fecha)
            ->whereIn('id', $idSolicitudesAmbiente)
            ->get();

        foreach ($solicitudesCoincidencia as $solicitud) {
            foreach ($idPeriodos as $periodo) {
                if ($solicitud->periodo_ini_id <= $periodo && $solicitud->periodo_fin_id >= $periodo) {
                    $ini = Periodo::find($solicitud->periodo_ini_id);
                    $fin = Periodo::find($solicitud->periodo_fin_id);
                    return "Ya hay una reserva con estos periodos " . $ini->horainicial . "-" .  $fin->horafinal;
                }
            }
        }

        return null;
    }

    protected function verificarSolicitudesCoincidentes($idAmbientes, $fecha, $idPeriodos){
        $idSolicitudesAmbiente = DB::table('ambiente_solicitud')
            ->whereIn('ambiente_id', $idAmbientes)
            ->pluck('solicitud_id')
            ->unique()
            ->toArray();

        $solicitudesCoincidenciaEnEspera = Solicitud::where('estado', 'en espera')
            ->where('fechaReserva', $fecha)
            ->whereIn('id', $idSolicitudesAmbiente)
            ->get();

        foreach ($solicitudesCoincidenciaEnEspera as $solicitud) {
            foreach ($idPeriodos as $periodo) {
                if ($solicitud->periodo_ini_id <= $periodo && $solicitud->periodo_fin_id >= $periodo) {
                    $ini = Periodo::find($solicitud->periodo_ini_id);
                    $fin = Periodo::find($solicitud->periodo_fin_id);
                    return "Ya hay una solicitud con estos periodos " . $ini->horainicial . "-" .  $fin->horafinal . "\n del ambiente que seleccionó";
                }
            }
        }

        return null;
    }

    private function crearRespuesta($mensaje,$alerta){
        return (object) [
            'mensaje' => $mensaje,
            'alerta' => $alerta
        ];
    }
}
