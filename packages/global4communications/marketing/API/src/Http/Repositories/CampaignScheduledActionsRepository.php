<?php

namespace Global4Communications\Marketing\API\Http\Repositories;

use Carbon\Carbon;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaign;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignSchedule;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignScheduleAction;
use Global4Communications\CRMModels\Models\Telesales\TelesalesOpportunity;

use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\Exception\UnsatisfiedDependencyException;
use Illuminate\Support\Facades\Log;


class CampaignScheduledActionsRepository
{
    public function addScheduledActionsToCampaign(string $campaign_uid, array $telesales_opportunity_criteria_ids)
    {
        $schedules = MarketingCampaign::with(array('marketingCampaignSchedules' => function ($query) {
            $query->select('marketing_campaign_uid', 'meta', 'action_type')->get();
        }))
            ->where('uid', $campaign_uid)->first();

        $new_opportunities = $this->getOpportunitiesToAdd($campaign_uid, $telesales_opportunity_criteria_ids);

        $new_schedule_actions = [];

        foreach ($schedules->marketingCampaignSchedules as $schedule) {
            foreach ($new_opportunities as $new_action) {
                $date = $this->calculateTargetDate($schedule, $new_action);
                $new_action = $this->createScheduleAction(
                    $campaign_uid, $new_action['residential_lead_uid'], $new_action['telesales_opportunity_criteria_id'],
                    $date, $schedule, $new_action->residentialLead['status']['intended_brand']
                );
                if($new_action)
                    array_push($new_schedule_actions, $new_action);
            }
        }

        $this->insertScheduleActions($new_schedule_actions);

        return ['added' => count($new_schedule_actions)];
    }

    //TODO - handle house move and contract expiry for setting target dates(currently only handling tenancy start)
    /*TODO ml 14/1/2021. related to above. now calling tenancy start Moving Date.
    What will actual value be in residential_lead->status - could be tenancy start or moving date?
    How do I know what text string to search for?
    */

    public function editScheduledActionsForCampaign(string $campaign_uid, array $telesales_opportunity_criteria_ids)
    {
        $new_opportunities = $this->getOpportunitiesToEdit($campaign_uid, $telesales_opportunity_criteria_ids);

        $schedules = MarketingCampaign::with(array('marketingCampaignSchedules' => function ($query) {
            $query->select('marketing_campaign_uid', 'meta', 'action_type')->get();
        }))
            ->where('uid', $campaign_uid)->first();

        /*
         * You want to insert a schedule_action for each residential_lead for each opportunity
        But you are editing an existing campaign
        Some records will already have status=complete, others will be pending.
        1. Delete any pending schedule actions for the campaign
        2. Get all remaining schedule actions for the campaign
        3. Insert all new schedule_actions
        BUT - do not insert if a record already exists for that date and status is complete
        */

        /*1. delete all pending schedule actions for the campaign*/
        if (count($telesales_opportunity_criteria_ids)) {
            MarketingCampaignScheduleAction::where('marketing_campaign_uid', $campaign_uid)
                ->whereIn('telesales_opportunity_criteria_id', $telesales_opportunity_criteria_ids)
                ->where('status', 'pending')
                ->delete();
        }

        /*2. we'll create a new schedule action for each new opportunity.
        first, check if a schedule action already exists */
        $queries = [];
        foreach ($schedules->marketingCampaignSchedules as $schedule) {
            foreach ($new_opportunities as $new_opportunity) {
                $date = $this->calculateTargetDate($schedule, $new_opportunity);
                $query = \DB::table('marketing_campaign_schedule_actions')
                    ->select('status', 'residential_lead_uid', 'action_date', 'action_type', 'uid')
                    ->where('marketing_campaign_uid', $campaign_uid)
                    ->where('action_date', $date)
                    ->where('telesales_opportunity_criteria_id', $new_opportunity['telesales_opportunity_criteria_id'])
                    ->where('residential_lead_uid', $new_opportunity['residential_lead_uid'])
                    ->where('action_type', $schedule->action_type);
                array_push($queries, $query);
            }
        }

        $existing_schedule_actions_query = null;
        foreach ($queries as $query) {
            if (!$existing_schedule_actions_query)
                $existing_schedule_actions_query = $query;
            else
                $existing_schedule_actions_query = $existing_schedule_actions_query->union($query);
        }

        if ($existing_schedule_actions_query)
            $existing_schedule_actions = $existing_schedule_actions_query->get();
        else
            $existing_schedule_actions = collect(); //create an empty collection


        /* 3. add the new schedule actions - but only if there isn't one in the existing list*/
        $added = 0;
        $rejected = 0;
        $new_schedule_actions = [];
        foreach ($schedules->marketingCampaignSchedules as $schedule) {
            foreach ($new_opportunities as $new_action) {
                $date = $this->calculateTargetDate($schedule, $new_action);
                $exists = $existing_schedule_actions->contains(function ($item) use ($schedule, $new_action, $date) {
                    return $item->action_date === $date
                        && $item->residential_lead_uid === $new_action['residential_lead_uid']
                        //TODO - use criteria id?
                        && $item->action_type === $schedule->action_type;
                });
                if (!$exists) {
                    $added++;
                    $new_action = $this->createScheduleAction(
                        $campaign_uid, $new_action['residential_lead_uid'], $new_action['telesales_opportunity_criteria_id'],
                        $date, $schedule, $new_action->residentialLead['status']['intended_brand']
                    );
                    if($new_action)
                    array_push($new_schedule_actions, $new_action);
                } else
                    $rejected++;
            }
        }

        $this->insertScheduleActions($new_schedule_actions);
        return ['added' => count($new_schedule_actions), 'rejected_duplicates' => $rejected];
    }

    protected function insertScheduleActions($new_schedule_actions)
    {
        //TODO - ml 15/1/2021. size for max insert?
        $MAX_INSERT_SIZE = 500;
        if (count($new_schedule_actions)) {
            $insert_chunks = array_chunk($new_schedule_actions, $MAX_INSERT_SIZE);
            foreach ($insert_chunks as $insert_chunk) {
                MarketingCampaignScheduleAction::insert($insert_chunk);
            }
        }
    }

    protected function createScheduleAction($campaign_uid, $residential_lead_uid, $telesales_opportunity_criteria_id, $date, $schedule, $intended_brand)
    {
        $template = null;
        if ($schedule->action_type === "Email") {
            foreach ($schedule->meta['template'] as $meta) {
                if ($meta['brand'] === $intended_brand)
                    $template = $meta['slug'];
            }
        }

/* it is possible there won't be a template - if the lead's intended brand doesn't have a matching template in scheduled_action*/
        if($schedule->action_type === "Email" && !$template)
            return null;

        return [
            'uid' => Uuid::uuid4()->toString(),
            'marketing_campaign_uid' => $campaign_uid,
            'residential_lead_uid' => $residential_lead_uid,
            'action_date' => $date,
            'action_type' => $schedule->action_type,
            'meta' => json_encode([
                'template' => $template,
                'email_subject' => $schedule->meta['email_subject'],
                'sms' => $schedule->meta['sms']
            ]),
            'status' => 'pending',
            'telesales_opportunity_criteria_id' => $telesales_opportunity_criteria_id,
            'created_at' => \DB::raw('CURRENT_TIMESTAMP'),
            'updated_at' => \DB::raw('CURRENT_TIMESTAMP'),
        ];
    }

    protected function calculateTargetDate($schedule, $action)
    {
        $target_date = 'none';

        switch ($schedule->meta['target_date']) {
            case 'Moving Date':
                $target_date = $action['residentialLead']['status']['tenancy_start_at'];
                break;
            //TODO - ml - 18/1/2021 - handle sky, energy etc
            default:
                $target_date = $action['residentialLead']['status']['tenancy_start_at'];
                break;
        }

        $date = '';

        switch ($schedule->meta['before_after_target']) {
            case 'on':
                $date = Carbon::create($target_date);
                break;
            case 'after':
                $date = Carbon::create($target_date)->addDays($schedule->meta['days_from_target']);
                break;
            case 'before':
                $date = Carbon::create($target_date)->subDays($schedule->meta['days_from_target']);
                break;
        }

        return $date->toDateString();
    }

    protected function getBrandsArray(string $campaign_uid) : array
    {

        $brands = [];
        $schedule_actions = MarketingCampaignSchedule::select('uid', 'meta', 'meta->template as templates')
            ->where('meta->template', '<>', 'null')
            ->whereHas('marketingCampaign', function ($query) use ($campaign_uid) {
                $query->select('uid')->where('uid', $campaign_uid);
            })->get();

        foreach ($schedule_actions as $schedule) {
            foreach (json_decode($schedule->templates) as $template) {
                array_push($brands, $template->brand);
            }
        }
        return array_unique($brands);
    }

    protected function getOpportunitiesToAdd(string $campaign_uid, array $telesales_opportunity_criteria_id)
    {
        $brands = $this->getBrandsArray($campaign_uid);

        $query = TelesalesOpportunity::select('residential_lead_uid', 'telesales_opportunity_criteria_id', 'status')
            ->whereIn('telesales_opportunity_criteria_id', $telesales_opportunity_criteria_id)
            ->where('status', 'started')
            ->whereHas('residentialLead', function ($query) use ($telesales_opportunity_criteria_id) {
                $query->whereJsonDoesntContain('status->unsubscribed', true)
                    ->safeToContact()
                    ->whereHas('marketingCampaignScheduleAction', function ($query) use ($telesales_opportunity_criteria_id) {
                        $query->whereNotIn('telesales_opportunity_criteria_id', $telesales_opportunity_criteria_id);
                    })
                    ->orWhereDoesntHave('marketingCampaignScheduleAction');
            });
        $result = $query->get();
        return $result;
    }


    /* when campaign schedules are edited in spa */
    protected function getOpportunitiesToEdit(string $campaign_uid, array $telesales_opportunity_criteria_id)
    {
        $brands = $this->getBrandsArray($campaign_uid);

        $query = TelesalesOpportunity::select('residential_lead_uid', 'telesales_opportunity_criteria_id', 'status')
            ->whereIn('telesales_opportunity_criteria_id', $telesales_opportunity_criteria_id)
            ->where('status', 'started')
            ->whereHas('residentialLead', function ($query) use ($brands, $telesales_opportunity_criteria_id) {
                return $query->select('uid', 'status')
                    ->whereJsonDoesntContain('status->unsubscribed', true)
                    ->safeToContact()
                    ->whereIn('status->intended_brand', $brands)
                    ->with('marketingCampaignScheduleAction:uid,residential_lead_uid');
            });
        $result = $query->get();
        return $result;
    }

    //TODO - ml 19/1/2021 - limit this to status <> complete?
    public function old_editLeadTargetDate(Request $request)
    {
        $old_date = Carbon::parse($request->input('old_date'));
        $new_date = Carbon::parse($request->input('new_date'));
        $days_difference = $old_date->diffInDays($new_date, false);

        $old_actions = MarketingCampaignScheduleAction::where('residential_lead_uid', $request->input('residential_lead_uid'))
            ->where('status', '<>', 'complete')->get();

        foreach ($old_actions as $old_action) {
            $replace_date = Carbon::parse($old_action->action_date)->addDays($days_difference)->toDateString();
            MarketingCampaignScheduleAction::where('uid', $old_action->uid)
                ->update(['action_date' => $replace_date]);
        }
    }

    public function editLeadTargetDate(Request $request)
    {
        $residential_lead = $request->input('residential_lead_uid');

        $existing_actions = MarketingCampaignScheduleAction::select('uid', 'marketing_campaign_uid')
            ->where('residential_lead_uid', $residential_lead)
            ->where('status', '<>', 'complete')->get();

        $marketing_campaigns = $existing_actions->map(function ($item) {
            return $item->marketing_campaign_uid;
        })->unique();

        $marketing_campaigns->each(function ($item) {
            $schedules = \CreateMarketingCampaignTxSchedules::where('marketing_campaign_uid', $item)->get();
            $schedules->each(function ($item) {
//TODO ml 25/1/2021 - insert new schedule_action here - but how do I know the telesales_opportunity_criteria_id?
            });
        });
    }

}
