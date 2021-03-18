<?php
namespace Global4Communications\Marketing\API\MailServerAPI;


//TODO ml 13/1/20201 - not using this? replace with an interface?
interface MailServerAPIHandler
{
    public function getTemplates();
    public function getTemplateInfo(String $template_name);
    public function getAPIFormattedMessage(string $email, string $subject, string $html, string $brand, $item_to_send) : array;
    public function sendEmail(array $message):array;
}
