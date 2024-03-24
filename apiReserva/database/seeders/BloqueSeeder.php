<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bloque;
class BloqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Crear Bloque Central
        Bloque::create([
            "id"=> 1,
            'nombreBloque' => 'Bloque central'
        ]);

        // Crear Bloque Académico
        Bloque::create([
            "id"=> 2,
            'nombreBloque' => 'Bloque académico'
        ]);
    }
}
