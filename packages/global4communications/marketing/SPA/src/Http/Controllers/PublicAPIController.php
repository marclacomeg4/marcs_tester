<?php

namespace Global4Communications\Marketing\SPA\Http\Controllers;

use App\Http\Controllers\Controller;
use  Illuminate\Http\Request;
use Global4Communications\Marketing\SPA\Http\Repositories\PublicAPIRepository;
use Global4Communications\CRMModels\Models\Leads\ResidentialLead;



class PublicAPIController extends Controller
{

    protected $repository;

    public function __construct()
    {
        $this->repository = new PublicAPIRepository();
    }

    public function emailInBrowser(Request $request)
    {
        return response($this->repository->webViewableEmail($request->uid), 200)
            ->header('Content-Type', 'text/html' );
    }

    public function unsubscribe(Request $request)
    {
        $this->repository->unsubscribe($request->uid);
        return \View::make('portal_res_marketing::unsubscribed', ['brand'=>$request->brand]);
    }

//TODO - ml 22/2/2021 - test when live
    public function smsReply(Request $request)
    {
        try {
            \Log::info('SMS: '. serialize($request->all()));

            $phone_number = trim(preg_replace("/44/", "0", urldecode($request->get('originator')), 1));
            $reply = urldecode($request->get('body'));
            $original_message = urldecode($request->get('clientmessagereference'));
            $reply_date = trim(urldecode($request->get('date')));

            if($phone_number != ''){
                $lead = ResidentialLead::where('mobile', $phone_number)
                    ->orWhere('mobile2', $phone_number)
                    ->orderBy('created', 'desc')
                    ->first();

                //UPDATE LEAD META IF REQUIRED AND STORE SMS RESPONSE IN???
                //from _alpha CRM/Controllers for reference

            }

        } catch (\Exception $e) {
            \Log::debug('SMS Reply Error: ' . $e->getMessage());
        }
    }
}



