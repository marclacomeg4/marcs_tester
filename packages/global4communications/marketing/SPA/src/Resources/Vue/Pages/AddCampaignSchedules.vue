<template>
    <span>
        <v-dialog max-width="50%" v-model="test_data.show_send_test_dialog">
            <v-card>
                <TestSendEmail v-bind.sync="test_data" :templates="templates"></TestSendEmail>
            </v-card>
        </v-dialog>
        <v-dialog max-width="50%" v-model="confirm_exit_page">
            <v-card  class="pa-12">
                <h2>You have unsaved data. Do you want to exit?</h2>
              <v-divider></v-divider>
            <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              text
              color="primary"
              dark
              @click="confirmExitPage"
          >
            Yes
          </v-btn>
          <v-btn
              text
              color="primary"
              dark
              @click="cancelExitPage"
          >
            No
          </v-btn>
        </v-card-actions>
            </v-card>
        </v-dialog>
        <v-row>
            <v-col class="pt-0">
                <v-toolbar dark dense color="primary">
                    <v-toolbar-title>
                        Campaign Manager
                    </v-toolbar-title>
                    <DemoDisplay></DemoDisplay>
                </v-toolbar>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4">
                <v-row>
                    <AddCampaign v-model="new_campaign_dialog" onAddedCampaign="onAddedCampaign"></AddCampaign>
                    <v-col cols="12">
                        <v-btn @click="show_new_campaign_dialog(true)">Add Campaign</v-btn>
                    </v-col>
                    <v-col cols="12">
                        <CampaignSelector
                            v-bind.sync="campaign_selector"
                            :selectAllCampaigns="false"
                        ></CampaignSelector>
                    </v-col>
                    <v-col cols="12">
                        <ScheduleTable templates="selected_templates" v-bind.sync="edit_selector"></ScheduleTable>
                    </v-col>
                    <v-col cols="12">
                        <v-btn @click="storeSchedules()">Save</v-btn>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="4">
                <v-row>
                    <v-col cols="12" class="pa-0">
                        <v-radio-group
                            v-model="selected_action_type"
                            row
                        >
                            <v-radio
                                label="Email "
                                value="Email"
                            ></v-radio>
                            <v-radio
                                label="SMS"
                                value="SMS"
                            ></v-radio>
                        </v-radio-group>
                        <v-col cols="12" class="px-0">
                            <v-text-field v-model="days_input"
                                          single-line
                                          hide-details
                                          show-select
                                          outlined
                                          :disabled="days_input_disabled"
                                          type="number"/>
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-select
                                v-model='selected_before_after'
                                :items='selected_before_after_items'
                                label='Before/after'
                                outlined
                                @change='onChangeBeforeAfter'
                            ></v-select>
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-select
                                v-model='selected_target_date'
                                :items='selected_target_date_items'
                                outlined
                                label='Select date'
                            ></v-select>
                        </v-col>
                        <v-col cols="12" v-if="selected_action_type==='Email'" class="py-0">
                            <v-row>
                                <v-col cols="12" class="pa-0">
                                    <v-text-field
                                        v-model="email_subject"
                                        label="Email Subject"
                                        outlined
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" v-if="! templates.length">
                                    <v-card flat>
                                        <v-card-actions class="justify-center">
                                            <v-progress-circular indeterminate></v-progress-circular>
                                        </v-card-actions>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" class="pt-0" v-if="templates.length">
                                    <v-row v-for="brand in brands" :key="brand.brand">
                                        <v-col cols="4">
                                            <brand-chip :brand_prefix="brand.brand"></brand-chip>
                                </v-col>
                                        <v-col cols="6" class="pa-0">
                                            <v-select
                                                :value="get_template_selector(brand.brand)"
                                                @focus="focus(brand.brand)"
                                                @input="select_template"
                                                :items='templates'
                                                item-text='slug'
                                                item-value='slug'
                                                outlined
                                                label='Select a Template'
                                            >
                                            </v-select>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-btn small :disabled="!get_template_selector(brand.brand)"
                                                   @click="init_send_test_dialog(brand.brand)">Test</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" v-if="selected_action_type==='SMS'" class="pa-0">
                            <template>
                                <v-textarea
                                    v-model="sms_message"
                                    outlined
                                    label="SMS"
                                ></v-textarea>
                            </template>
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-btn @click="addSchedule">Add</v-btn>
                        </v-col>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="4">
                <v-row>
                    <v-col>
                        <v-card>
                            <v-tabs v-model="tab">
                                <v-tab v-for="item in tab_items" :key="item.tab">
                                    <brand-fab :brand_prefix="item.brand"></brand-fab>
                                </v-tab>
                            </v-tabs>
                            <v-tabs-items v-model="tab">
                                <v-tab-item v-for="(item, index) in tab_items" :key="item.uid+item.brand">
                                    <v-card flat>
                                        <v-card-text v-if="! template_loading">
                                            <div class="zoom-template" v-html="item.content"></div>
                                        </v-card-text>
                                        <v-card-actions class="justify-center" v-if="template_loading">
                                            <v-progress-circular indeterminate></v-progress-circular>
                                        </v-card-actions>
                                    </v-card>
                                </v-tab-item>
                            </v-tabs-items>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </span>
</template>

<script>

import ScheduleTable from "../Components/ScheduleTable";
import CampaignSelector from "../Components/Form/CampaignSelector";
import {mapState} from "vuex";
import AddCampaign from "../Components/Form/AddCampaign";
import TestSendEmail from "../Components/TestSendEmail";

export default {
    name: "AddCampaignSchedules",
    components: {TestSendEmail, ScheduleTable, CampaignSelector, AddCampaign},
    data() {
        return {
            editing_uid: null,
            days_input: 0,
            days_input_disabled: false,
            selected_before_after: '',
            selected_before_after_items: ['before', 'after', 'on'],
            selected_target_date: '',
            action_types: ['Email', 'SMS'],
            selected_action_type: 'Email',
            sms_message: '',
            email_subject: '',
            selected_templates: [],
            templates: [],
            tab: null,
            selected_brand: "",
            selected_slug: "",
            template_loading: false,
            new_campaign_dialog: false,
            new_campaign_name: '',
            test_data: {
                residential_lead_uid: "",
                subject: "abc",
                template: "",
                brand: "",
                send_to: null,
                status: "nothing_sent",
                api_result: "",
                show_send_test_dialog: false,

            },
            campaign_selector: {
                campaign_uid: null
            },
            edit_selector: {
                edit_schedule_uid: null
            },
            navigate_to: null,
            confirm_exit_page: false,
        }
    },
    methods: {
        focus(brand) {
            this.selected_brand = brand;
        },

        select_template(slug) {
            if (!this.selected_brand)
                return;
            this.selected_slug = slug;
            const template_obj = this.selected_templates.find(item => item.brand === this.selected_brand);
            if (template_obj)
                template_obj.slug = slug;
            else
                this.selected_templates.push({brand: this.selected_brand, slug: slug});
            let tab_index = this.tab_items.findIndex(item => item.brand === this.selected_brand);
            this.tab_items[tab_index].loading = true;
            this.template_loading = true;
            this.tab = tab_index;
            const data = {name: this.selected_slug}
            axios.post('/marketing-api/get-template-info', data).then(response => {
                //  console.log('get-template-info response ' + JSON.stringify(response.data));

                this.tab_items[tab_index].content = response.data.template_info.publish_code;
                this.tab_items[tab_index].loading = false;
                this.template_loading = false;
                this.tab = null;
                this.tab = tab_index;
            }).catch(e => {
                console.log(e);
            });
        },

        listTemplates: function () {
            axios.post('/marketing-api/list-templates').then(response => {
//                   console.log('list-templates response ' + JSON.stringify(response.data));
                this.templates = [...response.data.templates];
            }).catch(e => {
                console.log(e);
            });

        },
        onChangeBeforeAfter: function (value) {
            if (value === "on") {
                this.days_input = 0;
                this.days_input_disabled = true;
            } else
                this.days_input_disabled = false;
        },
        addSchedule() {
            this.$store.commit('inform_user/hide_inform_message');
            if (!this.days_input || this.days_input === '0') {
                if (this.selected_before_after !== 'on') {
                    this.$store.commit('inform_user/show_inform_message', "You must enter the days field");
                    return;
                }
            }

            if (!this.campaign_selector.campaign_uid) {
                this.$store.commit('inform_user/show_inform_message', "You must select a campaign");
                return;
            }

            if (this.selected_action_type === 'Email' && !this.selected_templates.length) {
                this.$store.commit('inform_user/show_inform_message', "You must select a template");
                return;
            }

            if (!this.selected_before_after.length) {
                this.$store.commit('inform_user/show_inform_message', "You must select from the before/after list");
                return;
            }

            if (!this.selected_target_date.length) {
                this.$store.commit('inform_user/show_inform_message', "You must select a date");
                return;
            }

            if (this.selected_action_type === 'Email' && !this.email_subject.trim().length) {
                this.$store.commit('inform_user/show_inform_message', "The subject cannot be blank");
                return;
            }

            if (this.selected_action_type === 'SMS' && !this.sms_message.trim().length) {
                this.$store.commit('inform_user/show_inform_message', "The SMS message cannot be blank");
                return;
            }


            const days_input = this.selected_before_after === 'on' ? 0 : this.days_input;
            const action_type = this.selected_action_type;

            if (this.local_schedules.find(item => {
                return ((item.meta.days_from_target === this.days_input)
                    && ((item.meta.target_date === this.selected_target_date))
                    && (item.meta.before_after_target === this.selected_before_after)
                    && (item.action_type === this.selected_action_type));
            }, this)) {
                this.$store.commit('inform_user/show_inform_message',
                    "You already scheduled an " + action_type + " on that day");
                return;
            }

            this.$store.commit('email/insert_local_schedule', {
                meta: {
                    days_from_target: parseInt(days_input, 10),
                    before_after_target: this.selected_before_after,
                    target_date: this.selected_target_date,
                    template: this.selected_action_type === 'Email' ? _.clone(this.selected_templates) : '',
                    email_subject: this.selected_action_type === 'Email' ? this.email_subject : '',
                    sms: this.selected_action_type === 'SMS' ? this.sms_message : ''
                },
                action_type: this.selected_action_type,
                uid: this.editing_uid ? this.editing_uid : 'TEMP_UID_' + (new Date()).getTime()
            });
            this.editing_uid = null;
        },
        storeSchedules() {
            const data = {
                schedules: this.local_schedules,
                campaign_uid: this.campaign_selector.campaign_uid

            }
            axios.post('/marketing-api/add-schedules-to-campaign', data).then(response => {
                console.log('add-schedules-to-campaign ' + JSON.stringify(response.data));
                this.$store.dispatch('email/get_schedules_for_campaign', this.campaign_selector.campaign_uid);
            }).catch(e => {
                console.log(e);
            });
        },
        show_new_campaign_dialog(visible) {
            this.new_campaign_dialog = visible;
        },
        get_template_selector(brand) {
            const found = this.selected_templates.find(item => item.brand === brand);
            return found ? found.slug : null;
        },
        init_send_test_dialog(brand) {
            this.test_data.subject = this.email_subject;
            this.test_data.template = this.get_template_selector(brand);
            this.test_data.brand = brand;
            this.test_data.send_to = this.live_mode.test_email;
            this.test_data.show_send_test_dialog = true;
            this.test_data.status = "";
            this.api_result = "";
        },
        confirmExitPage() {
            this.$router.push(this.navigate_to);
        },
        cancelExitPage() {
            this.navigate_to = null;
            this.confirm_exit_page = false;
        },

    },
    computed: {
        ...mapState('email', ['selected_campaign_uid', 'contract_types', 'campaigns', 'brands', 'local_schedules', 'server_schedules', 'live_mode', 'local_schedules_edited']),

        selected_target_date_items: function () {
            return ['Moving Date', ...this.contract_types];
        },
        tab_items: function () {
            return this.brands.map(item => {
                return {
                    brand: item.brand, content: '<h1 style="text-align:center">No template selected</h1>'
                }
            });
        }
    },
    created() {
        this.$store.commit('email/delete_all_local_schedules');
        this.listTemplates();
        this.$bus.on('onAddedCampaign', value => {
            this.$bus.emit('reload_campaigns_and_select', value);
        });
        this.$bus.on('emailTestDialogEvent', value => {
            if (!value) {
                this.test_data.show_send_test_dialog = false;
                return;
            }
            this.test_data.status = "nothing_sent";
            if (!this.test_data.residential_lead_uid || !this.test_data.subject || !this.test_data.send_to) {
                this.test_data.status = "failed";
                this.test_data.api_result = "Please complete all fields"
                return;
            }
            const data = {
                residential_lead_uid: this.test_data.residential_lead_uid,
                template: this.test_data.template,
                subject: this.test_data.subject,
                brand: this.test_data.brand,
                email: this.test_data.send_to
            }
            console.log(data);
            axios.post('/marketing-api/test-transmit-campaign-email', data).then(response => {
                console.log('test transmit campaign email response: ' + JSON.stringify(response.data));
                this.test_data.status = response.data.status;
                this.test_data.api_result = response.data.api_result;
            }).catch(e => {
                console.log(e);
            });
        })
    },

    beforeDestroy() {
        this.$bus.$off('onAddedCampaign');
        this.$bus.$off('emailTestDialogEvent');
    },
    watch:
        {
            'campaign_selector.campaign_uid': function (val) {
                if (!val)
                    return;
                this.$store.dispatch('email/get_schedules_for_campaign', this.campaign_selector.campaign_uid);
            },
            'edit_selector.edit_schedule_uid': function (schedule) {
                this.editing_uid = schedule.uid;
                this.selected_templates.length = 0;
                this.selected_before_after = schedule.meta.before_after_target;
                this.selected_target_date = schedule.meta.target_date;
                this.selected_action_type = schedule.action_type;
                this.days_input = schedule.meta.days_from_target;
                this.days_input_disabled = this.selected_before_after === "on";
                if (schedule.action_type === "SMS")
                    this.sms_message = schedule.meta.sms;
                else {
                    this.email_subject = schedule.meta.email_subject;
                    this.brands.forEach(brand => {
                        this.selected_brand = brand.brand;
                        const slug = (schedule.meta.template.find(item => item.brand === brand.brand));
                        if (slug) {
                            this.select_template(slug.slug)
                        }
                    })
                }
                this.$store.commit('email/delete_local_schedule', schedule.uid);
            }
        },
    //TODO ml 23/2/2021 - warn before exit if edited?
    beforeRouteLeave(to, from, next) {
        if (!this.navigate_to) {
            if (this.local_schedules_edited) {
                this.navigate_to = to;
                this.confirm_exit_page = true;
            } else
                next();
        } else
            next();
    },

}
</script>

<style scoped>

.zoom-template {
    transform: scale(0.8);
    transform-origin: top left;
}


</style>
