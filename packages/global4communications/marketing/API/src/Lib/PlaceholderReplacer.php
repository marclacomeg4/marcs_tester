<?php

namespace Global4Communications\Marketing\API\Lib;
use Global4Communications\BrandManagers\Managers\BrandManager;
use Global4Communications\CRMModels\Models\PresenterNumber;
use Global4Communications\CRMModels\Models\ResidentialSubPartner;

class PlaceholderReplacer
{
    //TODO - ml 18/1/2021 image, text for image
    //TODO = ml 18/1/2021 NEW ADDRESS,

    /* TODO - ml 18/2/2021 - need a full list of placeholders.
    *|LIST:COMPANY|*,
     * *|LIST:DESCRIPTION|*
     * *|HTML:LIST_ADDRESS_HTML|*
     */

    protected $brand_manager;

    public function __construct(){
        $this->brand_manager = new BrandManager();
    }

    //TODO - ml 23/2/21 - make a list of embedded replacement placeholder from mandrill templates list


    /**
     * Replaces the placeholders in the HTML $code with the $item_to_send
     * @param $code
     * @param $item_to_send
     * @return mixed
     */
    public function replaceEmailPlaceholders(string $code, $item_to_send): string
    {


        $view_in_browser = env('APP_URL') . '/marketing-api-public/email-in-browser/uid/' . $item_to_send['uid'];

        $brand = $item_to_send->residentialLead['intended_brand'];

        $cta = config('email_brand.' . $brand . '.cta');


        $unsubscribe = env('APP_URL') . '/marketing-api-public/unsubscribe/uid/' . $item_to_send->residentialLead['uid'] . '/brand/' . $brand;


        $local = $this->getLocalPhone($brand, $item_to_send->residentialLead);

        //TODO - ml 3/3/2021. bodging agent_id, need to set in csv import
        $agent = ResidentialSubPartner::find($item_to_send->residentialLead['acquire']['residential_sub_partner_id']);

        $img_src = (isset($agent) && $agent->logo_image_filename != null) ? ("https://leads-spa.global4.co.uk/img/sub-partners/original/" . rawurlencode($agent->logo_image_filename)) : null;

        if(strlen($img_src))
        {
            $img = '<img src="' . $img_src . '" />';
            $code = str_replace("!AGENTTEXTORIMAGE", $img, $code);
            $code = str_replace("*|AGENTIMAGENAME|*", $img, $code);
            $code = str_replace("*|AGENTTEXTORIMAGE|*", $img, $code);
        }
        else
        {
            $code = str_replace("!AGENTTEXTORIMAGE", '', $code);
            $code = str_replace("*|AGENTIMAGENAME|*", '', $code);
            $code = str_replace("*|AGENTTEXTORIMAGE|*", '', $code);
        }

        if (isset($item_to_send["agent"])) $code = str_replace("*|AGENTNAME|*", $item_to_send["agent"], $code);
        if (isset($item_to_send['residentialLead']['residentialSubPartner']['name'])) $code = str_replace("*|AGENTNAME|*", $item_to_send['residentialLead']['residentialSubPartner']['name'], $code);
        $code = str_replace("*|FULLNEWADD|*", $this->fullAddressWithoutBlanks($item_to_send), $code);
        if (isset($item_to_send["new_add1"])) $code = str_replace("*|NEWADD1|*", $item_to_send["new_add1"], $code);
        if (isset($item_to_send['residentialLead']["full_name"])) $code = str_replace("*|FULLNAME|*", $item_to_send['residentialLead']["full_name"], $code);
        $code = str_replace("*|CUSTID|*", $item_to_send->residential_lead_uid, $code);
        if(isset($cta)) $code = str_replace("*|CTA|*", $cta, $code);
        if(isset($local)) $code = str_replace("*|LOCAL|*", $local, $code);
        if (isset($unsubscribe)) $code = str_replace("*|UNSUB|*", $unsubscribe, $code);
        if (isset($view_in_browser)) $code = str_replace("*|ARCHIVE|*", $view_in_browser, $code);

        if (isset($item_to_send["agent"])) $code = str_replace("!AGENTNAME", $item_to_send["agent"], $code);
        if (isset($item_to_send['residentialLead']['residentialSubPartner']['name'])) $code = str_replace("!AGENTNAME", $item_to_send['residentialLead']['residentialSubPartner']['name'], $code);
        $code = str_replace("!FULLNEWADD", $this->fullAddressWithoutBlanks($item_to_send), $code);
        if (isset($item_to_send["new_add1"])) $code = str_replace("!NEWADD1", $item_to_send["new_add1"], $code);
        if (isset($item_to_send['residentialLead']["full_name"])) $code = str_replace("!FULLNAME", $item_to_send['residentialLead']["full_name"], $code);
        $code = str_replace("!CUSTID", $item_to_send->residential_lead_uid, $code);
        if (isset($cta)) $code = str_replace("!CTA", $cta, $code);
        if (isset($local)) $code = str_replace("!LOCAL", $local, $code);
        if (isset($unsubscribe)) $code = str_replace("!UNSUB", $unsubscribe, $code);
        if (isset($view_in_browser)) $code = str_replace("!ARCHIVE", $view_in_browser, $code);

        return $code;
    }

    //TODO ml 14/1/2021 - query database to find local phone no.
    protected function getLocalPhone($brand, $residential_lead)
    {
        $town = $residential_lead['address']['town'];
        if($brand !== "HT")
            return $this->getBrandDefaultPhone($brand);
        $phone = PresenterNumber::select('presenter_number')->where('town', $town)->first();
        if(!$phone)
            return $this->getBrandDefaultPhone($brand);
        return $phone->presenter_number;
    }

    protected function getBrandDefaultPhone($brand)
    {
        return $this->brand_manager->getTelephoneNumber($brand, "sales");
    }


// TODO - ml 14/1/2021 create a csv to test this. AND how to format the address?
    protected function fullAddressWithoutBlanks($item_to_send): string
    {

        $return_str = "";
        if(!array_key_exists( 'address',$item_to_send->residentialLead ))
            return $return_str;
        foreach (array_keys($item_to_send->residentialLead['address']) as $key) {
            if (strlen(trim($item_to_send->residentialLead['address'][$key]))) {
                $return_str .= "<p>" . $item_to_send->residentialLead['address'][$key] . "</p>";
            }
        }
        return $return_str;
    }
}
