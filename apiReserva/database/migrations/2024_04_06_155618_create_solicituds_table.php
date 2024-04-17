<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSolicitudsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('solicituds', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('docente_id');
            $table->string('materia');
            $table->integer('grupo');
            $table->integer('cantidad');
            $table->string('razon');
            $table->date('fechaReserva');
            $table->unsignedBigInteger('periodo_ini_id');
            $table->unsignedBigInteger('periodo_fin_id');
            $table->boolean('estado');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('solicituds');
    }
}
