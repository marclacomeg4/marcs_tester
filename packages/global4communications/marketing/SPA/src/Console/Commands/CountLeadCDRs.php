<?php namespace Global4Communications\Marketing\SPA\Console\Commands;

use Carbon\Carbon;
use Global4Communications\CRMModels\Models\CdrUcm;
use Global4Communications\CRMModels\Models\Leads\ResidentialLead;
use Global4Communications\PaymentPortal\Managers\AffinityBalanceImporterManager;
use Illuminate\Console\Command;

class CountLeadCDRs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'statistics:count_lead_cdrs {minutes=6}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Counts the calls and updates the leads';

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
     * @return mixed
     */
    public function handle()
    {
        $cdr_ucms = CdrUcm::where('updated_at', '>', Carbon::now()->subMinutes($this->argument('minutes'))->toDateTimeString())
            ->where('ex_cli_number', '!=', null)
            ->get();

        foreach ($cdr_ucms as $cdr_ucm) {
            $this->line('CLI: ' . $cdr_ucm->ex_cli_number);


            if (substr($cdr_ucm->ex_cli_number, 0, 2) === '07') {
                $this->info('Is a mobile: ' . $cdr_ucm->ex_cli_number);

                $residentialLead = ResidentialLead::where('mobile', $cdr_ucm->ex_cli_number)->orderby('created_at', 'desc')->first();

                if ($residentialLead) {
                    $count = CdrUcm::where('ex_cli_number', $cdr_ucm->ex_cli_number)->where('ex_user_id', '!=', 0)->count();

                    $residentialLead->update(['mobile_count' => $count]);

                    $this->line('Updated residential lead ID: ' . $residentialLead->uid . ' with count: ' . $count);
                }else{
                    $this->warn('No lead found with that number');
                }
            } else {
                $this->info('Is a landline: ' . $cdr_ucm->ex_cli_number);

                $residentialLead = ResidentialLead::where('mobile', $cdr_ucm->ex_cli_number)->orderby('created_at', 'desc')->first();

                if ($residentialLead) {
                    $count = CdrUcm::where('ex_cli_number', $cdr_ucm->ex_cli_number)->where('ex_user_id', '!=', 0)->count();

                    $residentialLead->update(['landline_count' => $count]);

                    $this->line('Updated residential lead ID: ' . $residentialLead->uid . ' with count: ' . $count);
                }else{
                    $this->warn('No lead found with that number');
                }
            }
        }

        $this->info('Completed!');
    }
}
