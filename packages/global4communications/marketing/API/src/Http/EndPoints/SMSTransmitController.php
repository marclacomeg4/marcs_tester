<?php

namespace Global4Communications\Marketing\API\Http\EndPoints;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Global4Communications\Marketing\API\Http\Repositories\ScheduledTransmitRepository;
use Global4Communications\SMSManager\Providers\TextAnywhere;
use Global4Communications\SMSManager\SMSManager;
use  Illuminate\Http\Request;
use Global4Communications\Marketing\API\Http\Repositories\MarketingMonitorRepository;


class SMSTransmitController extends Controller
{
    protected $manager;
    protected $params;
    protected $repository;
    protected $monitor_repository;

    public function __construct()
    {
        $this->params = [
            'returnCSVString' => true,
            'originator' => '',
            'clientBillingReference' => 'Import SMS',
            'clientMessageReference' => 'Standard Message',
            'replyMethodID' => 5,
            'replyData' => url('/sms-reply/sales')
        ];
        $this->repository = new ScheduledTransmitRepository();
        $this->monitor_repository = new MarketingMonitorRepository();
    }

    public function transmitScheduledSMS(Request $request)
    {
        $campaign_uid = false;
        if ($request->input('campaign_uid')!== '*')
            $campaign_uid = $request->input('campaign_uid');

        $execution_date = $request->input('execution_date');

        $list_to_send = $this->repository->getItemsToSend($campaign_uid, $execution_date, 'SMS');


        if (config('mandrill.LIVE_MODE')) {

            foreach ($list_to_send as $item_to_send) {
                $sms_result = $this->sendOneSMS(['item_to_send' => $item_to_send, 'logging' => true]);
                $this->repository->updateStatusAfterSending($item_to_send->uid, $sms_result, $item_to_send->meta, "SMS");
            }
        } else {
            $send_test = true; //limit to only send one
            foreach ($list_to_send as $item_to_send) {
                if ($send_test) {
                    $sms_result = $this->sendOneSMS(['item_to_send' => $item_to_send, 'logging' => true]);
                    $this->repository->updateStatusAfterSending($item_to_send->uid, $sms_result, $item_to_send->meta, "SMS");
                }
                $send_test = false;
            }
        }
        return response()->json(['sent_sms' => count($list_to_send)]);
    }


    public function sendOneSMS(array $params)
    {
        $item_to_send = $params['item_to_send'];

        $number = "";
        if (config('mandrill.LIVE_MODE')) {
            if (!empty($item_to_send['residentialLead']['mobile']))
                $number = $item_to_send['residentialLead']['mobile'];
            else if (!empty($item_to_send['residentialLead']['mobile2']))
                $number = $item_to_send['residentialLead']['mobile2'];
        } else {
            $number = config('mandrill.TEST_SMS');
        }

        if (!strlen($number)) {
            $log_message = "skipping - no mobile " . $item_to_send['residentialLead']['uid'] . " " . $item_to_send['residentialLead']['last_name'] . Carbon::now();
            $this->monitor_repository->addMonitor($params, "NO NUMBER", "skipped");
            $return['status'] = 'skipped';
            $return['api_result'] = 'no mobile no.';
            return $return;
        }

        $log_message = "sms ready " . $item_to_send['residentialLead']['uid'] . " " . $number . " " . Carbon::now();
        $log_message = "sms ready " . $item_to_send['residentialLead']['uid'] . " " . $number . " " . Carbon::now();

        $return = [];

        $message = $item_to_send['meta']['sms'];

        $this->manager = new SMSManager(new TextAnywhere());

        $this->manager->setCredentials(env('TEXTANYWHERE_USERNAME'), env('TEXTANYWHERE_PASSWORD'));

        $response = $this->manager->sendSMS($message, $number, $this->params);

        if (strpos($response->SendSMSResult, '#1#') !== false) {
            $return['status'] = 'complete';
            $return['api_result'] = '1';
        } else {
            $return['status'] = 'failed';
            $return['api_result'] = $response->SendSMSResult;
        }

        $this->monitor_repository->addMonitor($params, $number, $return['status']);
        $log_message = "sms complete " . $return['api_result'] . " " . Carbon::now();

        return $return;
    }

    public function sendTestSMS(Request $request)
    {
        $item_to_send = ['uid' => -1, 'residentialLead' => ['uid' => -1, 'last_name' => 'testing', 'mobile' => $request->input('number')], 'meta' => ['sms' => 'Sending a test message ' . Carbon::now()]];
        $params = ['item_to_send' => $item_to_send, 'logging' => false];
        return $this->sendOneSMS($params);
    }
}

