<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\DocenteSeeder;
use Database\Seeders\MateriaSeeder;
use Database\Seeders\InhabilitadoSeeder;
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
            DocenteSeeder::class,
            MateriaSeeder::class,
            AmbienteSeeder::class,
            BloqueSeeder::class,
            PisoSeeder::class,
            PeriodoSeeder::class,
            InhabilitadoSeeder::class,
            SolicitudSeeder::class,
            UserSeeder::class
           
        ]);
    }
}
