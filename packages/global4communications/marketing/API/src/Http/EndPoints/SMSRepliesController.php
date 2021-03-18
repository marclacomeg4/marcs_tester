<?php

namespace App\Http\Controllers\CRM;

use App\Models\Activity;
use App\Models\HODetails;
use App\Models\SMSReply;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

//TODO - create model after talking to sam. use scheduled action id when sending the message
// and create action when reply arrives?

class SMSController extends Controller
{
    public function reply(Request $request)
    {
        try {
            //\Log::info('SMS: '. serialize($request->all()));

            $phone_number = trim(preg_replace("/44/", "0", $request->get('Sender'), 1));
            $message = addslashes(str_replace(array("\n\r", "\r\n", "\n", PHP_EOL), '', $request->get('Message')));
            $reply_date = str_replace(array("\n\r", "\r\n", "\n", PHP_EOL), '', $request->get('ReplyDate'));
            $reply = addslashes(str_replace(array("\n\r", "\r\n", "\n", PHP_EOL), '', $request->get('Reply')));

            if($phone_number != ''){
                $HODetail = HODetails::where('mobNumber', $phone_number)
                    ->orWhere('altNumber', $phone_number)
                    ->orderBy('created', 'desc')
                    ->first();

                SMSReply::create([
                    'hodetail_id' => ($HODetail) ? $HODetail->id : 0,
                    'mobNumber' => $phone_number,
                    'status' => $request->get('result'),
                    'reply' => $reply,
                    'original_message' => $message,
                    'replyDate' => $reply_date
                ]);

                if ($HODetail) {
                    Activity::create([
                        'scheduled_at' => Carbon::now()->toDateTimeString(),
                        'action' => 'SMS Reply',
                        'notes' => 'Their reply: ' . $reply . ' Original Message: ' . $message,
                        'status' => 'Planned',
                        'priority' => 2,
                        'hodetail_id' => $HODetail->id
                    ]);
                }
            }

        } catch (\Exception $e) {
            \Log::debug('SMS Reply Error: ' . $e->getMessage());
        }
    }

    public function salesReply(Request $request)
    {
        try {
            \Log::info('SMS: '. serialize($request->all()));

            $phone_number = trim(preg_replace("/44/", "0", urldecode($request->get('originator')), 1));
            $reply = urldecode($request->get('body'));
            $original_message = urldecode($request->get('clientmessagereference'));
            $reply_date = trim(urldecode($request->get('date')));

            if($phone_number != ''){
                $HODetail = HODetails::where('mobNumber', $phone_number)
                    ->orWhere('altNumber', $phone_number)
                    ->orderBy('created', 'desc')
                    ->first();

                SMSReply::create([
                    'hodetail_id' => ($HODetail) ? $HODetail->id : 0,
                    'mobNumber' => $phone_number,
                    'status' => $request->get('result'),
                    'reply' => $reply,
                    'original_message' => $original_message,
                    'replyDate' => $reply_date
                ]);

                if ($HODetail) {
                    Activity::create([
                        'scheduled_at' => Carbon::now()->toDateTimeString(),
                        'action' => 'SMS Reply',
                        'notes' => 'Their reply: ' . $reply . ' Original Message: ' . $original_message,
                        'status' => 'Planned',
                        'priority' => 2,
                        'hodetail_id' => $HODetail->id
                    ]);
                }
            }

        } catch (\Exception $e) {
            \Log::debug('SMS Reply Error: ' . $e->getMessage());
        }
    }
}
