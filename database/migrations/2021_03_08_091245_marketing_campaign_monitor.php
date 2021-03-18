<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
 * datetime
email/sms
to
started
ended

 */

class MarketingCampaignMonitor extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('marketing_campaign_monitors', function (Blueprint $table) {
            $table->uuid('uid');
            $table->timestamps();
            $table->string('to');
            $table->dateTime('started');
            $table->dateTime('completed');
            $table->json('status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('marketing_campaign_monitors');    }
}
