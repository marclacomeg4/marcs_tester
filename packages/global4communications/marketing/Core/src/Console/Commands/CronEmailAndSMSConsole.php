<?php
namespace Global4Communications\Marketing\Core\Console\Commands;

use Global4Communications\Marketing\API\Http\EndPoints\SMSTransmitController;
use Illuminate\Console\Command;
use  Illuminate\Http\Request;
use Carbon\Carbon;

use Global4Communications\Marketing\API\Http\EndPoints\EmailTransmitController;

class CronEmailAndSMSConsole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'campaign:cron-email-and-sms';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Transmit Email and SMS - for use by cron';

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

        $sms_controller = new SMSTransmitController();
        $sms_response = "SMS: " . $sms_controller->transmitScheduledSMS($request);
        $email_controller = new EmailTransmitController();
        $email_response = "EMAIL: " . $email_controller->transmitScheduledEmails($request);

        $this->line($sms_response );
        $this->line("");
        $this->line("");
        $this->line($email_response);
    }
}
