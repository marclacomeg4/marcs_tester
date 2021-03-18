<template>
<span>
    <v-row>
        <v-col class="pt-0">
            <v-toolbar dark dense color="primary">
                <v-toolbar-title>
                    Leads
                </v-toolbar-title>
 <DemoDisplay></DemoDisplay>
            </v-toolbar>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <AutoCompleteResidentialLeads
                @onLeadSelected="changeLeadSelected"></AutoCompleteResidentialLeads>
        </v-col>
        <v-col>
            <v-btn fab dark small color="primary" class="ma-2 mt-4" :loading="loading"
                   @click="loadLead">
                <v-icon>search</v-icon>
            </v-btn>
        </v-col>
    </v-row>
    <v-container v-if="lead">
    <v-row>
        <v-col >
            <v-card>
                <v-simple-table>
                    <tr><td>
                        {{lead.first_name}} {{lead.last_name}}
                    </td><td></td></tr>
                    <tr><td>
                        {{lead.email}}
                    </td><td></td></tr>
                    <tr><td>
                        Subscribed</td><td> <tick-icon :positive="! lead.status.unsubscribed"></tick-icon>
                    </td></tr>
                    <tr v-if="lead.status.unsubscribed"><td>
                        Unsubscribed On
                    </td><td>{{lead.status.unsubscribed_date}}</td></tr>
                </v-simple-table>
            </v-card>
        </v-col>
        <v-col >
            <v-card>
            <v-simple-table>
                <tr><td>Intended Brand</td><td><brand-fab :brand_prefix="lead.status.intended_brand"></brand-fab></td></tr>
                <tr><td>Optin Broadband</td><td><tick-icon :positive="lead.status.optin_broadband"></tick-icon></td></tr>
                <tr><td>Optin Sky</td><td><tick-icon :positive="lead.status.optin_sky"></tick-icon></td></tr>
                <tr><td>Optin Council</td><td><tick-icon :positive="lead.status.optin_council"></tick-icon></td></tr>
            </v-simple-table>
            </v-card>
        </v-col>
        <v-col >
            <v-card>
            <v-simple-table>
                <tr><td>Completed Broadband</td><td>{{lead.status.completed_broadband_at}}</td></tr>
                <tr><td>Completed Sky</td><td>{{lead.status.completed_broadband_at}}</td></tr>
                <tr><td>Broadband Expires</td><td>{{lead.status.broadband_expires_at}}</td></tr>
                <tr><td>Sky Expires</td><td>{{lead.status.sky_expires_at}}</td></tr>
            </v-simple-table>
            </v-card>
        </v-col>
        <v-col>
            <v-card>
            <v-simple-table>
                <tr><td>Tenancy End</td><td>{{lead.status.tenancy_end_at}}</td></tr>
                <tr><td>Tenancy Start</td><td>{{lead.status.tenancy_start_at}}</td></tr>
                <tr><td>Tenancy Length</td><td>{{lead.status.tenancy_length}}</td></tr>
            </v-simple-table>
            </v-card>
        </v-col>
        <v-col>
            <v-card>
            <v-simple-table>
                <tr><td>Source</td><td>{{lead.acquire.source}}</td></tr>
                    <tr><td>Method</td><td>{{lead.acquire.acquire_method}}</td></tr>
                    <tr><td>Reference</td><td>{{lead.marketing_reference}}</td></tr>
                    <tr><td>Partner</td><td>{{lead.residentialPartner.name}}</td></tr>
                    <tr><td>Sub-Partner</td><td>{{lead.residentialSubPartner.name}}</td></tr>
            </v-simple-table>
            </v-card>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-card>
                <v-card-title>
                    Actions
                </v-card-title>
                <ScheduleActionTable :actions="lead.marketingCampaignScheduleActions" :hide_inspect=false></ScheduleActionTable>
            </v-card>
        </v-col>
    </v-row>
        <v-row v-for="campaign in listCampaigns" key="campaign.uid">
            <v-col >
                <v-card>
                    <v-card-title>Campaign:- {{campaign.meta.campaign_name}}</v-card-title>
                <v-simple-table>
                    <tbody>
                        <tr v-for="schedule in campaign.marketingCampaignSchedules" :key="schedule.uid">
                            <td>{{schedule.meta.days_from_target}}</td>
                            <td>{{schedule.meta.before_after_target}}</td>
                            <td>{{schedule.meta.target_date}}</td>
                            <td>{{schedule.action_type}}</td>
                            <td v-if="schedule.action_type=='Email'">
                                <ul v-for="meta in schedule.meta.template" key="meta.brand">
                                <li><brand-fab :brand_prefix="meta.brand"></brand-fab>   {{meta.slug}}</li>
                            </ul></td>
                            <td v-if="schedule.action_type=='SMS'">{{schedule.meta.sms}}</td>
                        </tr>
                    </tbody>
                </v-simple-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-row v-if="loading">
        <v-col>
            <v-card flat>
                <v-card-actions class="justify-center">
                    <v-progress-circular indeterminate></v-progress-circular>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</span>
</template>

<script>

import AutoCompleteResidentialLeads from "../Components/Form/AutoCompleteResidentialLeads"
import ScheduleActionTable from "../Components/ScheduleActionTable";

export default {
    name: "CampaignLeads",
    components:{AutoCompleteResidentialLeads, ScheduleActionTable},
    data(){
        return{
            lead:null,
            marketingCampaignScheduleActionMetaFields:['template', 'email_subject', 'sms', 'api_result', 'message'],
            telesalesOpportunityCriteriaFields:['id', 'name', 'description', 'active', 'rules'],
            marketingCampaignFields:['uid', 'meta'],
            marketingCampaignScheduleFields:['uid', 'action_type', 'meta'],
            email_content:null,
            search_uid:null,
            loading:false,
        }
    },
    methods:{
        getRequest(){
            let query = {};
            query.endpoint = 'residential_lead';

            let leadStr = 'status{intended_brand,optin_broadband,optin_sky,optin_council,';
            leadStr += 'completed_broadband_at,completed_sky_at,contract_broadband_expires_at, contract_sky_expires_at,';
            leadStr += 'tenancy_end_at,tenancy_start_at,tenancy_length,unsubscribed, unsubscribed_date},';
            leadStr += 'acquire,{source,acquire_method,marketing_reference}';


            query.fields = ['uid', 'first_name', 'last_name', 'email', 'residentialPartner{name}', 'residentialSubPartner{name}', leadStr];
            query.params = {uid:this.search_uid};

            let queryStr = "";
            let actionMetaStr = 'meta{';
            this.marketingCampaignScheduleActionMetaFields.forEach(item=>actionMetaStr += item+',');
            actionMetaStr =  actionMetaStr.substr(0, actionMetaStr.length-1)+'},';

            let campaignStr = 'marketingCampaign{';
            this.marketingCampaignFields.forEach(item=>campaignStr += item + ',');
            campaignStr = campaignStr.substr(0, campaignStr.length-1)+',';

            let campaignScheduleStr = 'marketingCampaignSchedules{';
            this.marketingCampaignScheduleFields.forEach(item=>campaignScheduleStr+=item+',');

            let criteriaStr = 'telesalesOpportunityCriteria{';
            this.telesalesOpportunityCriteriaFields.forEach(item=>criteriaStr+=item+',');
            criteriaStr = criteriaStr.substr(0, criteriaStr.length-1) + '}';

            queryStr = actionMetaStr + campaignStr + campaignScheduleStr +/* criteriaStr +*/ '}}'+criteriaStr;

            query.relations = {
                'marketingCampaignScheduleActions': {
                    fields: ['uid', 'action_date', 'action_type', 'status', 'meta_api_result', queryStr
                    ]
                }
            };

            return query;
        },
        loadLead(){
            this.loading = true;
            this.lead = null;

            const query = this.getRequest();

            graph.getEndPointQuery(query)
                .then((response) => {
                    console.log('get lead:', response);

                    this.lead = response;


                })
                .catch((error) => {
                    console.log('GET marketing_campaign_search ERROR:', error);
                })
                .finally(() => {
                    this.loading = false;
                })
        },
        changeLeadSelected(uid){
            this.search_uid = uid ;
        },
    },
    computed: {
        listCampaigns(){
            let campaigns = [];
            let result = [];
            this.lead.marketingCampaignScheduleActions.forEach(item=>campaigns.push(item.marketingCampaign));
            return _.uniqBy(campaigns, 'uid');
        }
    }
}
</script>

<style scoped>

</style>

