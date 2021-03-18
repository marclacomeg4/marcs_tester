<?php


namespace Global4Communications\Marcs\Core\Providers;

use Illuminate\Support\ServiceProvider;

class MarcsServiceProvider extends ServiceProvider
{
    public function boot()
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
            ]);
        }
    }

    public function register()
    {

    }

}
