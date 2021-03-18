<?php

namespace Global4Communications\Marketing\API\Http\EndPoints;

use App\Http\Controllers\Controller;
use  Illuminate\Http\Request;
use Global4Communications\Marketing\API\Http\EndPoints\EmailTransmitController;
use Global4Communications\Marketing\API\Http\EndPoints\SMSTransmitController;

class TransmitController extends Controller{
    protected $email_transmit_controller;
    protected $sms_transmit_controller;

    public function __construct()
    {
        $this->email_transmit_controller = new EmailTransmitController();
        $this->sms_transmit_controller = new SMSTransmitController();
    }

    public function TransmitAllByDay(Request $request)
    {
        $sms_response = $this->sms_transmit_controller->transmitScheduledSMS($request)->getOriginalContent();
        $email_response = $this->email_transmit_controller->transmitScheduledEmails($request)->getOriginalContent();
        return response()->json(['email'=>$email_response, 'sms'=>$sms_response]);
    }
}

