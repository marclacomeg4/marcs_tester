<template>
    <span v-if="user_is_marc">
        <v-row>
            <v-col>
        <v-dialog max-width="50%" v-model="delete_mode">
            <v-card>
                Enter the confirmation code
                <v-text-field outlined v-model="delete_confirm"></v-text-field>
              <v-divider></v-divider>
         <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="confirmDelete"
          >
            Yes
          </v-btn>
          <v-btn
              color="primary"
              text
              @click="cancelDelete"
          >
            No
          </v-btn>
        </v-card-actions>
            </v-card>
        </v-dialog>

            </v-col>
        </v-row>
    <v-row>
        <v-col class="pt-0">
            <v-toolbar dark dense color="primary">
                <v-toolbar-title>
                    DEVELOPER
                </v-toolbar-title>
                <DemoDisplay></DemoDisplay>
            </v-toolbar>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <div id="responses">{{ response }}</div>
        </v-col>

        <v-col cols="4">
            <h4>FOR DEVELOPMENT ONLY!</h4>
            <ul>
                <li></li>
                <li>
                    <v-expansion-panels>
                        <v-expansion-panel
                        >
                            <v-expansion-panel-header>
                                DELETE ALL
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-btn @click="requestDeleteT('ALL')">Delete all test data</v-btn>
                                <p></p>
                                <v-btn @click="requestDelete('SCHEDULES')">Delete Schedules</v-btn>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </li>
                <li></li>
                <li></li>
                <li>
                    <v-btn @click="requestDelete('Actions')">Delete Scheduled Actions</v-btn>
                </li>
                <li>
                    <ul>
                        <li>
                            <CampaignSelector
                                v-bind.sync="campaign_selector"
                                :selectAllCampaigns="true"
                            ></CampaignSelector>
                        </li>
                        <li>
                            <v-select :items="criterias" v-model="selected_criteria" outlined
                                      item-text='name'
                                      item-value='id'
                                      label='Opportunity Criteria'

                            >
                            </v-select>
                        </li>

                    </ul>

                    <v-btn @click="addScheduledActionsToCampaign">Add Scheduled Actions</v-btn>
                </li>
            </ul>
        </v-col>
        <v-col cols="4">
            <ul>
                <li>
                    Day
                    <input v-model="date_day_input"
                           single-line
                           hide-details
                           show-select
                           type="number"/>
                    Month
                    <input v-model="date_month_input"
                           single-line
                           hide-details
                           show-select
                           type="number"/>
                    year
                    <input v-model="date_year_input"
                           single-line
                           hide-details
                           show-select
                           type="number"/>
                <li></li>
                <li>
                    <v-btn @click="transmitEverything">Transmit Everything</v-btn>
                </li>
                <li></li>
                <li></li>
                <li>
                    <v-btn @click="transmitCampaignEmail">Transmit Emails By Day</v-btn>
                </li>
                <li></li>
                <v-btn @click="transmitCampaignSMS">Transmit SMS By Day</v-btn>
                <li></li>
                <li></li>
                <input v-model="test_sms_number"
                       single-line
                       hide-details
                       show-select
                />
                <li></li>
                <li></li>
                <v-btn @click="transmitTestSMS">Transmit Test SMS</v-btn>

                <li></li>
            </ul>
        </v-col>
        <v-col cols="4">
            <ul>
                <li>
                </li>
                <li>
                </li>
                <li>
                    <v-text-field type="number" v-model="create_leads_count" outlined/>
                </li>
                <li>
                    <v-btn @click="createTestLeads">Create Test Leads</v-btn>
                </li>
                 <li></li>
                <li>
                    Clear older than (days)
                    <v-text-field type="number"
                                  outlined
                                  v-model="purge_monitor_days_input"
                    />
                </li>
                <v-btn @click="clearCampaignMonitor">Clear Monitor</v-btn>
                <li></li>
                Clear by d/m/year - set in col 2
                <li></li>
                <v-switch v-model="reset_email" label="email"></v-switch>
                <v-switch v-model="reset_sms" label="sms"></v-switch>
                <v-btn @click="resetScheduleActionStatus">Reset TX Status</v-btn>
                <li></li>
                <li>
                    <v-btn @click="testFunc">test func</v-btn>
                </li>
                <li>
                </li>
            </ul>

        </v-col>
    </v-row>
        <v-row>
            <v-col>
                Get by d/m/year - set in col 2
                <v-btn @click="getCampaignMonitor">Get Monitor</v-btn>
        <v-data-table
            :headers="headers"
            :items="monitor_items"
            :disable-pagination="true"
            :hide-default-footer="true"
            :disable-sort="true"
            item-key="uid"
        >
        </v-data-table>

            </v-col>
        </v-row>
    </span>
</template>


<script>

import {mapState} from 'vuex';
import InformUser from "../Components/InformUser";
import CampaignSelector from "../Components/Form/CampaignSelector";

export default {
    components: {InformUser, CampaignSelector},
    data() {
        return {
            date_day_input: 1,
            date_month_input: 3,
            date_year_input: 2021,
            telesales_opportunity_criteria_id: 30,
            campaign_selector: {
                campaign_uid: null
            },
            create_leads_count: 100,
            response: "",
            criterias: [],
            selected_criteria: null,

            purge_monitor_days_input: 0,
            delete_mode: null,
            delete_confirm: null,

            reset_sms: false,
            reset_email: false,

            headers: [
                {text: 'to', value: 'to'},
                {text: 'name', value: 'name'},
                {text: 'started', value: 'started'},
                {text: 'completed', value: 'completed'},
                {text: 'status', value: 'status'},
                {text: 'template', value: 'marketing_campaign_schedule_action.template'},
                {text:'sms', value:'marketing_campaign_schedule_action.sms'}
            ],

            monitor_items:[]


        }
    },
    mixins: [],
    methods: {
        addScheduledActionsToCampaign: function () {

            if (!this.campaign_selector.campaign_uid) {
                this.$store.commit('inform_user/show_inform_message', "You must select a campaign");
                return;
            }

            console.log(this.selected_criteria);


            this.$store.dispatch('email/add_scheduled_actions_to_campaign',
                {
                    telesales_opportunity_criteria_id: this.selected_criteria,
                    campaign_uid: this.campaign_selector.campaign_uid
                });
        },

        transmitCampaignEmail: function () {
            const date = this.date_year_input + "-" + this.date_month_input + "-" + this.date_day_input + " 00:00:00";
            this.$store.dispatch('email/transmit_campaign_emails', {
                date: date,
                campaign_uid: this.campaign_selector.campaign_uid ? this.campaign_selector.campaign_uid : '*'
            });
        },

        transmitEverything: function () {
            const date = this.date_year_input + "-" + this.date_month_input + "-" + this.date_day_input + " 00:00:00";
            this.$store.dispatch('email/transmit_all_by_day', date);
        },


        transmitCampaignSMS: function () {

            const date = this.date_year_input + "-" + this.date_month_input + "-" + this.date_day_input + " 00:00:00";
            this.$store.dispatch('email/transmit_campaign_sms', {
                date: date,
                campaign_uid: this.campaign_selector.campaign_uid ? this.campaign_selector.campaign_uid : '*'
            });
        },

        editLeadTargetDate: function () {
            const data = {
                'residential_lead_uid': 'c2e6ec63-4ff8-4ac9-b2ea-9f8463b85063',
            }
            axios.post('/marketing-api/edit-lead-target-date', data).then(response => {
                console.log(response)
                this.response = response;
            });
        },

        getOpportunityCriterias: function () {
            let request = {
                endpoint: 'telesales_opportunity_criterias',
                fields: ['id', 'name'],
                paginate: {first: 1000},
                params: {
                    first: 1000
                }
            }

            let _request = {
                endpoint: 'marketing_campaign_names',
                fields: ['uid', 'name'],
                params: {}
            }

            graph.getEndPointQuery(request)
                .then((response) => {
                    console.log('Get telesales_opportunity:', response);
                    this.criterias = response.data;
                })
                .catch((error) => {
                    console.log('GET telesales_opportunity ERROR:', error);
                })

        },

        createTestLeads() {
            axios.post('marketing-api/create-test-leads', {total: this.create_leads_count}).then(response => {
                console.log('create-test-leads ' + JSON.stringify(response.data));
                this.response = JSON.stringify(response.data);
            })
        },

        clearCampaignMonitor() {
            axios.post('marketing-api/purge-monitor', {days: this.purge_monitor_days_input}).then(response => {
                console.log('purge monitor ' + JSON.stringify(response.data));
                this.response = JSON.stringify(response.data);
            })
        },

        getCampaignMonitor(){
            const date = this.date_year_input + "-" + this.date_month_input + "-" + this.date_day_input + " 00:00:00";
            axios.post('marketing-api/get-monitor', {from: date, to:date}).then(response => {
                //console.log('get monitor ' + JSON.stringify(response.data));
                this.monitor_items = response.data;
            })
        },

        transmitTestSMS() {
            axios.post('marketing-api/test-transmit-sms', {number: this.test_sms_number}).then(response => {
                console.log('test transmit sms ' + JSON.stringify(response.data));
                this.response = JSON.stringify(response.data);
            })
        },

        resetScheduleActionStatus(action_type) {
            const date = this.date_year_input + "-" + this.date_month_input + "-" + this.date_day_input + " 00:00:00";
            const data = {
                date: date,
                sms: this.reset_sms,
                email: this.reset_email
            }
            axios.post('marketing-api/reset-schedule-action-status', data).then(response => {
                console.log('reset schedule action status ' + JSON.stringify(response.data));
                this.response = JSON.stringify(response.data);
            })
        },
        testFunc() {
            axios.post('marketing-api/test-func',).then(response => {
                console.log('test func ' + JSON.stringify(response.data));
                this.response = JSON.stringify(response.data);
            })
        },
        requestDelete(mode) {
            this.delete_mode = mode;
        },
        confirmDelete() {
            if (this.delete_confirm != "123456")
                return;
            this.delete_mode = null;
            switch (this.delete_mode) {
                case 'ALL':
                    this.deleteTestData();
                    break;
                case 'SCHEDULES':
                    this.deleteSchedules();
                    break;
                case 'ACTIONS':
                    this.deleteScheduledActions();
                    break;
            }
        },
        cancelDelete() {
            this.delete_mode = null;
        },
        deleteTestData: function () {
            if (process.env.MIX_ENV === "local") {
                axios.post('/marketing-api/delete-test-data').then(response => {
                    console.log('delete-test-data response ' + JSON.stringify(response.data))
                    this.response = 'delete-test-data response ' + JSON.stringify(response.data);
                }).catch(e => {
                    console.log(e);
                });
            }
        },
        deleteScheduledActions() {
            if (process.env.MIX_ENV === "local") {
                axios.post('/marketing-api/delete-scheduled-actions').then(response => {
                    console.log('delete-scheduled-actions ' + JSON.stringify(response.data))
                    this.response = 'delete-scheduled-actions ' + JSON.stringify(response.data);
                }).catch(e => {
                    console.log(e);
                });
            }
        },
        deleteSchedules() {
            if (process.env.MIX_ENV === "local") {
                axios.post('/marketing-api/delete-schedules').then(response => {
                    console.log('delete-schedules ' + JSON.stringify(response.data))
                    this.responses = 'delete-schedules ' + JSON.stringify(response.data);
                }).catch(e => {
                    console.log(e);
                });
            }
        },

    },
    computed: {
        ...mapState('email', ['live_mode']),
        ...mapState('user', ['user']),
        test_sms_number() {
            return this.live_mode ? this.live_mode.test_sms : null
        },
        user_is_marc() {
            return this.user.email.indexOf('marc.lacome') !== -1;
        }
    },
    created() {
        this.getOpportunityCriterias();
    }
}
</script>
