<?php

namespace App\Services;
use App\Models\Inhabilitado;
use Illuminate\Support\Facades\DB;
use App\Models\Solicitud;
use App\Models\Periodo;

class ValidadorService{

    public function ambienteValido($idAmbiente, $fecha, $idPeriodosT,$idUsuario,$materia, $grupo,$razon){ //verifica si un ambiente/fecha/periodo
                                      // sigue siendo valido, ya que alguine podira haberle ganado
        if(count($idPeriodosT) == 1){
                $idPeriodos[] = $idPeriodosT[0];
        }else{
            for ($i=$idPeriodosT[0] ; $i <= $idPeriodosT[count($idPeriodosT) - 1] ; $i++ ) { 
                $idPeriodos[] = $i;
            }
        }
        //verifica periodos inhailitados
        $coincidenciasInhabilitados = Inhabilitado::where('ambiente_id', $idAmbiente)
                                                ->where('fecha', $fecha)
                                                ->whereIn('periodo_id', $idPeriodos)
                                                ->exists();
        if($coincidenciasInhabilitados){
            return $this->crearRespuesta("Los ambientes que busca están deshabilitados.",'advertencia'); //rojo
        }
        //recoges los ids de solicitud que tienen reservado este ambiente
        $idSolicitudesAmbiente = DB::table('ambiente_solicitud')
                                ->where('ambiente_id', $idAmbiente)
                                ->pluck('solicitud_id');
        //verificacion de si un usuario hizo las misma reserva
        $solicitudesUsuario = Solicitud::where('estado',  'aprobado')
                                        ->where('user_id', $idUsuario)
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
                    return $this->crearRespuesta("Usted ya ha realizado una reserva con estos periodos " 
                                                . $ini->horainicial . "-" . $fin->horafinal, 'alerta');//amarillo
                }
            }
        }
        //
        //verificacion de si un usuario hizo las misma solicitudes
        $solicitudesUsuario = Solicitud::where('estado',  'en espera')
                                        ->where('user_id', $idUsuario)
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
                    return $this->crearRespuesta("Usted ya ha realizado una solicitud con estos periodos " 
                                                . $ini->horainicial . "-" . $fin->horafinal, 'alerta');//amarilla
                }
            }
        }
        //
        //verificacion si se esta solicitando  las mismas materias y/o grupos 
        $solicitudExistente = Solicitud::where('estado', 'en espera')
                                    ->where('user_id', $idUsuario)
                                    ->where('materia', $materia)
                                    ->where('grupo', $grupo)
                                    ->where('razon',$razon)
                                    ->exists();

        if($solicitudExistente) {
            return $this->crearRespuesta("Usted ya tiene una solicitud 
                                        para la misma materia,grupo y razon.", 'alerta');//amarillo
        }
        //
        //verificacion si se estan reservando las mismas materias y/o grupos 
        $solicitudExistente = Solicitud::where('estado',  'aprobado')
                    ->where('user_id', $idUsuario)
                    ->where('materia', $materia)
                    ->where('grupo', $grupo)
                    ->where('razon',$razon)
                    ->exists();

            if($solicitudExistente) {
            return $this->crearRespuesta("Usted ya tiene reserva para la misma 
                        materia,grupo y razon.", 'advertencia');//rojo
            }
            //
        //Verificacion si hay reserva con choques de ambientes
        $solicitudesCoincidencia = Solicitud::where('estado', 'aprobado')
                                                ->whereDate('fechaReserva', $fecha)
                                                ->whereIn('id', $idSolicitudesAmbiente)
                                                ->pluck('id');   
        if(!$solicitudesCoincidencia->isEmpty()){
            foreach ($solicitudesCoincidencia as $id) {
                $solicitud = Solicitud::find($id);
                foreach ($idPeriodos as $periodo) {
                    if ($solicitud->periodo_ini_id <= $periodo && $solicitud->periodo_fin_id >= $periodo) {
                        $ini = Periodo::find($solicitud->periodo_ini_id);
                        $fin = Periodo::find($solicitud->periodo_fin_id);
                        return $this->crearRespuesta("Ya hay una reserva con estos periodos " 
                                                    .$ini->horainicial . "-" .  $fin->horafinal,'advertencia'); //rojo                    
                    }
                }
            }
        }
        //
        
        //Verificacion si hay solicitudes con choques de ambiente/periodo
        $solicitudesCoincidenciaEnEspera = Solicitud::where('estado', 'en espera')
                                                    ->where('fechaReserva', $fecha)
                                                    ->whereIn('id', $idSolicitudesAmbiente)
                                                    ->pluck('id');
        if(!$solicitudesCoincidenciaEnEspera->isEmpty()){
            foreach ($solicitudesCoincidenciaEnEspera as $id) {
                $solicitud = Solicitud::find($id);
                foreach ($idPeriodos as $periodo) {
                    if ($solicitud->periodo_ini_id <= $periodo && $solicitud->periodo_fin_id >= $periodo) {
                        $ini = Periodo::find($solicitud->periodo_ini_id);
                        $fin = Periodo::find($solicitud->periodo_fin_id);
                        return $this->crearRespuesta("Ya hay una solicitud con estos periodos " 
                                    . $ini->horainicial . "-" .  $fin->horafinal. "\n del ambiente que selecciono" ,'advertencia'); //rojo
                    }
                }
            }
        }
        //
        
        return $this->crearRespuesta("Ambiente disponible",'exito'); //verde
    }

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
        
    private function crearRespuesta($mensaje,$alerta)
    {
        return (object) [
            'mensaje' => $mensaje,
            'alerta' => $alerta
        ];
    }

    public function validarAmbientesGrupos($idAmbientes, $fecha, $periodos, $idUsuario, $materia, $grupos, $razon) {
        $idPeriodos = $this->obtenerPeriodos($periodos);
    
        // Verificación de Ambientes Inhabilitados
        foreach ($idAmbientes as $idAmbiente) {
            $coincidenciasInhabilitados = Inhabilitado::where('ambiente_id', $idAmbiente)
                                                      ->where('fecha', $fecha)
                                                      ->whereIn('periodo_id', $idPeriodos)
                                                      ->exists();
            if ($coincidenciasInhabilitados) {//dar nombre
                return $this->crearRespuesta("Los ambientes están deshabilitados.", 'advertencia');
            }
        }
    
        // Verificación de Reservas Existentes y Solicitudes del Usuario
        foreach ($idAmbientes as $idAmbiente) {
            $idSolicitudesAmbiente = DB::table('ambiente_solicitud')
                                       ->where('ambiente_id', $idAmbiente)
                                       ->pluck('solicitud_id');
    
            foreach (['aprobado', 'en espera'] as $estado) {
                $solicitudesUsuario = Solicitud::where('estado', $estado)
                                               ->where('user_id', $idUsuario)
                                               ->where('fechaReserva', $fecha)
                                               ->whereIn('id', $idSolicitudesAmbiente)
                                               ->pluck('id');
    
                foreach ($solicitudesUsuario as $id) {
                    $solicitud = Solicitud::find($id);
                    foreach ($idPeriodos as $periodo) {
                        if ($solicitud->periodo_ini_id <= $periodo && $solicitud->periodo_fin_id >= $periodo) {
                            $ini = Periodo::find($solicitud->periodo_ini_id);
                            $fin = Periodo::find($solicitud->periodo_fin_id);
                            $mensaje = "Usted ya ha realizado una " . ($estado === 'aprobado' ? 'reserva' : 'solicitud') . 
                                       " con estos periodos " . $ini->horainicial . "-" . $fin->horafinal;
                            return $this->crearRespuesta($mensaje, 'advertencia');
                        }
                    }
                }
            }
        }
    
        // Verificación de Choques de Materias y Grupos
        foreach ($grupos as $grupo) {
            $solicitudExistente = Solicitud::where('estado', 'aprobado')
                                           ->orWhere('estado', 'en espera')
                                           ->where('user_id', $idUsuario)
                                           ->where('materia', $materia)
                                           ->where('grupo', $grupo)
                                           ->where('razon', $razon)
                                           ->exists();
    
            if ($solicitudExistente) {
                return $this->crearRespuesta("Usted ya tiene una reserva/solicitud para la materia $materia y grupo $grupo con la misma razón.", 'advertencia');
            }
        }
    
        // Verificación de Choques de Ambientes
        foreach ($idAmbientes as $idAmbiente) {
            $solicitudesCoincidencia = Solicitud::where('estado', 'aprobado')
                                                ->whereDate('fechaReserva', $fecha)
                                                ->whereIn('id', $idSolicitudesAmbiente)
                                                ->pluck('id');
    
            foreach ($solicitudesCoincidencia as $id) {
                $solicitud = Solicitud::find($id);
                foreach ($idPeriodos as $periodo) {
                    if ($solicitud->periodo_ini_id <= $periodo && $solicitud->periodo_fin_id >= $periodo) {
                        $ini = Periodo::find($solicitud->periodo_ini_id);
                        $fin = Periodo::find($solicitud->periodo_fin_id);
                        return $this->crearRespuesta("Ya hay una reserva con estos periodos " . $ini->horainicial . "-" . $fin->horafinal . " en el ambiente $idAmbiente", 'advertencia');
                    }
                }
            }
    
            $solicitudesCoincidenciaEnEspera = Solicitud::where('estado', 'en espera')
                                                        ->where('fechaReserva', $fecha)
                                                        ->whereIn('id', $idSolicitudesAmbiente)
                                                        ->pluck('id');
    
            foreach ($solicitudesCoincidenciaEnEspera as $id) {
                $solicitud = Solicitud::find($id);
                foreach ($idPeriodos as $periodo) {
                    if ($solicitud->periodo_ini_id <= $periodo && $solicitud->periodo_fin_id >= $periodo) {
                        $ini = Periodo::find($solicitud->periodo_ini_id);
                        $fin = Periodo::find($solicitud->periodo_fin_id);
                        return $this->crearRespuesta("Ya hay una solicitud con estos periodos " . $ini->horainicial . "-" . $fin->horafinal . " en el ambiente $idAmbiente", 'alerta');
                    }
                }
            }
        }
    
        return $this->crearRespuesta("Ambientes y grupos disponibles", 'exito');
    }

    private function obtenerPeriodos($idPeriodosT) {
        if (count($idPeriodosT) == 1) {
            return [$idPeriodosT[0]];
        } else {
            $idPeriodos = [];
            for ($i = $idPeriodosT[0]; $i <= $idPeriodosT[count($idPeriodosT) - 1]; $i++) {
                $idPeriodos[] = $i;
            }
            return $idPeriodos;
        }
    }
}
