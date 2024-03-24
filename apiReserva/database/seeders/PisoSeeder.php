<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Piso;
class PisoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 1; $i <= 2; $i++) {
            Piso::create([
                'id' => $i,
                'bloque_id' => 1,
                'nroPiso' => $i
            ]);
        }
    }
}
