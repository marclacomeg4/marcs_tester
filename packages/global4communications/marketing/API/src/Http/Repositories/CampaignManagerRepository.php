<?php

namespace Global4Communications\Marketing\API\Http\Repositories;

use Carbon\Carbon;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaign;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignSchedule;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignScheduleAction;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignMonitor;


class CampaignManagerRepository
{
    protected $scheduled_actions_repository;

    public function __construct(){
        $this->scheduled_actions_repository = new CampaignScheduledActionsRepository();
    }

    public function createCampaign(string $campaign_name)
    {
        return MarketingCampaign::create([
            'meta' => ['campaign_name'=>$campaign_name],
            'status'=>'suspended',
            'brands'=>[""]
        ])->uid;
    }

    public function addSchedulesToCampaign(string $campaign_uid, array $schedules)
    {
        //are there any scheduled_actions for this campaign? If so, we'll have to regenerate them
        $has_scheduled_actions = MarketingCampaignScheduleAction::select('telesales_opportunity_criteria_id')->
            where('marketing_campaign_uid', $campaign_uid)->get()->unique()->toArray();

        MarketingCampaignSchedule::where('marketing_campaign_uid', $campaign_uid)->delete();

        foreach($schedules as $schedule) {
            MarketingCampaignSchedule::create(['meta' => $schedule['meta'],
            'action_type'=>$schedule['action_type'],
            'marketing_campaign_uid' =>  $campaign_uid]);
        }

        $this->scheduled_actions_repository->editScheduledActionsForCampaign($campaign_uid,$has_scheduled_actions);
    }

    public function toggleCampaignStatus(string $campaign_uid)
    {
        $marketing_campaign = MarketingCampaign::where('uid', $campaign_uid)->first();

        if ($marketing_campaign->status === 'active')
            $marketing_campaign->status = 'suspended';
        else
            $marketing_campaign->status = 'active';

        $marketing_campaign->save();
    }

}




