<?php namespace Global4Communications\TelesalesPortal\SPA\Providers;

use Illuminate\Support\ServiceProvider;

class TelesalesSPAServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadViewsFrom(__DIR__ . '/../Resources/Views', 'SPA');
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {

    }
}
