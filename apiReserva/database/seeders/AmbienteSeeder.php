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
        Ambiente::create([
            "id"=> 1,
            'piso_id' => 1,
            'nombre' => '621',
            'capacidad' => 40,
            'tipo' => 'Aula',
            'descripcion' => 'Descripción del ambiente 1'
        ]);

        
        Ambiente::create([
            "id"=> 2,
            'piso_id' => 1,
            'nombre' => '622',
            'capacidad' => 50,
            'tipo' => 'Aula',
            'descripcion' => 'Descripción del ambiente 2'
        ]);
    }
}
