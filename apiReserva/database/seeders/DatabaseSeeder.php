<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\DocenteSeeder;
use Database\Seeders\MateriaSeeder;
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
            MateriaSeeder::class
        ]);
    }
}
