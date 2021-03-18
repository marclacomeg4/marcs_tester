<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SMSReply;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Http\Requests;

//TODO - ml 19/1/2021 are we going to use this?

class SMSRepliesSearchController extends Controller
{
    public function index()
    {
        $SMSReplies = SMSReply::orderby('created_at', 'desc')->paginate(100);

        return view('admin.sms-replies.index')->with('SMSReplies', $SMSReplies);
    }

    public function search(Request $request)
    {
        $status = $request->get('status');

        if ($status == 'Either') {
            $SMSReplies = SMSReply::where('original_message', 'LIKE', $request->get('original_message'))->orderby('created_at', 'desc')->paginate(100);
        } else {
            $SMSReplies = SMSReply::where('original_message', 'LIKE', $request->get('original_message'))
                ->where('status', $status)
                ->orderby('created_at', 'desc')
                ->paginate(100);
        }

        return view('admin.sms-replies.index')->with('SMSReplies', $SMSReplies);
    }

}
