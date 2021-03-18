<template>
    <stat-panel :loading="loading">

        <leads-quarantine-dialog :display_dialog="dialog"
                                 :init_query="query"
                                 @closeLeadsQuarantineDrilldown="dialog = false"></leads-quarantine-dialog>

        <v-card-title class="pa-0">Leads in Quarantine</v-card-title>

        <v-tooltip>
            <template v-slot:activator="{ on, attrs }">
                <v-card-subtitle class="pa-0" v-on="on">All leads that have been provided</v-card-subtitle>
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
                         <lead-quarantine-status-chip status="pending"
                                                      :value="statistics.pending_count"></lead-quarantine-status-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('loaded')">
                           <lead-quarantine-status-chip status="loaded"
                                                        :value="statistics.loaded_count"></lead-quarantine-status-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('duplicate')">
                           <lead-quarantine-status-chip status="duplicate"
                                                        :value="statistics.duplicate_count"></lead-quarantine-status-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('failed')">
                           <lead-quarantine-status-chip status="failed"
                                                        :value="statistics.failed_count"></lead-quarantine-status-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('invalid')">
                          <lead-quarantine-status-chip status="invalid"
                                                       :value="statistics.invalid_count"></lead-quarantine-status-chip>
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

    export default {
        name: 'leads-quarantine-total',
        template: 'leads-quarantine-total',
        components: {LeadQuarantineStatusChip, LeadsQuarantineDialog, StatPanel, StatNumber, BrandChip, PageLoader},
        mixins: [stat_panel],
        props: {},
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
                this.query.params.created_between = this.$store.getters['date_range/date_range'];

                this.query.params.status = (status) ? status : null;

                this.dialog = true;
            },

            /**
             * Get the statistics, must have this function, obvs
             */
            getStatistics() {
                this.loading = true;

                let request = {
                    endpoint: 'stats_leads_quarantine_total',
                    fields: ['stats'],
                    params: {
                        created_between: this.$store.getters['date_range/date_range']
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Stats Residential Leads Quarantine', response);

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
        }
    }
</script>
