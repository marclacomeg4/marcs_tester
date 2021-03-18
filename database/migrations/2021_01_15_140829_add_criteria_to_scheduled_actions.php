<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCriteriaToScheduledActions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('marketing_campaign_schedule_actions', function (Blueprint $table) {
                $table->string('telesales_opportunity_criteria_id')->default('-1');
            });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('scheduled_actions', function (Blueprint $table) {
            //
        });
    }
}
