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
            'name' => 'xxxxx',
            'email' => 'rodrigo33newton@gmail.com',
            'password' =>'123'
        ]);

        User::create([
            'name' => 'yyyyyyy',
            'email' => '202000717@est.umss.edu',
            'password' => '123'
        ]);

        User::create([
            'name' => 'zzzzzzz',
            'email' => '202000671@est.umss.edu',
            'password' =>'123'
        ]);

        User::create([
            'name' => 'aaaaaaa',
            'email' => '201400072@est.umss.edu',
            'password' => '123'
        ]);

        User::create([
            'name' => 'bbbbb',
            'email' => '202000321@est.umss.edu',
            'password' =>'123'
        ]);

    }
}
