<?php


namespace Global4Communications\Marketing\API\Http\EndPoints;

use App\Http\Controllers\Controller;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignScheduleAction;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignMonitor;
use  Illuminate\Http\Request;
use Carbon\Carbon;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignMembership;
use Global4Communications\Marketing\API\MailServerAPI\MandrillAPIHandler;
use Global4Communications\Marketing\API\Http\Repositories\ScheduledTransmitRepository;
use Global4Communications\CRMModels\Models\Leads\ResidentialLead;
use Global4Communications\Marketing\API\Lib\PlaceholderReplacer;
use Global4Communications\Marketing\API\Http\Repositories\MarketingMonitorRepository;


class EmailTransmitController extends Controller
{
    protected $api_handler;
    protected $cached_templates;
    protected $repository;
    protected $monitor_repository;
    protected $placeholder_replacer;

    public function __construct()
    {
        $this->api_handler = new MandrillAPIHandler();
        $this->cached_templates = [];
        $this->repository = new ScheduledTransmitRepository();
        $this->monitor_repository = new MarketingMonitorRepository();
        $this->placeholder_replacer = new PlaceholderReplacer();
    }

    public function transmitScheduledEmails(Request $request)
    {
        $api_responses = ['ok'=>0, 'errors'=>[]];

        $campaign_uid = false;
        if ($request->input('campaign_uid')!== '*')
            $campaign_uid = $request->input('campaign_uid');


        $execution_date = $request->input('execution_date');

        $list_to_send = $this->repository->getItemsToSend($campaign_uid, $execution_date, 'Email');

         foreach ($list_to_send as $item_to_send) {
            $email_result = $this->sendOneEmail(["item_to_send"=>$item_to_send, "logging"=>true]);

            $this->repository->updateStatusAfterSending($item_to_send->uid, $email_result, $item_to_send->meta, "Email");

            if($email_result['response']['status'] === 'complete')
                $api_responses['ok']++;
            else
                array_push($api_responses['errors'], $email_result['response']['api_result']);
        }

        return response()->json(['sent_emails' => $api_responses]);
    }

    /* allow test mode =
    only applies if APP_ENV is local
    if true supplied email address will be changed to marcs email address
    if false supplied email address will be unchanged

    allows us to test send of entire campaign (all emails go to marc)
    or send email template test from spa - email goes to address entered by user
    */

    protected function sendOneEmail(Array $params): array
    {

        $item_to_send = $params['item_to_send'];

        if( ! isset($item_to_send['residentialLead']['email']))
        {
            $this->monitor_repository->addMonitor($params, 'NO EMAIL    ', 'skipped');
            return ['response'=>['api_result'=>'no email address', 'status'=>'skipped'], 'message'=>"no email address"];

        }

        if(config('mandrill.LIVE_MODE'))
            $email = $item_to_send['residentialLead']['email'];
        else
            $email = config('mandrill.TEST_EMAIL');

        $this->monitor_repository->addMonitor($params, $email, "pending");


        $subject = $item_to_send->meta['email_subject'];

        $brand = $item_to_send->residentialLead['intended_brand'];

        $template = $item_to_send->meta['template'];

        if (!isset($this->cached_templates[$template])) {
            $this->cached_templates[$template] = $this->api_handler->getTemplateInfo($template);
        }

        $html = $this->placeholder_replacer->replaceEmailPlaceholders($this->cached_templates[$template]['publish_code'], $item_to_send);

        $message = $this->api_handler->getAPIFormattedMessage($email, $subject, $html, $brand, $item_to_send);
        $result = $this->api_handler->sendEmail($message);

        $this->monitor_repository->addMonitor($params, $email, 'complete');

        return ['response'=>$result, 'message'=>$message];
    }




/* from the test dialog in SPA add-schedules*/
    public function testTransmitCampaignEmail(Request $request)
    {
        $residential_lead = ResidentialLead::where('uid', $request->input('residential_lead_uid'))->first();
        $residential_lead->email = $request->input('email');
        $residential_lead->intended_brand = $request->input('brand');

        $item_to_send = new MarketingCampaignScheduleAction();
        $item_to_send->uid = '-1';
        $item_to_send->residentialLead=$residential_lead;
        $item_to_send->residential_lead=$residential_lead;
        $item_to_send->brand = $request->input('brand');
        $item_to_send->meta = ['template'=>$request->input('template'), 'email_subject'=>$request->input('subject')];

        $result =  $this->sendOneEmail(["item_to_send"=>$item_to_send, "allow_test_mode"=>false, 'logging'=>false]);
        $status = $result['response']['status'];
        $api_result = $result['response']['api_result'];
        return response()->json(['status'=>$status, 'api_result'=>$api_result]);
    }
}
