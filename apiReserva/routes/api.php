<?php

use App\Http\Controllers\AmbienteController;
use App\Http\Controllers\ReservaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\InhabilitadoController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SolicitudController;
use App\Http\Controllers\ValidadorController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\AuthController;

//sin autentificacion
/*
    Route::controller(DocenteController::class)->group(function () {
        Route::get('/docentes/{id}','getMaterias');
        Route::get('/listaDocentes','getAllDocenteNames');
    });

    Route::controller(AmbienteController::class)->group(function () {
        Route::get('/ambientes', 'index');
        Route::get('/ambiente/{id}', 'show');
        Route::post('/registroAmbiente', 'store');
        Route::post('/busquedaAulaNew', 'buscarV2');
        Route::post('/buscarPorCapacidad', 'buscarPorCapacidad');
        Route::get('/maxMin', 'maximoMinimo');
        Route::post('/buscarCantidadFechaPeriodo', 'busquedaAmbientesporCantidadFechaPeriodo');
    });

    Route::controller(InhabilitadoController::class)->group(function () {
        Route::post('/inhabilitarAmbiente', 'inhabilitarAmbiente');
        Route::delete('/habilitarAmbiente', 'habilitarAmbiente');
        Route::post('/buscarInhabilitados', 'buscarPeriodos');
    });

    Route::controller(SolicitudController::class)->group(function () {
        Route::get('/fechasSolicitud', 'conseguirFechas');
        Route::post('/informacionSolicitud', 'informacionSolicitud');
        Route::get('/{idSolicitud}/recuperarInformacion', 'recuperarInformacion');
        Route::put('/aceptarSolicitud', 'aceptarSolicitud');
        Route::put('/rechazarSolicitud', 'rechazarSolicitud');
        Route::post('/verListas', 'verListas');
        Route::get('/periodosSolicitados/{fecha}/{idAmbiente}', 'periodosSolicitados');
        Route::post('/realizarSolicitud', 'realizarSolicitud');
        Route::get('/reservas/{fecha}', 'fechasReserva');
        Route::get('/solicitud/{fecha}', 'fechasSolicitud');
    });

    Route::controller(ValidadorController::class)->group(function () {
        Route::post('/consultarFechaPeriodAmbiente', 'consultarFechaPeriodoAmbiente');
        Route::get('/solicitudAtendida/{idSolicitud}', 'SolicitudAtendida');
    });
    
    Route::controller(ReservaController::class)->group(function () {
        Route::post('/docentes/reservas', 'reservasPorDocente');
        Route::put('/reservas/{id}', 'cancelarReserva');
        Route::get('/periodosReservados/{fecha}/{idAmbiente}', 'periodosReservados');
        Route::put('/inhabilitarReserva', 'inhabilitarReserva');
    });
    
    Route::controller(NotificationController::class)->group(function () {
        Route::post('/marcarNotificacionLeida', 'marcarNotificacionLeida');
        Route::get('/notificaciones/{idUsuario}', 'recuperarNotificaciones');
        Route::post('/notificarIndividualmente', 'notificacionIndividual');
        Route::post('/notificacionBroadcast', 'broadcast');
    });

*/


//autentificacion
// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::controller(DocenteController::class)->group(function () {
        Route::get('/docentes/{id}','getMaterias');
        Route::get('/listaDocentes','getAllDocenteNames');
    });

    Route::controller(AmbienteController::class)->group(function () {
        Route::get('/ambientes', 'index');
        Route::get('/ambiente/{id}', 'show');
        Route::post('/registroAmbiente', 'store');
        Route::post('/busquedaAulaNew', 'buscarV2');
        Route::post('/buscarPorCapacidad', 'buscarPorCapacidad');
        Route::get('/maxMin', 'maximoMinimo');
        Route::post('/buscarCantidadFechaPeriodo', 'busquedaAmbientesporCantidadFechaPeriodo');
    });

    Route::controller(InhabilitadoController::class)->group(function () {
        Route::post('/inhabilitarAmbiente', 'inhabilitarAmbiente');
        Route::delete('/habilitarAmbiente', 'habilitarAmbiente');
        Route::post('/buscarInhabilitados', 'buscarPeriodos');
    });

    Route::controller(SolicitudController::class)->group(function () {
        Route::get('/fechasSolicitud', 'conseguirFechas');
        Route::post('/informacionSolicitud', 'informacionSolicitud');
        Route::get('/{idSolicitud}/recuperarInformacion', 'recuperarInformacion');
        Route::put('/aceptarSolicitud', 'aceptarSolicitud');
        Route::put('/rechazarSolicitud', 'rechazarSolicitud');
        Route::post('/verListas', 'verListas');
        Route::get('/periodosSolicitados/{fecha}/{idAmbiente}', 'periodosSolicitados');
        Route::post('/realizarSolicitud', 'realizarSolicitud');
        Route::get('/reservas/{fecha}', 'fechasReserva');
        Route::get('/solicitud/{fecha}', 'fechasSolicitud');
    });

    Route::controller(ValidadorController::class)->group(function () {
        Route::post('/consultarFechaPeriodAmbiente', 'consultarFechaPeriodoAmbiente');
        Route::get('/solicitudAtendida/{idSolicitud}', 'SolicitudAtendida');
    });
    
    Route::controller(ReservaController::class)->group(function () {
        Route::post('/docentes/reservas', 'reservasPorDocente');
        Route::put('/reservas/{id}', 'cancelarReserva');
        Route::get('/periodosReservados/{fecha}/{idAmbiente}', 'periodosReservados');
        Route::put('/inhabilitarReserva', 'inhabilitarReserva');
    });
    
    Route::controller(NotificationController::class)->group(function () {
        Route::post('/marcarNotificacionLeida', 'marcarNotificacionLeida');
        Route::get('/notificaciones/{idUsuario}', 'recuperarNotificaciones');
        Route::post('/notificarIndividualmente', 'notificacionIndividual');
        Route::post('/notificacionBroadcast', 'broadcast');
    });

});