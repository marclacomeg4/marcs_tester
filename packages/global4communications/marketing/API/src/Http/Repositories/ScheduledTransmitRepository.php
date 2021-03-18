<?php

namespace Global4Communications\Marketing\API\Http\Repositories;

use Carbon\Carbon;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignScheduleAction;

class ScheduledTransmitRepository
{
    public function getItemsToSend(string $campaign_uid, string $execution_date, string $item_type)
    {
        $query = MarketingCampaignScheduleAction::select('uid', 'marketing_campaign_uid', 'residential_lead_uid', 'meta');

        if ($campaign_uid) {
            $query->where('marketing_campaign_uid', $campaign_uid);
        }

        $query->whereHas('marketingCampaign', function ($query) {
            return $query->where('status', 'active');
        })
            ->whereHas('residentiallead', function ($query) {
                return $query->whereHas('telesalesOpportunities', function ($query) {
                    return $query->select('id', 'residential_lead_uid', 'status')
                        ->where('status', 'started');
                });
            })
            ->with('marketingCampaign:uid')
            ->whereDate('action_date', Carbon::create($execution_date)->toDateString())
            ->where('action_type', $item_type)
            ->where('status', 'pending')
            ->whereHas('residentialLead', function ($query)  {
                return $query->whereJsonDoesntContain('status->unsubscribed', true)
                    // not marked as do not contact
                    ->safeToContact();
            })
            ->with(array('residentialLead' => function ($query) {
                $query->select('uid', 'first_name', 'last_name', 'email',
                    'mobile', 'mobile2', 'acquire', 'address', 'status->intended_brand as intended_brand')
                    ->with('residentialSubPartner:name,id');
            }));

        return $query->get();
    }

    public function updateStatusAfterSending(string $schedule_action_uid, $response_status, $meta, string $action_type)
    {
        if($action_type === "Email") {
            $status = $response_status['response']['status'];
            $meta['api_result'] = $response_status['response']['api_result'];
            $meta['message'] = $response_status['message'];
        }
        else
        {
            $status = $response_status['status'];
        }

        MarketingCampaignScheduleAction::where('uid', $schedule_action_uid)->update(['status' => $status, 'meta' => $meta]);
    }
}

