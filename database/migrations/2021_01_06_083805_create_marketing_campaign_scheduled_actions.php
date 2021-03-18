<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMarketingCampaignScheduledActions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('marketing_campaign_scheduled_actions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->json('meta');
            $table->string('marketing_campaign_uid');
            $table->string('action_type');
            $table->date('action_date');
            $table->enum('active',['pending', 'complete', 'failed', 'skipped']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('marketing_campaign_scheduled_actions');
    }
}
