<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAmbientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ambientes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('piso_id');
            $table->string('nombre');
            $table->integer('capacidad');
            $table->string('tipo');
            $table->text('descripcion')->nullable();
            $table->timestamps();

            // Definición de la clave foránea
            $table->foreign('piso_id')->references('id')->on('pisos')->onDelete('cascade');
            $table->index('capacidad');
            $table->index('piso_id');
        });     
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ambientes');
    }
}
