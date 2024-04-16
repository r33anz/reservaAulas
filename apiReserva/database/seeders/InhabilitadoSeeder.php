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
    {  //yy mm dd
        Inhabilitado::create([
            'ambiente_id'=>1,
            'periodo_id'=>1,
            'fecha'=> "2024-04-1" 
        ]);

        Inhabilitado::create([
            'ambiente_id'=>1,
            'periodo_id'=>2,
            'fecha'=> "2024-04-1" 
        ]);

        Inhabilitado::create([
            'ambiente_id'=>1,
            'periodo_id'=>7,
            'fecha'=> "2024-04-1" 
        ]);

        Inhabilitado::create([
            'ambiente_id'=>1,
            'periodo_id'=>1,
            'fecha'=> "2024-04-3" 
        ]);

        Inhabilitado::create([
            'ambiente_id'=>1,
            'periodo_id'=>1,
            'fecha'=> "2024-04-3" 
        ]);

        Inhabilitado::create([
            'ambiente_id'=>1,
            'periodo_id'=>5,
            'fecha'=> "2024-04-4" 
        ]);
    }
}