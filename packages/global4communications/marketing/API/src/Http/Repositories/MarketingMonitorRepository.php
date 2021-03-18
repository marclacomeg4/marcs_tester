<?php


namespace Global4Communications\Marketing\API\Http\Repositories;

use Carbon\Carbon;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignMonitor;


class MarketingMonitorRepository
{

    public function addMonitor(Array $params, String $to, String $status)
    {
        $item_to_send = $params['item_to_send'];
        if ($params['logging']) {

            $monitor = new MarketingCampaignMonitor([
                'started' => Carbon::now(),
                'completed' => Carbon::now(),
                'to' => $to,
                'name' => $item_to_send['residentialLead']['first_name'] . " " . $item_to_send['residentialLead']['last_name'],
                'action_uid' => $params['item_to_send']['uid'],
                'status' => $status
            ]);
            $monitor->save();
        }
    }

    public function purgeMonitor($days)
    {
        MarketingCampaignMonitor::where('created_at', '<=', Carbon::now()->subDays($days))->delete();
    }

    public function getMonitor(String $from, String $to)
    {
        return MarketingCampaignMonitor::select('to', 'name', 'started', 'completed', 'status', 'action_uid')
            ->with(array('marketingCampaignScheduleAction'=>function($query){
                $query->select('uid', 'meta->template as template', 'meta->sms as sms' );
            }))
        ->whereDate('started', $from)->orWhereDate('completed', $to)->get();
    }
}
