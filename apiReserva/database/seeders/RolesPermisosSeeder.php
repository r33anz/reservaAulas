<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
class RolesPermisosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roleAdmin = Role::create(['name' => 'admin']);
        $roleDocente = Role::create(['name' => 'docente']);

        $user = User::find(1);
        $user->assignRole('docente');
        $user = User::find(2);
        $user->assignRole('docente');
        $user = User::find(3);
        $user->assignRole('docente');
        $user = User::find(4);
        $user->assignRole('docente');
        $user = User::find(5);
        $user->assignRole('docente');
        $user = User::find(6);
        $user->assignRole('admin');
    }
}
