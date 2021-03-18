<?php

namespace Tests\Unit;

use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignMonitor;




class ScheduleActionsTest extends TestCase
{

    use RefreshDatabase;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testBasicTest()
    {
        $lead = factory(\Global4Communications\CRMModels\Models\Leads\ResidentialLead::class)->create();
        $pdo = \DB::connection()->getPdo();
        $monitor = new MarketingCampaignMonitor([
            'started' => Carbon::now(),
            'completed' => Carbon::now(),
            'to' => "to",
            'name' => "name",
            'action_uid' => -1,
            'status' => "pending"
        ]);
        $monitor->save();

        $getmon = MarketingCampaignMonitor::all();
        $this->assertTrue($getmon->count()===1);

    }
}
