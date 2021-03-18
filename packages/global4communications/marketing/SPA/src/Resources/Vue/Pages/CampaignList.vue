<template>
    <v-row>
        <v-col>
            <v-row>
                <v-col class="pt-0">
                    <v-toolbar dark dense color="primary">
                        <v-toolbar-title>
                            Campaign List
                        </v-toolbar-title>
                        <DemoDisplay></DemoDisplay>                    </v-toolbar>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <CampaignSelector
                        v-bind.sync="campaign_selector"
                        :selectAllCampaigns="true"
                    ></CampaignSelector>
                </v-col>
                    <v-col>
                    <v-btn fab dark small color="primary" class="ma-2 mt-4" :loading="loading"
                           @click="getMarketingCampaigns">
                        <v-icon>search</v-icon>
                    </v-btn>

                    <v-btn fab dark small color="primary" class="ma-2 mt-4" @click="download" :loading="downloading">
                        <v-icon>cloud_download</v-icon>
                    </v-btn>
                </v-col>

            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-card-text class="mt-4">
                        <v-row v-if="marketing_campaigns">
                            <v-col>
                                <v-data-table
                                    :headers="columns"
                                    :items="marketing_campaigns"
                                    :options.sync="options"
                                    :server-items-length="server_total_rows"
                                    :loading="loading"
                                    disable-sort
                                    :footer-props="{'items-per-page-options': [5, 25, 50 ,100, 250]}"
                                >

                                    <template v-slot:item.status="{ item }">
                                        <tick-icon :positive="item.status=='active'"></tick-icon>
                                    </template>

                                    <template v-slot:item.marketingCampaignSchedules="{ item }">
                                        <campaign-schedules-chip
                                            :display_text="item.marketing_campaign_schedules_count"
                                            :campaign_uid="item.uid"
                                        ></campaign-schedules-chip>
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
                                                    @click="toggle_campaign_status(item)">
                                                    <v-list-item-title>
                                                        {{ item.status == 'active' ? 'Deactivate' : 'Activate' }}
                                                    </v-list-item-title>
                                                </v-list-item>
                                                <v-list-item
                                                    @click="edit_campaign_schedules(item)">
                                                    <v-list-item-title>Edit</v-list-item-title>
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
        </v-col>
    </v-row>
</template>

<script>
import CampaignSchedulesChip from "../Components/Chips/CampaignSchedulesChip";
import router from "../../Assets/js/router";
import CampaignSelector from "../Components/Form/CampaignSelector";

export default {
    name: "CampaignList",
    components: {CampaignSchedulesChip, CampaignSelector},
    data() {
        return {
            loading: false,
            downloading: false,
            marketing_campaigns:null,
            server_total_rows:null,
            options: {
                itemsPerPage: 5,
                page: 1,
            sortBy:[]
            },
            download_setup: {
                filename: 'Marketing Campaigns',
                columns: [
                    {text: 'name', value: 'meta.campaign_name'},
                    {text: 'schedules', value: 'marketing_campaign_schedules_count'},
                    {text: 'status', value: 'status'},
                ]
            },
            columns: [
                {text: 'name', value: 'meta.campaign_name'},
                {text: 'schedules', value: 'marketingCampaignSchedules'},
                {text: 'status', value: 'status'},
                {text: '', value: 'uid', 'sortable':false}
            ],
            pagination_options:{},
            campaign_selector: {
                campaign_uid: null
            },
        }
    },
    methods: {
        selectOptions:function(options)
        {
            this.options.page = options.page;
            this.options.G4OrderBy = (options.sortBy.length > 0);
            if(this.options.G4OrderBy)
            {
                this.options.field = options.sortBy[0];
                this.options.order = (options.sortDesc[0]) ? 'DESC' : 'ASC'
            }
            this.pagination_options.page = options.page;
            this.getMarketingCampaigns();
        },
        getRequest(){
            let query = {};
            query.endpoint = 'marketing_campaign_search';

            query.fields = [
                'meta', 'brands', 'uid', 'status', 'marketing_campaign_schedules_count'
            ];
            query.params = {...this.searchParams, ...this.pagination_options};
            query.paginate = {first: this.options.itemsPerPage, page: this.options.page};
            return query;
        },
        getMarketingCampaigns: function () {
            this.loading = true;
            const query = this.getRequest();

            graph.getEndPointQuery(query)
                .then((response) => {
                    console.log('Get marketing campaigns:', response);

                    this.marketing_campaigns = response.data;
                    this.server_total_rows = response.paginatorInfo.total;

                })
                .catch((error) => {
                    console.log('GET marketing_campaign_search ERROR:', error);
                })
                .finally(() => {
                    this.loading = false;
                })
        },

        download: function (name) {
            this.downloading = true;

            if (this.download_setup.columns === null) this.download_setup.columns = this.columns;

            this.$graph.download(this.getRequest(), this.download_setup)
                .then((response) => {
                    console.log('DOWNLOAD', response);
                }).finally(() => {
                this.downloading = false
            });
        },

        toggle_campaign_status: function (item) {
            const data = {campaign_uid: item.uid, status: item.status === 'active' ? 'suspended' : 'active'};
            axios.post('/marketing-api/toggle-campaign-status', data).then(response => {
                this.getMarketingCampaigns();
            }).catch(e => {
                console.log(e);
            });
        },

        edit_campaign_schedules: function (item) {
            this.$router.push({name:'AddCampaignSchedules', params:{campaign_uid:item.uid}});
        },

        getBrands(item)
        {
            console.log(JSON.stringify(item));
        }
    },
    computed: {
        searchParams() {
          return _.cloneDeep(this.campaign_selector);
        }
    },

    watch: {
        options: {
            handler() {
                if (this.options.sortBy.length > 0) {
                    this.pagination_options.G4OrderBy = true;
                    this.pagination_options.field = this.options.sortBy[0];
                    this.pagination_options.order = (this.options.sortDesc[0]) ? 'DESC' : 'ASC';
                }

                this.getMarketingCampaigns();
            }
        },
        deep: true
    },

    created() {
        this.getMarketingCampaigns();
    }
}
</script>

<style scoped>

</style>
