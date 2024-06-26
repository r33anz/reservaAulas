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
            $table->unsignedInteger('user_id');
            $table->string('materia');
            $table->string('grupo',100);
            $table->integer('cantidad');
            $table->string('razon');
            $table->date('fechaReserva');
            $table->date('fechaAtendida')->nullable();
            $table->unsignedBigInteger('periodo_ini_id');
            $table->unsignedBigInteger('periodo_fin_id');
            $table->string('estado');  
            $table->string('razonRechazo')->nullable();
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
