<?php

namespace Global4Communications\Marketing\SPA\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AppController extends Controller
{
    public function index()
    {
        return view('SPA::index');
    }
}
