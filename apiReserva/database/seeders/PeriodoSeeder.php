<?php

namespace Database\Seeders;

use App\Models\Periodo;
use Illuminate\Database\Seeder;

class PeriodoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $horaInicial = '06:45:00';
        $horaFinal = '08:15:00';

        for ($i = 1; $i <= 10; $i++) { 
            Periodo::create([
                'horainicial' => $horaInicial,
                'horafinal' => $horaFinal,
            ]);

            
            $horaInicial = $horaFinal;
            $horaFinal = date('H:i:s', strtotime($horaInicial . ' + 1 hour 30 minutes'));
        }
    }
}
