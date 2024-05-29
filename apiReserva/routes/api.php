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
use App\Http\Controllers\SolicitudController;
use App\Http\Controllers\ValidadorController;
///Docente
Route::get('/docentes/{id}', [DocenteController::class, 'getMaterias']);


///Administrador
/*Route::get('/pisos', function (Request $request) {
    return new BloqueResource(Bloque::find(1)); 
});
Route::get('/ambientes/pisos', function (Request $request) {
    return new PisoResource(Piso::find(1)); 
});*/
Route::get('/bloques', [BloqueController::class, 'index']);
Route::get('/bloques/{id}', [BloqueController::class, 'show']);

//Route::get('/periodos', [PeriodoController::class, 'index']);
Route::get('/periodos/{id}', [PeriodoController::class, 'show']);
Route::get('/periodos', [PeriodoController::class, 'getPeriodos']);

//Ambiente
Route::post('/busquedaAula',[AmbienteController::class,'buscar']);
Route::post('/busquedaAulaNew',[AmbienteController::class,'buscarV2']);
Route::get('/ambiente/{id}', [AmbienteController::class, 'show']);
Route::get('/ambientes', [AmbienteController::class, 'index']);
Route::post('/registroAmbiente',[AmbienteController::class,'store']);
Route::get('/{id}/ambientesMismoPiso', [AmbienteController::class, 'ambientesMismoPiso']);
Route::get('/{id}/ambientesMismoBloque', [AmbienteController::class, 'ambientesMismoBloque']);
Route::post('/buscarPorCapacidad', [AmbienteController::class, 'buscarPorCapacidad']);

//Habilitado/DeshabilitadoAula
Route::post('/inhabilitarAmbiente',[InhabilitadoController::class,'inhabilitarAmbiente']);
Route::delete('/habilitarAmbiente',[InhabilitadoController::class,'habilitarAmbiente']);
Route::post('/buscarInhabilitados',[InhabilitadoController::class,'buscarPeriodos']);

//Solicitud
Route::get('/fechasSolicitud',[SolicitudController::class,'conseguirFechas']);
Route::post('/realizarSolicitud',[SolicitudController::class,'registroSolicitud']);
Route::post('/informacionSolicitud',[SolicitudController::class,'informacionSolicitud']);
Route::get('/{idSolicitud}/recuperarInformacion',[SolicitudController::class,'recuperarInformacion']);
Route::put('/aceptarSolicitud',[SolicitudController::class,'aceptarSolicitud']);
Route::put('/rechazarSolicitud',[SolicitudController::class,'rechazarSolicitud']);
Route::post('/verListas',[SolicitudController::class,'verListas']);

//validador
Route::post('/consultarFechaPeriodo',[ValidadorController::class,'consultaFechaPeriodo']);  //devuelves los ambientes habiles
Route::post('/consultarFechaPeriodAmbiente',[ValidadorController::class,'consultarFechaPeriodoAmbiente']); 
Route::get('/solicitudAtendida/{idSolicitud}',[ValidadorController::class,'SolicitudAtendida']); //devuelve si una solicitud ya fue atendida o no

//reservas 
Route::post('/docentes/reservas', [ReservaController::class,'reservasPorDocente']);
Route::put('/reservas/{id}', [ReservaController::class,'cancelarReserva']);
Route::get('/periodosReservados/{fecha}/{idAmbiente}',[ReservaController::class,'periodosReservados']);
Route::put('/inhabilitarReserva', [ReservaController::class, 'inhabilitarReserva']);
