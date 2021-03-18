<?php

namespace Global4Communications\Marketing\Tests\Lib;

use PHPUnit\Framework\TestCase;


class SafeTestCase extends TestCase
{
    protected function setUp(): void
    {

        parent::setUp();
        echo "env = " . env('APP_ENV') . "= env";exit;
        if( ! strpos(env('APP_ENV'), 'localhost'))
        {
            die('can only run locally');
        }
    }
}
