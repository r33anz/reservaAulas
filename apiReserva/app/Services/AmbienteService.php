<?php

namespace App\Services;
use App\Models\Ambiente;
use App\Models\Inhabilitado;
use App\Models\Periodo;
use App\Models\Solicitud;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
class AmbienteService{

    public function todosAmbientes(){
        $ambientes = collect(Ambiente::all(['id', 'nombre'])->toArray())->unique()->values();
        return $ambientes;
    }

    public function buscarPorNombre($patron)
    {
        $resultados = Ambiente::where('nombre', 'like', '%' . $patron . '%')->get();
        $listaCoincidencias = [];
        foreach ($resultados as $resultado) {
            $piso = $resultado->piso;
            $bloque = $piso->bloque;

            $detalleAula = [
                'id' => $resultado->id,
                'nombre' => $resultado->nombre,
                'capacidad' => $resultado->capacidad,
                'tipo' => $resultado->tipo,
                'nombreBloque' => $bloque->nombreBloque,
                'nroPiso' => $piso->nroPiso,
            ];
            $listaCoincidencias[] = $detalleAula;
        }
        return $listaCoincidencias;
    }

    public function buscarPorCapacidad($minCapacidad, $maxCapacidad)
    {
        $resultados = Ambiente::whereBetween('capacidad', [$minCapacidad, $maxCapacidad])->get();
        $ambientes = [];
        foreach ($resultados as $resultado) {
            $piso = $resultado->piso;
            $bloque = $piso->bloque;

            $detalleAula = [
                'id' => $resultado->id,
                'nombre' => $resultado->nombre,
                'capacidad' => $resultado->capacidad,
                'tipo' => $resultado->tipo,
                'nombreBloque' => $bloque->nombreBloque,
                'nroPiso' => $piso->nroPiso,
            ];
            $ambientes[] = $detalleAula;
        }
        return $ambientes;
    }

    public function obtenerMaximoMinimoCapacidad()
    {
        $maxCapacidad = Ambiente::max('capacidad');
        $minCapacidad = Ambiente::min('capacidad');

        return [
            'max' => $maxCapacidad,
            'min' => $minCapacidad
        ];
    }
    
    public function busquedaAmbientesporCantidadFechaPeriodo($cantidad, $fecha, $periodos)
    {
        $enTiempo = $this->validadorTiempos($fecha, $periodos[0]);

        if (!$enTiempo) {
            return [
                (object) [
                    'mensaje' => "No puede realizar esta solicitud pasada la hora de inicio del periodo.",
                    'alerta' => "advertencia"
                ]
            ];
        }

        $busquedaFechaPeriodos = $this->fechaPeriodo($fecha, $periodos);
        $availableIds = $busquedaFechaPeriodos->toArray();
        
        $result = [];
        $busquedaCantidadMono = $this->busquedaMonoAmbiente($cantidad);

        foreach ($busquedaCantidadMono as $ambiente) {
            if (in_array($ambiente->id, $availableIds)) {
                $ambiente->load('piso.bloque'); // Cargar la relación del piso y bloque
                $result[] = [$ambiente]; 
            }
        }

        $busquedaCantidadMulti = $this->busquedaMultiAmbientes($cantidad);
        
        foreach ($busquedaCantidadMulti as $combination) {
            $allAvailable = true;
            foreach ($combination as $ambiente) {
                if (!in_array($ambiente->id, $availableIds)) {
                    $allAvailable = false;
                    break;
                }
            }
            if ($allAvailable) {
                foreach ($combination as $ambiente) {
                    $ambiente->load('piso.bloque'); // Cargar la relación del piso y bloque
                }
                $result[] = $combination;
            }
        }

        $response = [];
        foreach ($result as $combination) {
            $combinationData = [];
            foreach ($combination as $ambiente) {
                $combinationData[] = [
                    'id' => $ambiente->id,
                    'nombre' => $ambiente->nombre,
                    'tipo' => $ambiente->tipo,
                    'capacidad' => $ambiente->capacidad,
                    'piso' => $ambiente->piso ? $ambiente->piso->nroPiso : null,
                    'bloque' => $ambiente->piso && $ambiente->piso->bloque ? $ambiente->piso->bloque->nombreBloque : null
                ];
            }
            $response[] = $combinationData;
        }

        return $response;
    }

    private function busquedaMonoAmbiente($cantidad)
    {
        list($min, $max) = $this->establecerRango($cantidad);
        $ambientes = Ambiente::where('capacidad', '>=', $min)
                            ->where('capacidad', '<=', $max)
                            ->get();

        return $ambientes;
    }

    private function busquedaMultiAmbientes($cantidad)
    {
        list($min, $max) = $this->establecerRango($cantidad);
        $ambientes = Ambiente::orderBy('piso_id')
                            ->orderBy('id')
                            ->get()
                            ->groupBy('piso_id');

        $result = [];
        foreach ($ambientes as $piso_id => $ambientesPiso) {
            $combinations = $this->combinaciones($ambientesPiso->all(), $min, $max);
            foreach ($combinations as $combination) {
                $result[] = $combination;
            }
        }

        return $result;
    }

    private function establecerRango($cantidad)
    {
        $maxCapacidad = Ambiente::max('capacidad');
        $minCapacidad = Ambiente::min('capacidad');

        if ($cantidad > $maxCapacidad) {
            $min = $maxCapacidad;
            $max = $cantidad; 
        } else {
            if ($cantidad <= $minCapacidad) {
                $min = $minCapacidad;
                $max = $cantidad + 20;
            } else {
                $min = max($minCapacidad, $cantidad - 20);
                $max = min($maxCapacidad, $cantidad + 20);
            }
        }

        return [$min, $max];
    }

    private function combinaciones($ambientes, $min, $max)
    {
        $combinations = [];
        $count = count($ambientes);

        for ($i = 0; $i < (1 << $count); $i++) {
            $combination = [];
            $sum = 0;
            for ($j = 0; $j < $count; $j++) {
                if ($i & (1 << $j)) {
                    $combination[] = $ambientes[$j];
                    $sum += $ambientes[$j]->capacidad;
                }
            }
            if ($sum >= $min && $sum <= $max && count($combination) > 1) {
                $samePiso = true;
                $piso_id = $combination[0]->piso_id;
                foreach ($combination as $ambiente) {
                    if ($ambiente->piso_id != $piso_id) {
                        $samePiso = false;
                        break;
                    }
                }
                if ($samePiso) {
                    $combinations[] = $combination;
                }
            }
        }
        return $combinations;
    }

    private function fechaPeriodo($fecha, $periodos)
    {
        $idPeriodos = count($periodos) === 1 ? [$periodos[0]] : range($periodos[0], $periodos[count($periodos) - 1]);
        $ambientes = Ambiente::all();

        $ambientesInhabilitados = Inhabilitado::where('fecha', $fecha)
                                    ->whereIn('periodo_id', $idPeriodos)
                                    ->pluck('ambiente_id');

        $reservas = Solicitud::whereDate('fechaReserva', $fecha)
            ->where('estado', 'aprobado')
            ->where(function ($query) use ($idPeriodos) {
                foreach ($idPeriodos as $periodo) {
                    $query->orWhere(function ($q) use ($periodo) {
                        $q->where('periodo_ini_id', '<=', $periodo)
                            ->where('periodo_fin_id', '>=', $periodo);
                    });
                }
            })
            ->pluck('id');

        $ambientesReservados = DB::table('ambiente_solicitud')
            ->whereIn('solicitud_id', $reservas)
            ->pluck('ambiente_id')
            ->unique()
            ->values();

        $solicitudes = Solicitud::whereDate('fechaReserva', $fecha)
            ->where('estado', 'en espera')
            ->where(function ($query) use ($idPeriodos) {
                foreach ($idPeriodos as $periodo) {
                    $query->orWhere(function ($q) use ($periodo) {
                        $q->where('periodo_ini_id', '<=', $periodo)
                            ->where('periodo_fin_id', '>=', $periodo);
                    });
                }
            })
            ->pluck('id');

        $ambientesSolicitados = DB::table('ambiente_solicitud')
            ->whereIn('solicitud_id', $solicitudes)
            ->pluck('ambiente_id')
            ->unique()
            ->values();

        $ambientesInhabilitadosArray = $ambientesInhabilitados->toArray();
        $ambientesReservadosArray = $ambientesReservados->toArray();
        $ambientesSolicitadosArray = $ambientesSolicitados->toArray();

        $ambientesDisponibles = $ambientes->reject(function ($ambiente) use ($ambientesInhabilitadosArray, $ambientesReservadosArray, $ambientesSolicitadosArray) {
            return in_array($ambiente->id, $ambientesInhabilitadosArray) 
                || in_array($ambiente->id, $ambientesReservadosArray)
                || in_array($ambiente->id, $ambientesSolicitadosArray);
        });

        return $ambientesDisponibles->pluck('id');
    }

    private function validadorTiempos($fechaReserva, $idPeriodoInicial)
    {
        $periodo = Periodo::find($idPeriodoInicial);
        $horaInicial = Carbon::parse($periodo->horainicial);
        $fechaHoraReserva = Carbon::parse($fechaReserva . ' ' . $horaInicial->format('H:i:s'));
        $horaActual = Carbon::now();
        $horasFaltantes = $horaActual->diffInHours($fechaHoraReserva, false);
        return $horasFaltantes > 0;
    }
}
