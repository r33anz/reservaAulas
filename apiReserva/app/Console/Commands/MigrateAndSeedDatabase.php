<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MigrateAndSeedDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
   
    protected $signature = 'db:migrate-seed';
    protected $description = 'Migrate and seed the database';
    
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
        $this->call('migrate');
        $this->call('db:seed');
    }
}
