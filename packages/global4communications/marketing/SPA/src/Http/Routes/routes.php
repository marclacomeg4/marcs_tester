<?php

Auth::routes();

Route::get('/marketing-api-public/email-in-browser/uid/{uid}', 'PublicAPIController@emailInBrowser');
Route::get('/marketing-api-public/unsubscribe/uid/{uid}/brand/{brand}', 'PublicAPIController@unsubscribe');
Route::get('/sms-reply/sales',  'PublicAPIController@smsReply');


Route::middleware('auth')->group(function() {
    Route::get('/', 'AppController@index');
    Route::get('/{any}', 'AppController@index')->where('any', '.*');
});



