<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\MateriaSeeder;
use Database\Seeders\SolicitudSeeder;
use Database\Seeders\UserSeeder;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void     */
    public function run()
    {
        $this->call([
            UserSeeder::class,
            MateriaSeeder::class,
            BloqueSeeder::class,
            PisoSeeder::class,
            AmbienteSeeder::class,
            PeriodoSeeder::class,
            SolicitudSeeder::class
        ]);
    }
}
