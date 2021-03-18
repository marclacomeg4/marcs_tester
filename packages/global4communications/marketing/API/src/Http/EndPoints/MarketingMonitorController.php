<?php


namespace Global4Communications\Marketing\API\Http\EndPoints;

use App\Http\Controllers\Controller;
use Global4Communications\Marketing\API\Http\Repositories\MarketingMonitorRepository;
use  Illuminate\Http\Request;


class MarketingMonitorController extends Controller
{
    private $repository;

    public function __construct()
    {
        $this->repository = new MarketingMonitorRepository();
    }

    public function addMonitor(Array $params, String $to, String $status)
    {
        $this->repository->addMonitory($params, $to, $status);
    }

    public function purgeMonitor(Request $request)
    {
        $this->repository->purgeMonitor($request->input('days'));
        return response()->json(['status'=>'ok']);
    }

    public function getMonitor(Request $request)
    {
        $data = $this->repository->getMonitor($request->input('from'), $request->input('to'));
        return $data;
    }
}

