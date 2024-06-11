<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Notifications\Individual;
class NotificacionGeneralJ implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $mensaje;
    public function __construct($mensaje)
    {
        $this->mensaje = $mensaje;
    }

    
    public function handle()
    {
        $users = User::where('id', '!=', 0)->get();

        foreach ($users as $user) {
            $user->notify(new Individual($this->mensaje));
        }
    }
}
