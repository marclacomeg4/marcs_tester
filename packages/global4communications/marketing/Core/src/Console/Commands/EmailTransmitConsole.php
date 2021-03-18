<?php


namespace Global4Communications\Marketing\Core\Console\Commands;

use Illuminate\Console\Command;
use  Illuminate\Http\Request;
use Carbon\Carbon;

use Global4Communications\Marketing\API\Http\EndPoints\EmailTransmitController;

//TODO ml 23/2/2021 - unsubscribe and view in browser links wrong when you send from console
class EmailTransmitConsole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'campaign:transmit-email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Transmit email. Enter date to send ';

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
        $day = false;
        $month = false;
        $year = false;


        while ((!is_numeric($day))||((is_numeric($day))&&(abs($day)>31))) {
            $day = $this->ask('Please enter day');
        }

        while ((!is_numeric($month))||((is_numeric($month))&&(abs($month)>12))) {
            $month = $this->ask('Please enter month');
        }

        while ((!is_numeric($year))||((is_numeric($year))&&(abs($year)<2021))) {
            $year = $this->ask('Please enter year');
        }

        $execution_date = Carbon::createFromDate(abs($year), abs($month), abs($day))->toDateString();

        $campaign_uid = $this->ask('Enter a campaign uid (or * for all campaigns)');
        $confirm_question = 'Send emails for ' . $execution_date . ' for ';
        $confirm_question .= $campaign_uid === '*' ? 'all campaigns' : 'campaign ' . $campaign_uid;
        $confirm_question .= '? Please type yes to confirm';
        $confirm = $this->ask($confirm_question);

        if(strtoupper($confirm) === 'YES') {
            $request = new Request();
            $request->replace([
                'campaign_uid' => $campaign_uid === '*' ? false : $campaign_uid,
                'execution_date' => $execution_date
            ]);
            $controller = new EmailTransmitController();
            $response = $controller->transmitScheduledEmails($request);
            $this->line(json_encode($response));
        }
        else
            $this->line('operation was cancelled. no emails sent');
        return 0;
    }
}
