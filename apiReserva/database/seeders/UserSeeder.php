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
            'id' => 0,
            'name' => 'Administrador',
            'email' => 'gestoradeambientesumss@gmail.com',
            'password' =>'123'
        ]);

        User::create([
            'id' => 1,
            'name' => 'LETICIA BLANCO',
            'email' => 'rodrigo33newton@gmail.com',
            'password' =>'123'
        ]);

        User::create([
            'id' => 2,
            'name' => 'TATIANA APARICIO',
            'email' => '202000717@est.umss.edu',
            'password' => '123'
        ]);

        User::create([
            'id' => 3,
            'name' => 'BORIS CALANCHA',
            'email' => '202000671@est.umss.edu',
            'password' =>'123'
        ]);

        User::create([
            'id' => 4,
            'name' => 'INDIRA CAMACHO',
            'email' => '201400072@est.umss.edu',
            'password' => '123'
        ]);

        User::create([
            'id' => 5,
            'name' => 'MARCELO FLORES',
            'email' => '202000321@est.umss.edu',
            'password' =>'123'
        ]);

    }
}
