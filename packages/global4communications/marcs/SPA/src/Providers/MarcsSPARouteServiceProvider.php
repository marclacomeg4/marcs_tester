<?php


namespace Global4Communications\Marcs\SPA\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class MarcsSPARouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'Global4Communications\Marcs\SPA\Http\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapWebRoutes();
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        /*
        Route::prefix('marketing-api-public')
            ->middleware(['web'])
            ->namespace($this->namespace)
            ->group(base_path('packages/global4communications/marketing/SPA/src/Http/Routes/routes.php'));
        */

        Route::middleware(['web'])
            ->namespace($this->namespace)
            ->group(base_path('packages/global4communications/marcs/SPA/src/Http/Routes/routes.php'));
    }
}
