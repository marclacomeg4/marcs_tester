<template>
    <span>
        <v-row>
            <v-col class="pt-0">
                <v-toolbar dark dense color="primary">
                    <v-toolbar-title>
                        Campaign Schedules
                    </v-toolbar-title>
 <DemoDisplay></DemoDisplay>
                </v-toolbar>
            </v-col>
        </v-row>
    <v-row>
        <v-col>
            <v-dialog max-width="80%" v-model="show_inspect">
                <v-card>
            <v-toolbar-title class="text-right title pl-0">
                <v-icon @click="show_inspect=false">mdi-close-box</v-icon>
            </v-toolbar-title>
                    <ScheduleActionTable :actions="action_to_inspect"  :hide_inspect=true></ScheduleActionTable>
                </v-card>
            </v-dialog>
        </v-col>
                <v-col cols="3">
                    <p>Select Date Range</p>
                    <span class="mx-2">{{ displayDateRange }}</span>
                    <date-range icon :dateRangeSelected.sync="dateRange"></date-range>
                </v-col>
                <v-col cols>
                    <CampaignSelector
                        v-bind.sync="search"
                        :selectAllCampaigns="true"
                    ></CampaignSelector>
                </v-col>
                <v-col>
                    <AutoCompleteResidentialLeads
                        :parentDisable="!search.show_leads_mode"
                        @onLeadSelected="changeLeadSelected">
                    </AutoCompleteResidentialLeads>
                </v-col>
                <v-col>
                    <v-select
                        label="Status"
                        :disabled="!search.show_leads_mode"
                        v-model="selected_action_status"
                        multiple
                        :items="action_status">
                    </v-select>
                </v-col>
                <v-col cols>
                    <v-switch
                        v-model="show_leads_mode"
                        inset
                        label="Show Leads"
                    ></v-switch>
                </v-col>
                <v-col>
                    <v-btn fab dark small color="primary" class="ma-2 mt-4" :loading="loading"
                           @click="getCampaignHistory">
                        <v-icon>search</v-icon>
                    </v-btn>

                    <v-btn fab dark small color="primary" class="ma-2 mt-4" @click="download" :loading="downloading">
                        <v-icon>cloud_download</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col col="12">
                    <v-card-text class="mt-4">
                        <v-row>
                            <v-col>
                                <v-data-table
                                    :headers="getTableColumns()"
                                    disable-sort
                                    :items="campaign_history"
                                    :options.sync="options"
                                    :server-items-length="server_total_rows"
                                    :loading="loading"
                                    :footer-props="{'items-per-page-options': [10, 25, 50 ,100, 250]}"
                                >
                                    <template v-slot:item.residentialLead.status.intended_brand="{ item }">
                                        <brand-fab v-if="item.residentialLead"
                                                   :brand_prefix="item.residentialLead.status.intended_brand"></brand-fab>
                                    </template>

                                    <template v-slot:item.residentialLead.json_subscribed="{ item }">
                                        <tick-icon v-if="item.residentialLead" :positive=" item.residentialLead.json_subscribed"></tick-icon>
                                    </template>

                                    <template v-slot:item.uid="{ item }">
                                        <v-menu offset-y>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs"
                                                        v-on="on">more_vert
                                                </v-icon>
                                            </template>
                                            <v-list>
                                                <v-list-item
                                                    @click="inspect(item)">
                                                    <v-list-item-title>
                                                        Inspect
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-col>
            </v-row>
</span>
</template>

<script>
import DateRange from "g4-components/Form/DateRange";
import {mapState, mapGetters} from 'vuex';
import AutoCompleteResidentialLeads from "../Components/Form/AutoCompleteResidentialLeads"
import CampaignSelector from "../Components/Form/CampaignSelector";
import ScheduleActionTable from "../Components/ScheduleActionTable";

export default {
    name: "CampaignHistory",
    components: {DateRange, AutoCompleteResidentialLeads, CampaignSelector, ScheduleActionTable},
    data() {
        return {
            loading: false,
            downloading: false,
            campaign_history: [],
            server_total_rows: null,
            options: {
                itemsPerPage: 10,
                page: 1,
                order_by: [{field: 'ACTION_DATE', order: 'ASC'}]
            },
            search: {
                dateRange: {from: '', to: ''},
                show_leads_mode: false,
                campaign_uid: null,
                selected_lead_uid: null,
                action_status: []
            },
            download_setup: {
                filename: 'Campaign History',
                columns: this.campaign_history ? this.getTableColumns() : null
            },
            show_leads_mode: false,
            action_status: ['complete', 'failed', 'pending', 'skipped'],
            selected_action_status: ['complete', 'failed', 'pending', 'skipped'],
            show_inspect: false,
            action_to_inspect: null
        }
    },
    methods: {
        getTableColumns() {
            let return_val =
                [
                    {
                        text: 'date',
                        value: 'action_date'
                    },
                    {
                        text: 'action',
                        value: 'action_type'
                    }
                ];

            if ((this.search.show_leads_mode) && (!this.search.campaign_uid)) {
                return_val = [...return_val,
                    {
                        text: 'campaign',
                        value: 'marketingCampaign.meta.campaign_name'
                    }
                ]
            }
            if (this.search.show_leads_mode) {

                return_val = [...return_val,
                    ...[{
                        text: 'name',
                        value: 'residentialLead.full_name'

                    },
                        {
                            text: 'email',
                            value: 'residentialLead.email'

                        },
                        {
                            text: 'brand',
                            value: 'residentialLead.status.intended_brand'

                        }
                    ],
                ];
            } else {
                return_val = [...return_val,
                    {
                        text: 'total',
                        value: 'total'
                    },
                    {
                        text: 'complete',
                        value: 'complete_count'
                    },
                    {
                        text: 'pending',
                        value: 'pending_count'
                    },
                    {
                        text: 'skipped',
                        value: 'skipped_count'
                    },
                    {
                        text: 'failed',
                        value: 'failed_count'
                    }
                ]
            }
            if (this.search.show_leads_mode) {
                return_val = [...return_val,
                    {
                        text: 'status',
                        value: 'status'
                    },
                    {
                        text: 'subscribed',
                        value: 'residentialLead.json_subscribed'
                    },
                ];
                if (this.selected_action_status.indexOf('failed') !== -1) {
                    return_val = [...return_val,
                        {
                            text: 'receipt',
                            value: 'meta_api_result'
                        }
                    ]
                }
                return_val = [...return_val, {
                    text: '',
                    value: 'uid'
                }]
            }
            return return_val;
        },
        getRequest() {
            let query = {};
            query.endpoint = 'campaign_history';


            query.fields = ['status', 'total', 'action_date', 'action_type',
                'complete_count', 'pending_count', 'failed_count', 'skipped_count', 'meta_api_result',
                'meta{api_result, template, email_subject, sms}',
                'residentialLead{full_name, email, uid, json_subscribed, status{unsubscribed, unsubscribed_date, intended_brand}}',
                'marketingCampaign{meta}',
                'telesalesOpportunityCriteria{name}'
            ];

            let search_action_status = {};
            this.selected_action_status.forEach(item => {
                search_action_status[item] = true
            });

            this.search = {...this.search, dateRange: {...this.dateRange}};
            if (Object.keys(search_action_status).length)
                this.search['action_status'] = search_action_status;
            else
                delete this.search['action_status'];

            query.params = {...this.search};
            query.paginate = {first: this.options.itemsPerPage, page: this.options.page};
            query.relations = {};
            query.order_by = this.options.order_by;
            return query;
        },
        download() {
            if (!this.campaign_history)
                return;
            this.downloading = true;

            if (this.download_setup.columns === null)
                this.download_setup.columns = this.getTableColumns().filter(item=>item.text.length);

            console.log('setup ' + JSON.stringify(this.download_setup));
            this.$graph.download(this.getRequest(), this.download_setup)
                .then((response) => {
                    console.log('DOWNLOAD', response);
                }).finally(() => {
                this.downloading = false
            });
        },
        getCampaignHistory() {
            if (this.show_leads_mode !== this.search.show_leads_mode) {
                this.options = {
                    itemsPerPage: 10,
                    page: 1,
                    order_by: [{field: 'ACTION_DATE', order: 'ASC'}]
                };
                this.search.show_leads_mode = this.show_leads_mode;
            }
            this.loading = true;
            const query = this.getRequest();

            graph.getEndPointQuery(query)
                .then((response) => {
                    console.log('Get campaign history:', response);

                    this.campaign_history = response.data;
                    this.server_total_rows = response.paginatorInfo.total;

                })
                .catch((error) => {
                    console.log('GET marketing_campaign_search ERROR:', error);
                })
                .finally(() => {
                    this.loading = false;
                })
        },
        changeLeadSelected(uid) {
            this.search.selected_lead_uid = uid;
        },
        inspect(item) {
            this.action_to_inspect = [item];
            this.show_inspect = true;
        }
    },
    computed: {
        ...mapState('email', ['campaigns']),
        campaigns_list() {
            return [{uid: null, campaign_name: 'All Campaigns'}, ...this.campaigns]
        },
        displayDateRange() {
            let date = '';

            if (_.isNull(this.dateRange.from)) return date;

            date += this.$presenter.dateHuman(this.dateRange.from);

            if (!_.isNull(this.dateRange.to)) date += ' - ' + this.$presenter.dateHuman(this.dateRange.to);

            return date;
        },
        dateRange: {
            get() {
                return this.$store.getters['date_range/date_range']

            },
            set(new_date_range) {
                return this.$store.dispatch('date_range/dateRange', new_date_range)
            }
        },
        isEnabled() {
            return true;
        }
    },
    watch: {
        options: {
            handler() {
                this.getCampaignHistory();
            }
        },
        deep: true
    },


}
</script>

<style scoped>

</style>
