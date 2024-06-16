<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    
        User::create([
            'name' => 'Leticia Blanco',
            'email' => 'rodrigo33newton@gmail.com',
            'password' =>'123'
        ]);

        User::create([
            'name' => 'Tatiana Aparicio',
            'email' => '202000717@est.umss.edu',
            'password' => '123'
        ]);

        User::create([
            'name' => 'Boris Calancha',
            'email' => '202000671@est.umss.edu',
            'password' =>'123'
        ]);

        User::create([
            'name' => 'Indira Camacho',
            'email' => '201400072@est.umss.edu',
            'password' => '123'
        ]);

        User::create([
            'name' => 'Marcelo Flores',
            'email' => '202000321@est.umss.edu',
            'password' =>'123'
        ]);

        User::create([
            'name' => 'Administrador 1',
            'email' => 'gestoradeambientesumss1@gmail.com',
            'password' =>'123'
        ]);

    }
}
