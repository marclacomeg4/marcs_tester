<?php

namespace Global4Communications\Marketing\Core\Providers;

use Global4Communications\Marketing\Core\Console\Commands\EmailTransmitConsole;
use Global4Communications\Marketing\Core\Console\Commands\CronEmailConsole;
use Global4Communications\Marketing\Core\Console\Commands\CronSMSConsole;
use Global4Communications\Marketing\Core\Console\Commands\CronEmailAndSMSConsole;
use Illuminate\Support\ServiceProvider;

class MarketingServiceProvider extends ServiceProvider
{
    public function boot()
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                EmailTransmitConsole::class,
                CronSMSConsole::class,
                CronEmailConsole::class,
                CronEmailAndSMSConsole::class
            ]);
        }
    }

    public function register()
    {

    }

}
