<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Solicitud;
use Illuminate\Support\Facades\DB;
class SolicitudSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Solicitud::create([
            'docente_id'=>1,
            'materia'=>'Introduccion a la programacion',
            'grupo'=>1,
            'cantidad'=>148,
            'razon'=>'Examen segundo parcial',
            'fechaReserva'=>'2024-04-25',
            'periodo_ini_id'=>3, //AUDITORIO EDIFICIO NUEVO
            'periodo_fin_id'=>4,
            'estado'=>false,
        ]);

        Solicitud::create([
            'docente_id'=>1,
            'materia'=>'Introduccion a la programacion',
            'cantidad'=>120,
            'grupo'=>2,
            'razon'=>'Examen segundo parcial', //AUDITORIO EDIFICIO NUEVO
            'fechaReserva'=>'2024-04-25',
            'periodo_ini_id'=>5,
            'periodo_fin_id'=>8,
            'estado'=>false,
        ]);

        Solicitud::create([
            'docente_id'=>1,
            'materia'=>'Algoritmos Avanzados', 
            'cantidad'=>20,
            'grupo'=>1,
            'razon'=>'Examen Primer parcial', //LABORATORIO COMPUTADORAS 2
            'fechaReserva'=>'2024-04-26',
            'periodo_ini_id'=>1,
            'periodo_fin_id'=>2,
            'estado'=>false,
        ]);

        Solicitud::create([
            'docente_id'=>2,
            'materia'=>'Base de datos I',
            'cantidad'=>45,
            'grupo'=>3,
            'razon'=>'Examen',   //692D 
            'fechaReserva'=>'2024-04-23',
            'periodo_ini_id'=>3,
            'periodo_fin_id'=>4,
            'estado'=>true,
        ]);

        Solicitud::create([
            'docente_id'=>2,
            'materia'=>'Base de datos I',
            'cantidad'=>33,
            'grupo'=>5,
            'razon'=>'Examen',
            'fechaReserva'=>'2024-04-23',  //655 
            'periodo_ini_id'=>4,
            'periodo_fin_id'=>5,
            'estado'=>true,
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id'=>31,
            'solicitud_id'=>1
        ]);
        DB::table('ambiente_solicitud')->insert([
            'ambiente_id'=>31,
            'solicitud_id'=>2
        ]);
        DB::table('ambiente_solicitud')->insert([
            'ambiente_id'=>34,
            'solicitud_id'=>3
        ]);
        DB::table('ambiente_solicitud')->insert([
            'ambiente_id'=>21,
            'solicitud_id'=>4
        ]);
        DB::table('ambiente_solicitud')->insert([
            'ambiente_id'=>1,
            'solicitud_id'=>5
        ]);
        
    }
}
