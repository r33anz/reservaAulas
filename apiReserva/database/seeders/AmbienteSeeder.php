<?php

namespace Database\Seeders;

use App\Models\Ambiente;
use Illuminate\Database\Seeder;

class AmbienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {   

        //bloque central
        Ambiente::create([
            'piso_id' => 1 ,
            'nombre' =>"652" ,
            'capacidad'=>10,
            'tipo'=>"Aula" ,
            
        ]);
        
        Ambiente::create([
            'piso_id' => 2 ,
            'nombre' =>"655" ,
            'capacidad'=>20,
            'tipo'=>"Aula" ,
            
        ]);
        Ambiente::create([
            'piso_id' => 3,
            'nombre' => "652A",
            'capacidad'=>30,
            'tipo'=> "Aula",
            
        ]);
        //bloque academico

        Ambiente::create([
            'piso_id' => 4,
            'nombre' => "622",
            'capacidad'=>30,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 5,
            'nombre' => "623",
            'capacidad'=>30,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 5,
            'nombre' => "624",
            'capacidad'=>20,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 6,
            'nombre' => "625",
            'capacidad'=>10,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' =>6 ,
            'nombre' => "626",
            'capacidad'=>30,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 7,
            'nombre' => "AUDITORIO ACADEMICO",
            'capacidad'=>50,
            'tipo'=> "Auditorio",
            
        ]);
        //Edificio nuevo
        //PLANTA BAJA
        Ambiente::create([
            'piso_id' => 8,
            'nombre' => "690A",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 8,
            'nombre' => "690B",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 8,
            'nombre' => "690C",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 8,
            'nombre' => "690D",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        //1
        Ambiente::create([
            'piso_id' => 9,
            'nombre' => "691A",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 9,
            'nombre' => "691B",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 9,
            'nombre' => "691C",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 9,
            'nombre' => "691D",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        //2
        Ambiente::create([
            'piso_id' => 10,
            'nombre' => "692A",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 10,
            'nombre' => "692B",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 10,
            'nombre' => "692C",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 10,
            'nombre' => "692D",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        //3
        Ambiente::create([
            'piso_id' => 11,
            'nombre' => "693A",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 11,
            'nombre' => "693B",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 11,
            'nombre' => "693C",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 11,
            'nombre' => "693D",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        //4
        Ambiente::create([
            'piso_id' => 12,
            'nombre' => "694A",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 12,
            'nombre' => "694B",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 12,
            'nombre' => "694C",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 12,
            'nombre' => "694D",
            'capacidad'=>50,
            'tipo'=> "Aula",
            
        ]);
        //5
        Ambiente::create([
            'piso_id' => 13,
            'nombre' => "694A",
            'capacidad'=>70,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 13,
            'nombre' => "AUDITORIO EDIFICIO NUEVO",
            'capacidad'=>150,
            'tipo'=> "Auditorio",
            
        ]);
        //MEMI
        Ambiente::create([
            'piso_id' => 14,
            'nombre' => "LABORATORIO COMPUTADORAS 1",
            'capacidad'=>50,
            'tipo'=> "Laboratorio",
            
        ]);
        Ambiente::create([
            'piso_id' => 14,
            'nombre' => "AULA MEMI",
            'capacidad'=>10,
            'tipo'=> "Aula",
            
        ]);
        Ambiente::create([
            'piso_id' => 15,
            'nombre' => "LABORATORIO COMPUTADORAS 2",
            'capacidad'=>30,
            'tipo'=> "Laboratorio",
            
        ]);
        Ambiente::create([
            'piso_id' => 16,
            'nombre' => "LABORATORIO COMPUTADORAS 3",
            'capacidad'=>20,
            'tipo'=> "Laboratorio",
            
        ]);
    
        Ambiente::create([
            'piso_id' => 17,
            'nombre' => "LABORATORIO INFORMATICA 4",
            'capacidad'=>50,
            'tipo'=> "Laboratorio",
            
        ]);
        //bloque informatica
        Ambiente::create([
            'piso_id' => 18,
            'nombre' => "LABORATORIO REDES",
            'capacidad'=>15,
            'tipo'=> "Laboratorio",
            
        ]);
        Ambiente::create([
            'piso_id' => 19,
            'nombre' => "LABORATORIO INFORMATICA",
            'capacidad'=>50,
            'tipo'=> "Laboratorio",
            
        ]);
        Ambiente::create([
            'piso_id' => 20,
            'nombre' => "AUDITORIO INFORMATICA",
            'capacidad'=>20,
            'tipo'=> "Auditorio",
            
        ]);
        //bloque quimica
        Ambiente::create([
            'piso_id' => 21,
            'nombre' => "LABORATORIO QUIMICA 1",
            'capacidad'=>20,
            'tipo'=> "Laboratorio",
            
        ]);
        Ambiente::create([
            'piso_id' => 22,
            'nombre' => "LABORATORIO QUIMICA 2",
            'capacidad'=>20,
            'tipo'=> "Laboratorio",
            
        ]);
        Ambiente::create([
            'piso_id' => 22,
            'nombre' => "AUDITORIO QUIMICA",
            'capacidad'=>40,
            'tipo'=> "Auditorio",
            
        ]);
    }
}
