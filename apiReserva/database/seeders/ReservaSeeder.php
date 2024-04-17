<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReservaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('reservas')->insert([
            'id'=>1,
            'idSolicitud'=>4
        ]);

        DB::table('reservas')->insert([
            'id'=>2,
            'idSolicitud'=>5
        ]);
    }
}
