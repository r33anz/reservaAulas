<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Services\NotificadorService;
use App\Events\NotificacionUsuario;
use App\Events\SolicitudCreada;
use App\Notifications\SolicitudR;
class Solicitud extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'materia', 'cantidad', 'razon', 'fechaReserva', 'periodo_ini_id', 'periodo_fin_id', 'estado', 'grupo'];



    public function docente()
    {
        return $this->belongsTo(User::class);
    }

    public function ambientes()
    {
        return $this->belongsToMany(Ambiente::class, 'ambiente_solicitud', 'solicitud_id', 'ambiente_id');
    }

    public function periodoInicial()
    {
        return $this->belongsTo(Periodo::class, 'periodo_ini_id');
    }

    public function periodoFinal()
    {
        return $this->belongsTo(Periodo::class, 'periodo_fin_id');
    }

    public static function conseguirFechas(){
        $fechas = self::distinct()->pluck('fechaReserva');
        $listaFechas = [];

        foreach ($fechas as $fecha) {
            $solicitudesEspera = self::where('fechaReserva', $fecha)
                ->where('estado', 'en espera')
                ->pluck('id');

            $solicitudesReserva = self::where('fechaReserva', $fecha)
                ->where('estado', 'aprobado')
                ->pluck('id');

            $listaFechas[] = [
                'fecha' => $fecha,
                'solicitudes' => $solicitudesEspera,
                'reservas' => $solicitudesReserva,
            ];
        }

        return  $listaFechas;

    }

    public static function informacionSolicitud($id){
        $solicitud = self::find($id);

        if (!$solicitud) {
            return null;
        }

        $idAmbientes = DB::table('ambiente_solicitud')->where('solicitud_id', $id)->pluck('ambiente_id');
        $ambientes = Ambiente::whereIn('id', $idAmbientes)->get();

        if ($ambientes->isEmpty()) {
            return null;
        }

        $nombreDocente = User::where('id', $solicitud->user_id)->value('name');
        $nombresAmbientes = $ambientes->pluck('nombre')->implode(', ');

        return [
            'cantidad' => $solicitud->cantidad,
            'materia' => $solicitud->materia,
            'nombreDocente' => $nombreDocente,
            'razon' => $solicitud->razon,
            'periodo_ini_id' => $solicitud->periodo_ini_id,
            'periodo_fin_id' => $solicitud->periodo_fin_id,
            'fecha' => $solicitud->fechaReserva,
            'ambiente_nombre' => $nombresAmbientes,
        ];
    }

    public static function recuperarInformacion($idSolicitud){
        $solicitud = self::find($idSolicitud);

        if (!$solicitud) {
            return null;
        }

        $idAmbientes = DB::table('ambiente_solicitud')->where('solicitud_id', $idSolicitud)->pluck('ambiente_id');
        $ambientes = Ambiente::whereIn('id', $idAmbientes)->get();

        if ($ambientes->isEmpty()) {
            return null;
        }

        $docente = User::find($solicitud->user_id);
        $nombreDocente = $docente ? $docente->name : 'Docente no encontrado';

        $ini = Periodo::find($solicitud->periodo_ini_id);
        $fin = Periodo::find($solicitud->periodo_fin_id);

        $nombresAmbientes = $ambientes->pluck('nombre')->implode(', ');
        $capacidadesAmbientes = $ambientes->pluck('capacidad')->implode(', ');

        return [
            'nombreDocente' => $nombreDocente,
            'materia' => $solicitud->materia,
            'grupo' => $solicitud->grupo,
            'cantidad' => $solicitud->cantidad,
            'razon' => $solicitud->razon,
            'periodo_ini_id' => $ini ? $ini->horainicial : 'Periodo inicial no encontrado',
            'periodo_fin_id' => $fin ? $fin->horafinal : 'Periodo final no encontrado',
            'fecha' => $solicitud->fechaReserva,
            'ambiente_nombres' => $nombresAmbientes,
            'ambiente_capacidades' => $capacidadesAmbientes,
            'id_ambientes' => $idAmbientes,
        ];
    }

    public static function verListas($estado, $pagina){
        $fechaActual = now();

        if ($estado === 'aprobadas') {
            $query = self::orderBy('updated_at', 'asc')->where('estado', 'aprobado');
        } elseif ($estado === 'rechazadas') {
            $query = self::orderBy('updated_at', 'asc')->where('estado', 'rechazado');
        } elseif ($estado === 'en espera') {
            $query = self::orderBy('updated_at', 'asc')->where('estado', 'en espera');
        } elseif ($estado === 'canceladas') {
            $query = self::orderBy('updated_at', 'asc')->where('estado', 'cancelado');
        } elseif ($estado === 'inhabilitada') {
            $query = self::orderBy('updated_at', 'asc')->where('estado', 'inhabilitada');
        } elseif ($estado === 'prioridad') {
            $fechaActual = Carbon::now()->toDateString();

            $query = self::where('estado', 'en espera')
                ->orderByRaw("
                    CASE
                        WHEN fechaReserva < ? THEN 0
                        ELSE 1
                    END, 
                    ABS(DATEDIFF(fechaReserva, ?)),
                    periodo_ini_id
                ", [$fechaActual, $fechaActual])
                ->orderBy('periodo_ini_id');
        } else {
            $query = self::orderBy('updated_at', 'desc');
        }

        $solicitudes = $query->paginate(8, ['*'], 'pagina', $pagina);
        $datosSolicitudes = [];

        foreach ($solicitudes as $solicitud) {
            $idAmbientes = DB::table('ambiente_solicitud')->where('solicitud_id', $solicitud->id)->pluck('ambiente_id');
            $ambientes = Ambiente::whereIn('id', $idAmbientes)->get();
            $docente = User::find($solicitud->user_id);
            $ini = Periodo::find($solicitud->periodo_ini_id);
            $fin = Periodo::find($solicitud->periodo_fin_id);

            $nombresAmbientes = $ambientes->pluck('nombre')->implode(', ');
            $capacidadesAmbientes = $ambientes->pluck('capacidad')->implode(', ');

            $datosSolicitud = [
                'id' => $solicitud->id,
                'nombreDocente' => $docente->name,
                'materia' => $solicitud->materia,
                'grupo' => $solicitud->grupo,
                'cantidad' => $solicitud->cantidad,
                'razon' => $solicitud->razon,
                'periodo_ini_id' => $ini->horainicial,
                'periodo_fin_id' => $fin->horafinal,
                'fechaReserva' => $solicitud->fechaReserva,
                'ambiente_nombres' => $nombresAmbientes,
                'ambiente_capacidades' => $capacidadesAmbientes,
                'fechaEnviada' => substr($solicitud->created_at, 0, 10),
                'estado' => $solicitud->estado,
                'updated_at' => substr($solicitud->updated_at, 0, 10),
            ];

            if ($estado === 'aprobadas') {
                $datosSolicitud['fechaAtendida'] = $solicitud->fechaAtendida;
            } elseif ($estado === 'rechazadas') {
                $datosSolicitud['fechaAtendida'] = $solicitud->fechaAtendida;
                $datosSolicitud['razonRechazo'] = $solicitud->razonRechazo;
            }

            $datosSolicitudes[] = $datosSolicitud;
        }

        return [
            'numeroItemsPagina' => $solicitudes->perPage(),
            'paginaActual' => $solicitudes->currentPage(),
            'numeroPaginasTotal' => $solicitudes->lastPage(),
            'contenido' => $datosSolicitudes,
        ];
    }

    public static function obtenerSolicitudesPorFecha($fecha, $estado){
        $solicitudes = self::where('fechaReserva', $fecha)
                            ->where('estado', $estado)
                            ->get();

        if ($solicitudes->isEmpty()) {
            return null;
        }

        $resultado = [];

        foreach ($solicitudes as $solicitud) {
            $idAmbientes = DB::table('ambiente_solicitud')->where('solicitud_id', $solicitud->id)->pluck('ambiente_id');
            $ambientes = Ambiente::whereIn('id', $idAmbientes)->get();
            $docente = User::find($solicitud->user_id);
            $nombreDocente = $docente ? $docente->name : 'Docente no encontrado';

            $ini = Periodo::find($solicitud->periodo_ini_id);
            $fin = Periodo::find($solicitud->periodo_fin_id);

            $nombresAmbientes = $ambientes->pluck('nombre')->implode(', ');

            $resultado[] = [
                'nombreDocente' => $nombreDocente,
                'materia' => $solicitud->materia,
                'grupo' => $solicitud->grupo,
                'cantidad' => $solicitud->cantidad,
                'razon' => $solicitud->razon,
                'periodo_ini' => $ini ? $ini->horainicial : 'Periodo inicial no encontrado',
                'periodo_fin' => $fin ? $fin->horafinal : 'Periodo final no encontrado',
                'fecha' => $solicitud->fechaReserva,
                'ambiente_nombres' => $nombresAmbientes,
            ];
        }

        return $resultado;
    }

    public function aceptar($fechaAtendida, $notificadorService){
        $this->estado = 'aprobado';
        $this->fechaAtendida = $fechaAtendida;
        $this->save();
        $notificadorService->notificarAceptacion($this->id);
        event(new NotificacionUsuario($this->user_id, 'Nueva notificación.'));
    }

    public function rechazar($fechaAtendida, $razonRechazo, $notificadorService){
        $this->estado = 'rechazado';
        $this->fechaAtendida = $fechaAtendida;
        $this->razonRechazo = $razonRechazo;
        $this->save();
        $notificadorService->notificarRechazo($this->id);
        event(new NotificacionUsuario($this->user_id, 'Nueva notificación.'));
    }


    public static function obtenerPeriodosSolicitados($fecha, $idAmbiente){
        $coincidencias = DB::table('solicituds')
            ->join('ambiente_solicitud', 'solicituds.id', '=', 'ambiente_solicitud.solicitud_id')
            ->where('solicituds.fechaReserva', $fecha)
            ->where('ambiente_solicitud.ambiente_id', $idAmbiente)
            ->where('solicituds.estado', 'en espera')
            ->select('solicituds.id', 'solicituds.periodo_ini_id', 'solicituds.periodo_fin_id')
            ->get();

        $periodosReservados = [];

        foreach ($coincidencias as $coincidencia) {
            $periodoIni = $coincidencia->periodo_ini_id;
            $periodoFin = $coincidencia->periodo_fin_id;

            $periodos = range($periodoIni, $periodoFin);
            $periodosReservados[] = [
                'idSolicitud' => $coincidencia->id,
                'periodos' => $periodos
            ];
        }

        return $periodosReservados;
    }
    
    public static function realizarSolicitud($data, $ambienteValido){
        $idUsuario = $data['idDocente'];
        $materia = $data['materia'];
        $grupo = $data['grupo'][0];  
        $cantidad = $data['capacidad'];
        $razon = $data['razon'];
        $fechaReserva = $data['fechaReserva'];
        $estado = 'en espera';
        $idAmbientes = $data['ambiente']; // []
        $periodos = $data['periodos'];
    
        if (count($periodos) === 1) {
            $periodoInicial = $periodos[0];
            $periodoFinal = $periodos[0];
        } else {
            $periodoInicial = $periodos[0];
            $periodoFinal = $periodos[count($periodos) - 1];
        }

        // Validar disponibilidad de los ambientes
        $ambienteDisponible = $ambienteValido->validarAmbientesGrupos($idAmbientes, $fechaReserva, $periodos, $idUsuario, $materia, $grupo, $razon);
    
        if ($ambienteDisponible->alerta != 'exito') {
            return $ambienteDisponible;
        }
        // Crear la solicitud
        $solicitud = self::create([
            'user_id' => $idUsuario,
            'materia' => $materia,
            'grupo' => $grupo,
            'cantidad' => $cantidad,
            'razon' => $razon,
            'fechaReserva' => $fechaReserva,
            'periodo_ini_id' => $periodoInicial,
            'periodo_fin_id' => $periodoFinal,
            'estado' => $estado,
        ]);
    
        // Insertar en la tabla pivote ambiente_solicitud
        foreach ($idAmbientes as $idAmbiente) {
            DB::table('ambiente_solicitud')->insert([
                'ambiente_id' => $idAmbiente,
                'solicitud_id' => $solicitud->id
            ]);
        }
    
        // Notificar al usuario sobre la nueva solicitud
        $nombreAmbiente = Ambiente::whereIn('id', $idAmbientes)->pluck('nombre')->implode(', ');
        $ini = Periodo::find($periodoInicial);
        $fin = Periodo::find($periodoFinal);
        $user = User::find($idUsuario);
        dispatch(function () use ($user, $nombreAmbiente, $fechaReserva, $ini, $fin) {
            $user->notify(new SolicitudR($nombreAmbiente, $fechaReserva, $ini->horainicial, $fin->horafinal));
        });
    
        // Notificar al administrador
        event(new SolicitudCreada($solicitud->id));
    
        return ['mensaje' => 'Registro exitoso'];
    }
    
}
