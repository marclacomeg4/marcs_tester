<?php


namespace Global4Communications\Marketing\SPA\Http\Repositories;


use Global4Communications\CRMModels\Models\Leads\ResidentialLead;
use Global4Communications\CRMModels\Models\Marketing\MarketingCampaignScheduleAction;
use Global4Communications\Marketing\API\MailServerAPI\MandrillAPIHandler;
use Global4Communications\Marketing\API\Http\EndPoints\EmailTransmitController;
use Global4Communications\Marketing\API\Lib\PlaceholderReplacer;
use Illuminate\Support\Carbon;

class PublicAPIRepository
{
    protected $placeholder_replacer;

    public function __construct()
    {
        $this->placeholder_replacer = new PlaceholderReplacer();
    }

    public function webViewableEmail($schedule_action_uid)
    {
        $data = MarketingCampaignScheduleAction::select('uid','meta->template as template', 'meta->email_subject as subject', 'residential_lead_uid', 'marketing_campaign_uid')
            ->where('uid', $schedule_action_uid)
            ->with('marketingCampaign:uid')
            ->with(array('residentialLead' => function ($query) {
                    $query->select('uid', 'first_name', 'last_name', 'email',
                        'mobile', 'mobile2', 'acquire', 'address', 'status->intended_brand as intended_brand')
                        ->with('residentialSubPartner:name,id');
                })
            )
            ->first();

        $api_handler = new MandrillAPIHandler();
        $template = $api_handler->getTemplateInfo($data->template);
        return $this->placeholder_replacer->replaceEmailPlaceholders($template['publish_code'], $data);
    }

    public function unsubscribe(string $uid)
    {
        $dt = Carbon::now()->toDateString();
        $lead = ResidentialLead::select('uid', 'status' )
            ->with('marketingCampaignScheduleAction')
            ->where('uid', $uid)->first();
        $status = $lead->status;
        $status['unsubscribed']=true;
        $status['unsubscribed_date']=$dt;
        $lead->update(['status'=>$status]);
        $lead->marketingCampaignScheduleAction()->where('status', 'pending')->update(['status'=>'skipped']);
    }
}

