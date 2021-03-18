<?php namespace Global4Communications\Marketing\SPA\Providers;

use Global4Communications\StatisticsPortal\SPA\Console\Commands\CountLeadCDRs;
use Illuminate\Support\ServiceProvider;

class MarketingSPAServiceProvider extends ServiceProvider
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
