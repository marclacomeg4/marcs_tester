<template>
    <stat-panel :loading="loading">

        <leads-dialog  :display_dialog="dialog"
                       :init_query="query"
                       @closeLeadsDrilldown="dialog = false"></leads-dialog>

        <v-card-title class="pa-0">Leads</v-card-title>

        <v-tooltip>
            <template v-slot:activator="{ on, attrs }">
                <v-card-subtitle class="pa-0" v-on="on">Leads that have passed quarantine</v-card-subtitle>
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
                    <span @click.prevent="requestDrilldown('broadband')">
                         <lead-optin-chip optin="broadband"
                                                      :value="statistics.optin_broadband_count"></lead-optin-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('mobile')">
                           <lead-optin-chip optin="mobile"
                                                        :value="statistics.optin_mobile_count"></lead-optin-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('energy')">
                           <lead-optin-chip optin="energy"
                                                        :value="statistics.optin_energy_count"></lead-optin-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1 mb-8">
                      <span @click.prevent="requestDrilldown('sky')">
                           <lead-optin-chip optin="sky"
                                                        :value="statistics.optin_sky_count"></lead-optin-chip>
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
    import LeadsDialog from "../../Drilldowns/ResidentialSales/Leads/LeadsDialog";
    import LeadOptinChip from "../../Components/Chips/LeadOptinChip";

    export default {
        name: 'leads-total',
        template: 'leads-total',
        components: {LeadOptinChip, LeadsDialog, StatPanel, StatNumber, BrandChip, PageLoader},
        mixins: [stat_panel],
        props: {

        },
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
            requestDrilldown(optin) {
                this.query.params.created_between = this.$store.getters['date_range/date_range'];

                this.query.params.has_optin = (optin) ? optin: null;

                this.dialog = true;
            },

            /**
             * Get the statistics, must have this function, obvs
             */
            getStatistics() {
                this.loading = true;

                let request = {
                    endpoint: 'stats_leads_total',
                    fields: ['stats'],
                    params: {
                        created_between: this.$store.getters['date_range/date_range']
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Stats Residential Leads', response);

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
