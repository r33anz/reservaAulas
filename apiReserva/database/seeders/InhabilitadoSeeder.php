<?php

namespace Database\Seeders;

use App\Models\Inhabilitado;
use Illuminate\Database\Seeder;

class InhabilitadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {  // yy mm dd
        Inhabilitado::create([
            'id_ambiente' => 1,
            'id_periodo' => 1,
            'fecha' => '2024-04-1',
        ]);

        Inhabilitado::create([
            'id_ambiente' => 1,
            'id_periodo' => 2,
            'fecha' => '2024-04-1',
        ]);

        Inhabilitado::create([
            'id_ambiente' => 1,
            'id_periodo' => 7,
            'fecha' => '2024-04-1',
        ]);

        Inhabilitado::create([
            'id_ambiente' => 1,
            'id_periodo' => 1,
            'fecha' => '2024-04-3',
        ]);

        Inhabilitado::create([
            'id_ambiente' => 1,
            'id_periodo' => 1,
            'fecha' => '2024-04-3',
        ]);

        Inhabilitado::create([
            'id_ambiente' => 1,
            'id_periodo' => 5,
            'fecha' => '2024-04-4',
        ]);
    }
}
