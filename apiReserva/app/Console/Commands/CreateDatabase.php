<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
class CreateDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:create {reserva} ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new database';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $reserva = $this->argument('reserva');

        // Crear la base de datos en el servidor
        DB::statement("CREATE DATABASE $reserva");
    
        // Actualizar el archivo .env con el nombre de la nueva base de datos
        $envFilePath = base_path('.env');
        file_put_contents($envFilePath, str_replace(
            'DB_DATABASE=reserva',
            'DB_DATABASE=' . $reserva,
            file_get_contents($envFilePath)
        ));
    
        $this->info("Database $reserva created successfully.");
    }
}
