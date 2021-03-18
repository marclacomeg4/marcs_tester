<?php

namespace Global4Communications\Marketing\API\MailServerAPI;
use Global4Communications\Marketing\API\MailServerAPI\MailServerAPIHandler;

class MandrillAPIHandler implements MailServerAPIHandler
{
    protected $api;

    //TODO ml 18/1/2021 - sort out env variables!
    public function __construct()
    {

        $key = config('mandrill.MANDRILL_KEY');
        $this->api = new \Mandrill( $key);



        if (env('APP_ENV') == 'local') {
            curl_setopt($this->api->ch, CURLOPT_SSL_VERIFYHOST, 2);
            curl_setopt($this->api->ch, CURLOPT_SSL_VERIFYPEER, 2);
            curl_setopt($this->api->ch, CURLOPT_CAINFO, base_path() . '/../cacert.pem');
        }
    }

    public function getTemplates()
    {
            $templates = $this->api->templates->getList();

            $data = array_map(function($item){
                return ['slug'=>$item['slug'], 'name'=>$item['name']];
            }, $templates);

        return $data;
    }

    public function getTemplateInfo(String $template_name)
    {
        return $this->api->templates->info($template_name);
    }

    /**
     * Get the params required to send via this API
     * @param $code
     * @param $params
     * @return mixed
     */
    public function getAPIFormattedMessage(string $email, string $subject, string $html, string $brand, $item_to_send) : array
    {
        return array(
            'html' => $html,
            'text' => '',
            'subject' => $subject,
            'from_email' => config('email_brand.' . $brand . '.email_from'),
            'from_name' => config('email_brand.' . $brand . '.email_from_name'),
            'to' => array(
                array(
                    'email' => $email,
                    'name' => $item_to_send['residentialLead']['full_name'],
                    'type' => 'to'
                )
            ),
            'headers' => array('Reply-To' => config('email_brand.' . $brand . '.reply_to')),
            'important' => true,
            'track_opens' => null,
            'track_clicks' => null,
            'auto_text' => null,
            'auto_html' => null,
            'inline_css' => null,
            'url_strip_qs' => null,
            'preserve_recipients' => null,
            'view_content_link' => null,
            'bcc_address' => null,
            'tracking_domain' => null,
            'signing_domain' => null,
            'return_path_domain' => null,
            'merge' => true,
            'merge_language' => 'mailchimp',
            'global_merge_vars' => array(
                array(
                    'name' => 'merge1',
                    'content' => 'merge1 content'
                )
            ),
            'merge_vars' => array(
            ),
            'metadata' => [
                'custid' => $item_to_send['residentialLead']['uid'],
                'eid' => $item_to_send['uid'],
                'type' => $item_to_send['residentialLead']->residentialSubPartner['name']
            ],
            'recipient_metadata' => array(
                array(
                    'rcpt' => $email,
                    'values' => array('user_id' => 123456)
                )
            ),
        );
    }

    public function sendEmail(array $message):array
    {
        $result =  $this->api->messages->send($message, false, null, null)[0];

        $return = [];

        if(is_array($result)) {
            if (array_key_exists('status', $result)) {
                if($result['_id'])
                    $return['api_result'] = $result['_id'];
                if (($result['status'] === "sent") || ($result['status'] === 'queued'))
                    $return['status'] = 'complete';
                else {
                    $return['status'] = 'failed';
                    $return['api_result'] = $result['status'] . " reject reason = " . $result['reject_reason'];
                }

            } else {
                $return['status'] = 'failed';
                $return['api_result'] = 'no response';
            }

        //    $return['api_result'] = $result;
        }
        else
            $return = ['status'=>'failed', 'api_result'=>'UNKNOWN'];
        return $return;
    }

}

