<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Docente;
class DocenteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Docente::create([
            'id' =>1, 
            'nombre'=> 'LETICIA BLANCO',
            'user_id'=>1
        ]);
        Docente::create([
            'id' =>2, 
            'nombre'=> 'TATIANA APARICIO',
            'user_id'=>2
        ]);
        Docente::create([
            'id' =>3, 
            'nombre'=> 'BORIS CALANCHA',
            'user_id'=>3
        ]);
        Docente::create([
            'id' =>4, 
            'nombre'=> 'INDIRA CAMACHO',
            'user_id'=>4
        ]);
        Docente::create([
            'id' =>5, 
            'nombre'=> 'MARCELO FLORES',
            'user_id'=>5
        ]);
        
    }
}
