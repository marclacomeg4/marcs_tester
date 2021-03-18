<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MarketingCampaignActionsArchive extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('marketing_campaign_schedule_actions_archive', function (Blueprint $table) {
            $table->uuid('uid');
            $table->primary('uid');
            $table->timestamps();
            $table->json('meta');
            $table->string('marketing_campaign_uid');
            $table->string('residential_lead_uid');
            $table->string('action_type');
            $table->date('action_date');
            $table->enum('status',['pending', 'complete', 'failed', 'skipped']);
            $table->date('archived');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('marketing_campaign_schedule_actions_archive');    }
}
