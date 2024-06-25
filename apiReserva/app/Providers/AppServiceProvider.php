<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\ValidadorService;
use App\Services\NotificadorService;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(ValidadorService::class, function ($app) {
            return new ValidadorService();
        });

        $this->app->singleton(NotificadorService::class, function ($app) {
            return new NotificadorService();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
