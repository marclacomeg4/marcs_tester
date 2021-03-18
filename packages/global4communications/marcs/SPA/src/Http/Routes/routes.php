<?php


Auth::routes();


Route::middleware('auth')->group(function () {
    Route::get('/', 'AppController@index');
    Route::get('/{any}', 'AppController@index')->where('any', '.*');
});



