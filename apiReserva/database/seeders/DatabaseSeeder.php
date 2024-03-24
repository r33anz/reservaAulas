<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
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
        ]);
    }
}
