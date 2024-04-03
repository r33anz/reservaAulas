<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CreateDatabase extends Command
{
    protected $signature = 'db:create {reserva}';

    protected $description = 'Create a new database';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $databaseName = $this->argument('reserva');

        $charset = config('database.connections.mysql.charset', 'utf8mb4');
        $collation = config('database.connections.mysql.collation', 'utf8mb4_unicode_ci');

        $query = "CREATE DATABASE IF NOT EXISTS $databaseName CHARACTER SET $charset COLLATE $collation;";
        
        try {
            DB::statement($query);
            $this->info("Database '$databaseName' created successfully!");
        } catch (\Exception $e) {
            $this->error("Error creating database: " . $e->getMessage());
        }
    }
}
