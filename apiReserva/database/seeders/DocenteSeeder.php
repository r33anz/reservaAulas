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
            'nombre'=> 'LETICIA BLANCO'
        ]);
        Docente::create([
            'id' =>2, 
            'nombre'=> 'TATIANA APARICIO'
        ]);
        Docente::create([
            'id' =>3, 
            'nombre'=> 'BORIS CALANCHA'
        ]);
        Docente::create([
            'id' =>4, 
            'nombre'=> 'INDIRA CAMACHO'
        ]);
        Docente::create([
            'id' =>5, 
            'nombre'=> 'MARCELO FLORES'
        ]);
        
    }
}
