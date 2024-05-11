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
            'estado'=>'esperando'
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id'=>31,
            'solicitud_id'=>1
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
            'estado'=>'esperando'
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id'=>31,
            'solicitud_id'=>2
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
            'estado'=>'esperando'
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id'=>34,
            'solicitud_id'=>3
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
            'fechaAtendida'=>'2024-05-11',
            'estado'=>'aprobado',
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id'=>21,
            'solicitud_id'=>4
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
            'estado'=>'esperando'
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id'=>1,
            'solicitud_id'=>5
        ]);
        

        //aceptadas
        Solicitud::create([
            'docente_id' => 4,
            'materia' => 'XYZ',
            'cantidad' => 10,
            'grupo' => 1,
            'razon' => 'xyz',
            'fechaReserva' => '2024-05-06',
            'periodo_ini_id'=>3,
            'periodo_fin_id'=>6,
            'fechaAtendida'=>'2024-05-11',
            'estado' => 'aprobado' 
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id' => 7,
            'solicitud_id' => 6
        ]);

        Solicitud::create([
            'docente_id' => 2,
            'materia' => 'XYZ',
            'cantidad' => 10,
            'grupo' => 1,
            'razon' => 'xyz',
            'fechaReserva' => '2024-05-11',
            'periodo_ini_id'=>3,
            'periodo_fin_id'=>3,
            'fechaAtendida'=>'2024-05-12',
            'estado' => 'aprobado' 
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id' => 8,
            'solicitud_id' => 7
        ]);

        Solicitud::create([
            'docente_id' => 4,
            'materia' => 'XYZ',
            'cantidad' => 10,
            'grupo' => 1,
            'razon' => 'xyz',
            'fechaReserva' => '2024-05-20',
            'periodo_ini_id'=>7,
            'periodo_fin_id'=>8,
            'fechaAtendida'=>'2024-05-13',
            'estado' => 'aprobado' 
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id' => 21,
            'solicitud_id' => 8
        ]);

        //rechazadas

        Solicitud::create([
            'docente_id' => 2,
            'materia' => 'XYZ',
            'cantidad' => 10,
            'grupo' => 1,
            'razon' => 'xyz',
            'fechaReserva' => '2024-05-10',
            'periodo_ini_id'=>3,
            'periodo_fin_id'=>4,
            'fechaAtendida'=>'2024-05-11',
            'estado' => 'rechazado', 
            'razonRechazo'=>'abc'
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id' => 16,
            'solicitud_id' => 9
        ]);

        Solicitud::create([
            'docente_id' => 2,
            'materia' => 'XYZ',
            'cantidad' => 10,
            'grupo' => 1,
            'razon' => 'xyz',
            'fechaReserva' => '2024-06-01',
            'periodo_ini_id'=>1,
            'periodo_fin_id'=>1,
            'fechaAtendida'=>'2024-05-11',
            'estado' => 'rechazado', 
            'razonRechazo'=>'abc' 
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id' => 2,
            'solicitud_id' => 10
        ]);

        Solicitud::create([
            'docente_id' => 4,
            'materia' => 'XYZ',
            'cantidad' => 10,
            'grupo' => 1,
            'razon' => 'xyz',
            'fechaReserva' => '2024-05-06',
            'periodo_ini_id'=>3,
            'periodo_fin_id'=>4,
            'fechaAtendida'=>'2024-05-11',
            'estado' => 'rechazado' , 
            'razonRechazo'=>'abc'
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id' => 12,
            'solicitud_id' => 11
        ]);

        Solicitud::create([
            'docente_id' => 3,
            'materia' => 'XYZ',
            'cantidad' => 10,
            'grupo' => 1,
            'razon' => 'xyz',
            'fechaReserva' => '2024-05-07',
            'periodo_ini_id'=>3,
            'periodo_fin_id'=>4,
            'fechaAtendida'=>'2024-05-11',
            'estado' => 'rechazado', 
            'razonRechazo'=>'abc' 
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id' => 11,
            'solicitud_id' => 12
        ]);

        //espera
        Solicitud::create([
            'docente_id'=>3,
            'materia'=>'XYZ',
            'grupo'=>1,
            'cantidad'=>14,
            'razon'=>'XYZ',
            'fechaReserva'=>'2024-05-25',
            'periodo_ini_id'=>3, 
            'periodo_fin_id'=>3,
            'estado'=>'esperando'
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id' => 9,
            'solicitud_id' => 13
        ]);

        Solicitud::create([
            'docente_id'=>4,
            'materia'=>'XYZ',
            'grupo'=>1,
            'cantidad'=>14,
            'razon'=>'XYZ',
            'fechaReserva'=>'2024-05-15',
            'periodo_ini_id'=>4, 
            'periodo_fin_id'=>7,
            'estado'=>'esperando'
            
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id' => 1,
            'solicitud_id' => 14
        ]);

        Solicitud::create([
            'docente_id'=>5,
            'materia'=>'XYZ',
            'grupo'=>1,
            'cantidad'=>14,
            'razon'=>'XYZ',
            'fechaReserva'=>'2024-04-29',
            'periodo_ini_id'=>8, 
            'periodo_fin_id'=>8,
            'estado'=>'esperando'
            
        ]);

        DB::table('ambiente_solicitud')->insert([
            'ambiente_id' => 17,
            'solicitud_id' => 15
        ]);
    }
}
