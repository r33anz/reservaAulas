<?php

namespace Database\Seeders;

use App\Models\Piso;
use Illuminate\Database\Seeder;

class PisoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 0; $i <= 2; ++$i) {
            Piso::create([
                'bloque_id' => 1,
                'nroPiso' => $i,
            ]);
        }

        for ($i = 0; $i <= 3; ++$i) {
            Piso::create([
                'bloque_id' => 2,
                'nroPiso' => $i,
            ]);
        }

        for ($i = 0; $i <= 5; ++$i) {
            Piso::create([
                'bloque_id' => 3,
                'nroPiso' => $i,
            ]);
        }

        for ($i = 0; $i <= 3; ++$i) {
            Piso::create([
                'bloque_id' => 4,
                'nroPiso' => $i,
            ]);
        }

        for ($i = 0; $i <= 2; ++$i) {
            Piso::create([
                'bloque_id' => 5,
                'nroPiso' => $i,
            ]);
        }

        for ($i = 0; $i <= 1; ++$i) {
            Piso::create([
                'bloque_id' => 6,
                'nroPiso' => $i,
            ]);
        }
    }
}
