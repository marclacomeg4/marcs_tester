<?php

namespace Global4Communications\Marketing\Core\Console\Commands;

use Global4Communications\Marketing\API\Http\EndPoints\EmailTransmitController;
use Illuminate\Console\Command;
use  Illuminate\Http\Request;
use Carbon\Carbon;

class CronEmailConsole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'campaign:cron-email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Transmit Email - for use by cron';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $request = new Request();
        $request->replace([
            'campaign_uid' => '*',
            'execution_date' => Carbon::now()->toDateString()
        ]);

        $controller = new EmailTransmitController();
        $response = $controller->transmitScheduledEmails($request);
        $this->line(json_encode($response));
    }
}
