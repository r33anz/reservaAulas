<?php

use App\Http\Controllers\AmbienteController;
use App\Http\Controllers\BloqueController;
use App\Http\Resources\BloqueResource;
use App\Http\Resources\PisoResource;
use App\Models\Piso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Bloque;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

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
