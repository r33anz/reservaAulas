<?php

namespace Database\Seeders;

use App\Models\Bloque;
use Illuminate\Database\Seeder;

class BloqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Bloque::create([
            'id' => 1,
            'nombreBloque' => 'Bloque central',
        ]);

        Bloque::create([
            'id' => 2,
            'nombreBloque' => 'Bloque académico',
        ]);
        Bloque::create([
            'id' => 3,
            'nombreBloque' => 'Edificio Nuevo',
        ]);
        Bloque::create([
            'id' => 4,
            'nombreBloque' => 'MEMI',
        ]);
        Bloque::create([
            'id' => 5,
            'nombreBloque' => 'Bloque Informatica',
        ]);

        Bloque::create([
            'id' => 6,
            'nombreBloque' => 'Bloque Quimica',
        ]);
    }
}
