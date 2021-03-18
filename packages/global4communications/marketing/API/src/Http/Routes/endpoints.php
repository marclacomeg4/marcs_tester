<?php

Route::post('get-api-initialisation', 'CampaignManagerController@getAPIInitialisation');

Route::post('create-campaign', 'CampaignManagerController@createCampaign');

Route::post('get-template-info', 'CampaignManagerController@getTemplateInfo');

Route::post('add-schedules-to-campaign', 'CampaignManagerController@addSchedulesToCampaign');

Route::post('toggle-campaign-status', 'CampaignManagerController@toggleCampaignStatus');

Route::post('add-scheduled-actions-to-campaign', 'AddCampaignScheduledActionsController@addScheduledActionsToCampaign');

Route::post('transmit-campaign-emails', 'EmailTransmitController@transmitScheduledEmails');

Route::post('test-transmit-campaign-email', 'EmailTransmitController@testTransmitCampaignEmail');

Route::post('transmit-campaign-sms', 'SMSTransmitController@transmitScheduledSMS');

Route::post('transmit-all-by-day', 'TransmitController@transmitAllByDay');


Route::post('list-templates', 'CampaignManagerController@listTemplates');

Route::post('edit-lead-target-date', 'AddCampaignScheduledActionsController@editLeadTargetDate');

Route::post('upload-agent', 'AgentController@upload');

Route::post('purge-monitor', 'MarketingMonitorController@purgeMonitor');
Route::post('get-monitor', 'MarketingMonitorController@getMonitor');


//FOR TESTING ONLY
Route::post('test-func', 'Developer\DeveloperController@testFunc');
//TODO ml 15/2/2021
Route::post('test-transmit-sms', 'SMSTransmitController@sendTestSMS');
Route::post('delete-test-data', 'Developer\DeveloperController@deleteTestData');
Route::post('delete-scheduled-actions', 'Developer\DeveloperController@deleteScheduledActions');
Route::post('delete-schedules', 'Developer\DeveloperController@deleteSchedules');
Route::post('create-test-leads', 'Developer\DeveloperController@createTestResidentialLeads');
Route::post('reset-schedule-action-status', 'Developer\DeveloperController@resetScheduleActionStatus');



