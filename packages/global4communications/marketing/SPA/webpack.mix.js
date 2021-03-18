require('dotenv').config();
let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

if (process.env.NODE_ENV === 'hot') {
    mix.options({
        hmrOptions: {
            host: 'dev.marcs_tester.g4.co.uk',  // site's host name
            port: 8000,
        }
    });
}

if (process.env.NODE_ENV === 'production') {
    mix.webpackConfig({
        output: {
            chunkFilename: 'SPA/chunks/[name].js?t=' + new Date().getTime(),
        }
    });
}

mix.setResourceRoot('/SPA/');

mix.setPublicPath('public');


mix.js('packages/global4communications/marcs/SPA/src/Resources/Assets/js/app.js', 'js')
    .version();
