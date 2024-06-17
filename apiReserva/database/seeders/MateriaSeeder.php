<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Materia;
use Illuminate\Support\Facades\DB;
class MateriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Materia::create([
            'id' =>1,
            'nombreMateria'=>'Introduccion a la programacion'
        ]);
        Materia::create([
            'id' =>2,
            'nombreMateria'=>'Elementos de programacion'
        ]);
        Materia::create([
            'id' =>3,
            'nombreMateria'=>'Algoritmos Avanzados'
        ]);
        Materia::create([
            'id' =>4,
            'nombreMateria'=>'Base de datos I'
        ]);
        Materia::create([
            'id' =>5,
            'nombreMateria'=>'Programacion Funcional'
        ]);
        Materia::create([
            'id' =>6,
            'nombreMateria'=>'Base de datos I'
        ]);
        Materia::create([
            'id' =>7,
            'nombreMateria'=>'Graficacion de Computadoras'
        ]);
        Materia::create([
            'id' =>8,
            'nombreMateria'=>'Ingieneria de Software'
        ]);
        Materia::create([
            'id' =>9,
            'nombreMateria'=>'Taller de base de datos'
        ]);
        
        DB::table('docente_materia')->insert([
            'user_id' =>1,
            'materia_id' =>1,
            'grupo'=>1
        ]);
        DB::table('docente_materia')->insert([
            'user_id' =>1,
            'materia_id' =>1,
            'grupo'=>2        ]);
        DB::table('docente_materia')->insert([
            'user_id' =>1,
            'materia_id' =>1,
            'grupo'=>4       ]);
        DB::table('docente_materia')->insert([
            'user_id' =>1,
            'materia_id' =>2,
            'grupo'=>1
        ]);
        DB::table('docente_materia')->insert([
            'user_id' =>1,
            'materia_id' =>3,
            'grupo'=>1
        ]);
        DB::table('docente_materia')->insert([
            'user_id' =>1,
            'materia_id' =>3,
            'grupo'=>2
        ]);
        DB::table('docente_materia')->insert([
            'user_id' =>2,
            'materia_id' =>4,
            'grupo'=>3
        ]);
        DB::table('docente_materia')->insert([
            'user_id' =>2,
            'materia_id' =>5,
            'grupo'=>4
        ]);
        DB::table('docente_materia')->insert([
            'user_id' =>2,
            'materia_id' =>4,
            'grupo'=>7
        ]);
        DB::table('docente_materia')->insert([
            'user_id' =>3,
            'materia_id' =>4,
            'grupo'=>5
        ]);
        DB::table('docente_materia')->insert([
            'user_id' =>3,
            'materia_id' =>5,
            'grupo'=>6
        ]);
        DB::table('docente_materia')->insert([
            'user_id' =>4,
            'materia_id' =>8,
            'grupo'=>9
        ]);
        DB::table('docente_materia')->insert([
            'user_id' =>5,
            'materia_id' =>9,
            'grupo'=>1
        ]);

        DB::table('docente_materia')->insert([
            'user_id' =>3,
            'materia_id' =>9,
            'grupo'=>2
        ]);

       



    }
}
