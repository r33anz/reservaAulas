<?php

use App\Http\Controllers\AmbienteController;
use App\Http\Controllers\BloqueController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\InhabilitadoController;
use App\Http\Controllers\PeriodoController;
use App\Http\Resources\BloqueResource;
use App\Http\Resources\PisoResource;
use App\Models\Bloque;
use App\Models\Piso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
<<<<<<< HEAD

// /Docente
Route::get('/docentes/{id}', [DocenteController::class, 'getMaterias']);

// /Administrador
/*Route::get('/pisos', function (Request $request) {
    return new BloqueResource(Bloque::find(1));
});
Route::get('/ambientes/pisos', function (Request $request) {
    return new PisoResource(Piso::find(1));
});*/
Route::get('/bloques', [BloqueController::class, 'index']);
Route::get('/bloques/{id}', [BloqueController::class, 'show']);

// /Registro de ambiente
Route::post('/registroAmbiente', [AmbienteController::class, 'store']);

// Route::get('/periodos', [PeriodoController::class, 'index']);
Route::get('/periodos/{id}', [PeriodoController::class, 'show']);
Route::get('/periodos', [PeriodoController::class, 'getPeriodos']);

// Ambiente
Route::post('/busquedaAula', [AmbienteController::class, 'buscar']);
Route::get('/ambientes/{id}', [AmbienteController::class, 'show']);
Route::get('/ambientes', [AmbienteController::class, 'index']);

// Habilitado/DeshabilitadoAula
Route::post('/inhabilitarAmbiente', [InhabilitadoController::class, 'inhabilitarAmbiente']);
Route::delete('/habilitarAmbiente', [InhabilitadoController::class, 'habilitarAmbiente']);
Route::get('/buscarInhabilitados', [InhabilitadoController::class, 'buscarPeriodos']);
=======
use App\Models\Bloque;
use App\Http\Controllers\DocenteController;


///Docente

Route::get('/docentes/{id}', [DocenteController::class, 'getMaterias']);


///Administrador

Route::get('/pisos', function (Request $request) {
    return new BloqueResource(Bloque::find(1)); 
});
Route::get('/ambientes/pisos', function (Request $request) {
    return new PisoResource(Piso::find(1)); 
});

Route::get('/bloques', [BloqueController::class, 'index']);
Route::get('/bloques/{id}', [BloqueController::class, 'show']);

Route::get('/ambientes', [AmbienteController::class, 'index']);
Route::get('/ambientes/{id}', [AmbienteController::class, 'show']);
///Registro de ambiente
Route::post('/registroAmbiente',[AmbienteController::class,'store']);
>>>>>>> 0cc8690 ([ADD] ReservaAmbiente Controller)
