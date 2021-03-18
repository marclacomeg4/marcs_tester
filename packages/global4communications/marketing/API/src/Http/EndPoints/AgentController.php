<?php


namespace Global4Communications\Marketing\API\Http\EndPoints;

use App\Http\Controllers\Controller;
use  Illuminate\Http\Request;


class AgentController extends Controller
{
    public function upload(Request $request)
    {
       $path = $request->image->storeAs('public/new_logos/', $request->filename);
       echo $path;
    }
}

