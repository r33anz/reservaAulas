<?php

use App\Http\Controllers\AmbienteController;
use App\Http\Controllers\BloqueController;
use App\Http\Controllers\PeriodoController;
use App\Http\Controllers\ReservaController;
use App\Http\Resources\BloqueResource;
use App\Http\Resources\PisoResource;
use App\Models\Piso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Bloque;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\InhabilitadoController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SolicitudController;
use App\Http\Controllers\ValidadorController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\AuthController;

/*
///Docente
Route::get('/docentes/{id}', [DocenteController::class, 'getMaterias']);  //REDONE
Route::get('/listaDocentes', [DocenteController::class, 'getAllDocenteNames']); //REDONE

//Bloques
Route::get('/bloques', [BloqueController::class, 'index']); 
Route::get('/bloques/{id}', [BloqueController::class, 'show']);

Route::get('/periodos/{id}', [PeriodoController::class, 'show']);
Route::get('/periodos', [PeriodoController::class, 'getPeriodos']);

//Ambiente
Route::post('/busquedaAula', [AmbienteController::class, 'buscar']);
Route::post('/busquedaAulaNew', [AmbienteController::class, 'buscarV2']);
Route::get('/ambiente/{id}', [AmbienteController::class, 'show']);
Route::get('/ambientes', [AmbienteController::class, 'index']);
Route::post('/registroAmbiente', [AmbienteController::class, 'store']);
Route::get('/{id}/ambientesMismoPiso', [AmbienteController::class, 'ambientesMismoPiso']);
Route::get('/{id}/ambientesMismoBloque', [AmbienteController::class, 'ambientesMismoBloque']);
Route::post('/buscarPorCapacidad', [AmbienteController::class, 'buscarPorCapacidad']);
Route::get('/maxMin',[AmbienteController::class,'maximoMinimo']);
Route::post('/buscarCantidadFechaPeriodo',[AmbienteController::class,'busquedaAmbientesporCantidadFechaPeriodo']);
//Route::get('/buscar/{cantidad}',[AmbienteController::class,'busquedaMultiAmbientes']);

//Habilitado/DeshabilitadoAula
Route::post('/inhabilitarAmbiente', [InhabilitadoController::class, 'inhabilitarAmbiente']);
Route::delete('/habilitarAmbiente', [InhabilitadoController::class, 'habilitarAmbiente']);
Route::post('/buscarInhabilitados', [InhabilitadoController::class, 'buscarPeriodos']);

//Solicitud
Route::get('/fechasSolicitud', [SolicitudController::class, 'conseguirFechas']);
Route::post('/realizarSolicitud', [SolicitudController::class, 'registroSolicitud']); //primer 
Route::post('/realizarSolicitudP2', [SolicitudController::class, 'registroSolicitudP2']); //segundo
Route::post('/informacionSolicitud', [SolicitudController::class, 'informacionSolicitud']);
Route::get('/{idSolicitud}/recuperarInformacion', [SolicitudController::class, 'recuperarInformacion']);
Route::get('/periodosSolicitados/{fecha}/{idAmbiente}', [SolicitudController::class, 'periodosSolicitados']);
Route::put('/aceptarSolicitud', [SolicitudController::class, 'aceptarSolicitud']);
Route::put('/rechazarSolicitud', [SolicitudController::class, 'rechazarSolicitud']);
Route::post('/verListas', [SolicitudController::class, 'verListas']);
Route::get('/periodosSolicitados/{fecha}/{idAmbiente}', [SolicitudController::class, 'periodosSolicitados']);

//validador
Route::post('/consultarFechaPeriodo', [ValidadorController::class, 'consultaFechaPeriodo']);  //devuelves los ambientes habiles dado una fecha y un rango de periodos
Route::post('/consultarFechaPeriodAmbiente', [ValidadorController::class, 'consultarFechaPeriodoAmbiente']);
Route::get('/solicitudAtendida/{idSolicitud}', [ValidadorController::class, 'SolicitudAtendida']); //devuelve si una solicitud ya fue atendida o no

//reservas 
Route::post('/docentes/reservas', [ReservaController::class, 'reservasPorDocente']);
Route::put('/reservas/{id}', [ReservaController::class, 'cancelarReserva']);
Route::get('/periodosReservados/{fecha}/{idAmbiente}', [ReservaController::class, 'periodosReservados']);
Route::put('/inhabilitarReserva', [ReservaController::class, 'inhabilitarReserva']);

//notificaciones
Route::post('/marcarNotificacionLeida',[NotificationController::class,'marcarNotificacionLeida']);
Route::get('/notificaciones/{idUsuario}',[NotificationController::class,'recuperarNotificaciones']);
Route::post('/notificarIndividualmente',[NotificationController::class,'notificacionIndividual']);
Route::post('/notificacionBroadcast',[NotificationController::class,'broadcast']);

//reportes
Route::get('/generarReporte', [ReporteController::class, 'generarReporte']);
*/

//autentificacion
// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Docentes
    Route::get('/docentes/{id}', [DocenteController::class, 'getMaterias']);
    Route::get('/listaDocentes', [DocenteController::class, 'getAllDocenteNames']);

    // Bloques
    Route::get('/bloques', [BloqueController::class, 'index']);
    Route::get('/bloques/{id}', [BloqueController::class, 'show']);

    // Periodos
    Route::get('/periodos/{id}', [PeriodoController::class, 'show']);
    Route::get('/periodos', [PeriodoController::class, 'getPeriodos']);

    // Ambientes
    Route::post('/busquedaAula', [AmbienteController::class, 'buscar']);
    Route::post('/busquedaAulaNew', [AmbienteController::class, 'buscarV2']);
    Route::get('/ambiente/{id}', [AmbienteController::class, 'show']);
    Route::get('/ambientes', [AmbienteController::class, 'index']);
    Route::post('/registroAmbiente', [AmbienteController::class, 'store']);
    Route::get('/{id}/ambientesMismoPiso', [AmbienteController::class, 'ambientesMismoPiso']);
    Route::get('/{id}/ambientesMismoBloque', [AmbienteController::class, 'ambientesMismoBloque']);
    Route::post('/buscarPorCapacidad', [AmbienteController::class, 'buscarPorCapacidad']);
    Route::get('/maxMin',[AmbienteController::class,'maximoMinimo']);
    Route::post('/buscarCantidadFechaPeriodo',[AmbienteController::class,'busquedaAmbientesporCantidadFechaPeriodo']);
    //Route::get('/buscar/{cantidad}',[AmbienteController::class,'busquedaMultiAmbientes']);
    // Habilitado/DeshabilitadoAula
    Route::post('/inhabilitarAmbiente', [InhabilitadoController::class, 'inhabilitarAmbiente']);
    Route::delete('/habilitarAmbiente', [InhabilitadoController::class, 'habilitarAmbiente']);
    Route::post('/buscarInhabilitados', [InhabilitadoController::class, 'buscarPeriodos']);

    // Solicitud
    Route::get('/fechasSolicitud', [SolicitudController::class, 'conseguirFechas']);
    Route::post('/realizarSolicitud', [SolicitudController::class, 'registroSolicitud']);
    Route::post('/realizarSolicitudP2', [SolicitudController::class, 'registroSolicitudP2']);
    Route::post('/informacionSolicitud', [SolicitudController::class, 'informacionSolicitud']);
    Route::get('/{idSolicitud}/recuperarInformacion', [SolicitudController::class, 'recuperarInformacion']);
    Route::put('/aceptarSolicitud', [SolicitudController::class, 'aceptarSolicitud']);
    Route::put('/rechazarSolicitud', [SolicitudController::class, 'rechazarSolicitud']);
    Route::post('/verListas', [SolicitudController::class, 'verListas']);
    Route::get('/periodosSolicitados/{fecha}/{idAmbiente}', [SolicitudController::class, 'periodosSolicitados']);

    // Validador
    Route::post('/consultarFechaPeriodo', [ValidadorController::class, 'consultaFechaPeriodo']);
    Route::post('/consultarFechaPeriodAmbiente', [ValidadorController::class, 'consultarFechaPeriodoAmbiente']);
    Route::get('/solicitudAtendida/{idSolicitud}', [ValidadorController::class, 'SolicitudAtendida']);

    // Reservas
    Route::post('/docentes/reservas', [ReservaController::class, 'reservasPorDocente']);
    Route::put('/reservas/{id}', [ReservaController::class, 'cancelarReserva']);
    Route::get('/periodosReservados/{fecha}/{idAmbiente}', [ReservaController::class, 'periodosReservados']);
    Route::put('/inhabilitarReserva', [ReservaController::class, 'inhabilitarReserva']);

    // Notificaciones
    Route::post('/marcarNotificacionLeida', [NotificationController::class, 'marcarNotificacionLeida']);
    Route::get('/notificaciones/{idUsuario}', [NotificationController::class, 'recuperarNotificaciones']);
    Route::post('/notificarIndividualmente', [NotificationController::class, 'notificacionIndividual']);
    Route::post('/notificacionBroadcast', [NotificationController::class, 'broadcast']);

    // Reportes
    Route::get('/generarReporte', [ReporteController::class, 'generarReporte']);
    
});