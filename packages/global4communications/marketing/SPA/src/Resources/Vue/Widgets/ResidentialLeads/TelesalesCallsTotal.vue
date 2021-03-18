<template>
    <stat-panel :loading="loading">

        <telesales-calls-dialog :display_dialog="dialog"
                                :init_query="query"
                                @closeTelesalesCallsDrilldown="dialog = false"></telesales-calls-dialog>

        <v-card-title class="pa-0">{{variation.title}}</v-card-title>

        <v-tooltip>
            <template v-slot:activator="{ on, attrs }">
                <v-card-subtitle class="pa-0" v-on="on">{{variation.sub_title}}</v-card-subtitle>
            </template>
        </v-tooltip>

        <v-row v-if="statistics">
            <v-col cols="8">
                    <span @click="requestDrilldown()">
                    <stat-number :number="statistics.total"></stat-number>
                    </span>
            </v-col>

            <v-col cols="4">
                <v-row>
                    <v-col class="text-center py-1">
                       <span @click.prevent="requestDrilldown('pending')">
                            <telesales-calls-status-chip status="pending"
                                                         :value="statistics.pending_count"></telesales-calls-status-chip>
                     </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                       <span @click.prevent="requestDrilldown('started')">
                             <telesales-calls-status-chip status="started"
                                                          :value="statistics.started_count"></telesales-calls-status-chip>
                     </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                       <span @click.prevent="requestDrilldown('completed')">
                           <telesales-calls-status-chip status="completed"
                                                        :value="statistics.completed_count"></telesales-calls-status-chip>
                     </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                       <span @click.prevent="requestDrilldown('call_back')">
                           <telesales-calls-status-chip status="call_back"
                                                        :value="statistics.call_back_count"></telesales-calls-status-chip>
                     </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                       <span @click.prevent="requestDrilldown('')">
                           <telesales-calls-status-chip status="unspecified"
                                                        :value="statistics.unspecified_count"></telesales-calls-status-chip>
                     </span>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </stat-panel>
</template>

<script>
    import BrandChip from "g4-components/Chips/BrandChip";
    import PageLoader from "g4-components/Layout/PageLoader";
    import StatNumber from "../../Components/Stats/StatNumber";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";
    import LeadsQuarantineDialog from "../../Drilldowns/ResidentialSales/Leads/LeadsQuarantineDialog";
    import LeadQuarantineStatusChip from "../../Components/Chips/LeadQuarantineStatusChip";
    import TelesalesCallsDialog from "../../Drilldowns/ResidentialSales/Leads/TelesalesCallsDialog";
    import TelesalesCallsStatusChip from "../../Components/Chips/TelesaleCallsStatusChip";

    export default {
        name: 'telesales-calls-total',
        template: 'telesales-calls-total',
        components: {
            TelesalesCallsStatusChip,
            TelesalesCallsDialog,
            LeadQuarantineStatusChip, LeadsQuarantineDialog, StatPanel, StatNumber, BrandChip, PageLoader
        },
        mixins: [stat_panel],
        props: {type: {default: 'scheduled'}},
        data() {
            return {
                dialog: false,
                loading: false,
                statistics: {
                    total: 0
                },
                query: {params: {}}
            }
        },
        methods: {
            /**
             * Open the dialog with the query
             */
            requestDrilldown(status) {
                this.query.params = this.variation.params;

                this.query.params.status = (status) ? status : null;

                this.dialog = true;
            },

            /**
             * Get the statistics, must have this function, obvs
             */
            getStatistics() {
                this.loading = true;

                let request = {
                    endpoint: 'stats_telesales_calls_total',
                    fields: ['stats'],
                    params: this.variation.params
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Stats Residential Telesales Calls', response);

                        this.statistics = response.stats;
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            }
        },

        created() {
            this.getStatistics();
        },

        computed: {
            variation() {
                switch (this.type) {
                    case 'scheduled':
                        return {
                            params: {
                                scheduled_between: this.$store.getters['date_range/date_range']
                            },
                            title: 'Calls Scheduled',
                            sub_title: 'Calls that are scheduled during period'
                        };

                    case 'created':
                        return {
                            params: {
                                created_between: this.$store.getters['date_range/date_range']
                            },
                            title: 'Calls Created',
                            sub_title: 'Calls that are created during period'
                        };
                }
            }
        }
    }
</script>
