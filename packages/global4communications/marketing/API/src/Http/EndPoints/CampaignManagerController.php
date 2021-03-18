<?php

namespace Global4Communications\Marketing\API\Http\EndPoints;

use App\Http\Controllers\Controller;
use Global4Communications\Marketing\API\MailServerAPI\MandrillAPIHandler;
use Global4Communications\Marketing\API\Http\Repositories\CampaignManagerRepository;
use Global4Communications\BrandManagers\Managers\BrandManager;
use  Illuminate\Http\Request;


class CampaignManagerController extends Controller
{
    protected $api_handler;
    protected $repository;
    protected $brand_manager;

    public function __construct()
    {
        $this->api_handler = new MandrillAPIHandler();

        $this->repository = new CampaignManagerRepository();
        $this->brand_manager = new BrandManager();
    }

    public function getAPIInitialisation()
    {
        $active_brands = ['G4', 'HT', 'PB', 'FL'];

        $result = [];
        foreach($active_brands as $brand)
        {
            array_push($result, ['name'=>$this->brand_manager->getName($brand), 'brand'=>$brand]);
        }
        $live_mode =['live_mode'=>config('mandrill.LIVE_MODE'),
            'test_email'=>config('mandrill.TEST_EMAIL'),
            'test_sms'=>config('mandrill.TEST_SMS')
            ];

        return response()->json(['brands'=>$result, 'contract_types'=>config('contract_types'), 'live_mode'=>$live_mode]);
    }

    public function listTemplates()
    {
        $templates = $this->api_handler->getTemplates();

        return response()->json(['templates'=>$templates]);
    }

    public function getTemplateInfo(Request $request)
    {
        return response()->json(['template_info'=>$this->api_handler->getTemplateInfo($request->input('name'))]);
    }

    public function createCampaign(Request $request)
    {
        $request->validate([
            'campaign_name'=>'required|unique:marketing_campaigns,meta->campaign_name',
        ]);

        $uid = $this->repository->createCampaign($request->input('campaign_name'));

        return response()->json(['campaign_uid'=>$uid, 'campaign_name'=>$request->input('campaign_name')]);
    }

    public function addSchedulesToCampaign(Request $request)
    {
        $this->repository->addSchedulesToCampaign($request->input('campaign_uid'), $request->input('schedules'));
        return response()->json(['status'=>'ok']);
    }

    public function toggleCampaignStatus(Request $request)
    {
        $this->repository->toggleCampaignStatus($request->input('campaign_uid'));

        return response()->json(['status'=>'ok']);
    }

}
