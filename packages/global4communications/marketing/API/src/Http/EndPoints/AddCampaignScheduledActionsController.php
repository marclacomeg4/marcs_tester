<?php

namespace Global4Communications\Marketing\API\Http\EndPoints;

use App\Http\Controllers\Controller;
use Global4Communications\Marketing\API\Http\Repositories\CampaignScheduledActionsRepository;
use Global4Communications\Marketing\API\Http\Requests\AddMembersRequest;
use  Illuminate\Http\Request;

class AddCampaignScheduledActionsController extends Controller
{
    protected $repository;
    public function __construct()
    {
        $this->repository = new CampaignScheduledActionsRepository();
    }

    public function addScheduledActionsToCampaign(Request $request)
    {
        $telesales_opportunity_criteria_id = $request->input('telesales_opportunity_criteria_id');

        $campaign_uid = $request->input('campaign_uid');

        $count_scheduled_actions = $this->repository->addScheduledActionsToCampaign($campaign_uid, [$telesales_opportunity_criteria_id]);

        return response()->json(['added-scheduled-actions'=>$count_scheduled_actions]);
    }

    public function editLeadTargetDate(Request $request)
    {
        $this->repository->editLeadTargetDate($request);
        return response()->json(['status'=>'ok']);

    }

  }
