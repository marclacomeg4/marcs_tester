<?php


namespace Global4Communications\Marcs\API\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class MarcsAPIServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'Global4Communications\Marcs\API\Http\EndPoints';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
        $this->loadViewsFrom(__DIR__ . '/../../../SPA/src/Resources/Views', 'marcs_tester');
    }

    public function register()
    {
        parent::register();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapApiRoutes();
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('marcs-api')
            ->middleware(['api'])
            ->namespace($this->namespace)
            ->group(base_path('packages/global4communications/marcs/API/src/Http/Routes/endpoints.php'));

    }
}
