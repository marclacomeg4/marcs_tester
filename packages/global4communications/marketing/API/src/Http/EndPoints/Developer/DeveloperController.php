<?php


namespace Global4Communications\Marketing\API\Http\EndPoints\Developer;

use App\Http\Controllers\Controller;
use Global4Communications\CRMModels\Models\Leads\ResidentialLead;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaign;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignSchedule;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignScheduleAction;
use Global4Communications\CRMModels\Models\Telesales\TelesalesOpportunity;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Faker\Generator as Faker;
use Illuminate\Support\Facades\Log;


class DeveloperController extends Controller
{
    public function __construct()
    {
        if (env('APP_ENV') !== 'local') {
            die("not available for production!");
        }

        }

    public function deleteTestData()
    {
        if (!\App::environment('local')) {
            return;
        }

        MarketingCampaignSchedule::truncate();
        MarketingCampaignScheduleAction::truncate();
        MarketingCampaign::truncate();
        return response()->json(['status' => 'OK']);
    }

    public function deleteScheduledActions()
    {
        if (!\App::environment('local')) {
            return;
        }
        MarketingCampaignScheduleAction::truncate();
        return response()->json(['status' => 'OK']);
    }

    public function deleteSchedules()
    {
        if (!\App::environment('local')) {
            return;
        }
        MarketingCampaignSchedule::truncate();
        return response()->json(['status' => 'OK']);
    }


    public function createTestResidentialLeads(Request $request, Faker $faker)
    {
        $total = $request->input('total');
        for ($index = 0; $index < $total; $index++) {

            $title = rand(0, 1) ? "Mr" : "Mrs";
            $mobile = rand(0000000000000000, 9000000000000000);
            $landline = rand(0000000000000000, 9000000000000000);

            $first_name = $faker->firstName;
            $last_name = $faker->lastName;
            $email = "";


            $rand = rand(0, 3);
            switch ($rand) {
                case 0:
                    $brand = "PB";
                    break;
                case 1:
                    $brand = "HT";
                    break;
                case 2:
                    $brand = "FL";
                    break;
                default:
                    $brand = "G4";
                    break;
            }

            $optins = [
                "optin_broadband" => false,
                "optin_sky" => false,
                "optin_council" => false,
                "optin_energy" => false,
                "optin_mobile" => false,
                "optin_insurance" => false
            ];

            $email = $brand . "_" . $index . '@';

            $rand = rand(0, 5);
            switch ($rand) {
                case 0:
                    $optins['optin_broadband'] = true;
                    $email .= 'broadband';
                    break;
                case 1:
                    $optins['optin_sky'] = true;
                    $email .= 'sky';
                    break;
                case 2:
                    $optins['optin_council'] = true;
                    $email .= 'council';
                    break;
                case 3:
                    $optins['optin_energy'] = true;
                    $email .= 'energy';
                    break;
                case 4:
                    $optins['optin_mobile'] = true;
                    $email .= 'mobile';
                    break;
                default:
                    $optins['optin_insurance'] = true;
                    $email .= 'insurance';
                    break;
            }

            $email .= ".com";

            $completed_broadband_at = null;
            $completed_sky_at = null;
            $completed_council_at = null;
            $completed_energy_at = null;
            $completed_mobile_at = null;
            $completed_insurance_at = null;
            $contract_broadband_expires_at = null;
            $contract_sky_expires_at = null;
            $contract_energy_expires_at = null;
            $contract_mobile_expires_at = null;
            $contract_insurance_expires_at = null;

            $tenancy_end = "";
            $tenancy_start = Carbon::now()->addDays(rand(0, 30))->toDateString();
            $tenancy_length = null;

            $status1 = [
                'intended_brand' => $brand,
            ];
            $status2 = [
                'completed_broadband_at' => null,
                'completed_sky_at' => null,
                'completed_council_at' => null,
                'completed_energy_at' => null,
                'completed_mobile_at' => null,
                'completed_insurance_at' => null,
                'contract_broadband_expires_at' => null,
                'contract_sky_expires_at' => null,
                'contract_energy_expires_at' => null,
                'contract_mobile_expires_at' => null,
                'contract_insurance_expires_at' => null,
                'tenancy_end_at' => $tenancy_end,
                'tenancy_start_at' => $tenancy_start,
                'tenancy_length' => $tenancy_length,
            ];

            $status = array_merge($status1, array_merge($optins, $status2));


            $acquire = [
                "acquire_method" => "CSV",
                "source" => "datajan_pb_2.csv",
                "uploaded_by" => 158,
                "source_reference" => null,
                "marketing_reference" => null,
                "marketing_sub_reference" => null,
                "residential_partner_id" => null,
                "residential_sub_partner_id" => null,
                "residential_partner_branch_id" => null
            ];

            $do_not_contact = false;
            $do_not_contact_ever = false;
            $gdpr = false;


            $r = ResidentialLead::create([
                'title' => $title,
                'first_name' => $first_name,
                'last_name' => $last_name,
                'email' => $email,
                'mobile' => $mobile,
                'landline' => $landline,
                'status' => $status,
                'acquire' => $acquire,
                'do_not_contact' => $do_not_contact,
                'do_not_contact_ever' => $do_not_contact_ever,
                'gdpr' => $gdpr,
            ]);
        }

        return response()->json(['create' => $total]);
    }

    public function testFunc()
    {
        $query = "SELECT action_type, action_date, marketing_campaign_uid, marketing_campaign_schedule_actions.status, ";
        $query .= "COUNT(marketing_campaign_schedule_actions.uid) as TOTAL, ";
        $query .= "SUM(CASE WHEN marketing_campaign_schedule_actions.status = 'complete' THEN 1 ELSE 0 END) AS COMPLETE_COUNT, ";
        $query .= "SUM(CASE WHEN marketing_campaign_schedule_actions.status = 'pending' THEN 1 ELSE 0 END) AS PENDING_COUNT ";
        $query .="FROM marketing_campaign_schedule_actions LEFT JOIN marketing_campaigns ON marketing_campaign_schedule_actions.marketing_campaign_uid=marketing_campaigns.uid ";
        $query .= " GROUP BY action_type, action_date, marketing_campaign_uid, marketing_campaign_schedule_actions.status ORDER BY action_date, marketing_campaign_uid ";

        $result = \DB::select($query);

        echo json_encode($result);

    }

    public function op_testFunc()
    {
        $campaigns = MarketingCampaign::select('uid')->whereHas('MarketingCampaignSchedules')->get();

        foreach ($campaigns as $campaign) {
            echo "uid " . $campaign->uid . "\r\n";
        };

        $queries = [];

        $from = "2021-02-01";
        $to = "2021-02-28";
        foreach ($campaigns as $campaign) {
            $query = MarketingCampaign::select('uid', 'meta')
                ->with(array('MarketingCampaignScheduleActions'=> function($query) use ($from, $to){
                    $query->select((\DB::raw('count(uid) as total,
                     sum(case when status="complete" then 1 else 0 end) as complete_count,
            sum(case when status="pending" then 1 else 0 end) as pending_count,
            sum(case when status="failed" then 1 else 0 end) as failed_count,
            sum(case when status="skipped" then 1 else 0 end) as skipped_count,
             action_type, marketing_campaign_uid')))->groupby('action_type', 'marketing_campaign_uid')
                        ->whereBetween('action_date', [$from, $to]);
                }))->get();
            $queries[] = $query;
        }
        $result = \DB::select($queries);
        //echo "got " . $query->get();
        echo $result;
    }

    public function resetScheduleActionStatus(Request $request)
    {
        $date = $request->input('date');
        if($request->input('email'))
            MarketingCampaignScheduleAction::where('action_date', $date)->where('action_type', 'Email')->update(['status'=>'pending']);
        if($request->input('sms'))
            MarketingCampaignScheduleAction::where('action_date', $date)->where('action_type', 'SMS')->update(['status'=>'pending']);
        return response()->json(['status' => 'ok']);
    }



    public function _testFunc()
    {
        $campaigns = MarketingCampaign::select('uid')->whereHas('MarketingCampaignSchedules')->get();

        foreach ($campaigns as $campaign) {
            echo "uid " . $campaign->uid . "\r\n";
        };

        $queries = [];

        $from = "2021-02-01";
        $to = "2021-02-28";
        foreach ($campaigns as $campaign) {
            $query = MarketingCampaign::select('uid', 'meta')
                ->with(array('MarketingCampaignScheduleActions'=> function($query) use ($from, $to){
                    $query->select((\DB::raw('count(uid) as total,
                     sum(case when status="complete" then 1 else 0 end) as complete_count,
            sum(case when status="pending" then 1 else 0 end) as pending_count,
            sum(case when status="failed" then 1 else 0 end) as failed_count,
            sum(case when status="skipped" then 1 else 0 end) as skipped_count,
             action_type, marketing_campaign_uid')))->groupby('action_type', 'marketing_campaign_uid')
                    ->whereBetween('action_date', [$from, $to]);
                }));
            $queries[] = $query;
        }

        echo "got " . $query->get();
    }
}
