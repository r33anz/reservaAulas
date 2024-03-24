<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocenteController;




Route::get('/docentes/{id}/materias', [DocenteController::class, 'getMaterias']);