<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Global4Communications\CRMModels\Models\Leads\ResidentialLead;
use Faker\Generator as Faker;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(\Global4Communications\CRMModels\Models\Leads\ResidentialLead::class, function (Faker $faker) {
    return [
        'title' => $faker->title,
        'first_name'=>$faker->firstName,
        'last_name'=>$faker->lastName,
        'email' => $faker->unique()->safeEmail,
    ];
});
