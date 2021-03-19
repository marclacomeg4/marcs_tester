<?php


namespace Global4Communications\Marcs\API\Http\EndPoints;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Global4Communications\CRMModels\Models\PaymentPlanItem;
use  Illuminate\Http\Request;

class TestController extends Controller
{
    public function paymentsPending(Request $request)
    {
        $date = Carbon::createFromDate($request->input('date'));
        $query = PaymentPlanItem::where('payment_date', '=', $date->format('Y-m-d'))
            ->where('payment_plan_items.status', 'planned')
            ->where('payment_plans.status', 'active');
            if($request->input('monthly')) {
                $query->where('frequency', 'monthly');
            }
            $query->leftJoin('payment_plans', 'payment_plans.id', '=', 'payment_plan_items.payment_plan_id')
            ->with('paymentPlan');
            $results = $query->get();
        foreach($results as $result)
        {
            $result->initial_amount_pence = round($result->initial_amount_pence/100, 2);
            $result->recurring_amount_pence = round($result->recurring_amount_pence/100, 2);
            $result->amount_pence = round($result->amount_pence/100, 2);
        }
         return response()->json($results);
    }
}
