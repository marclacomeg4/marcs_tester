<template>
    <stat-panel :loading="loading">

        <direct-debits-dialog :display_dialog="dialog"
                              :init_query="query"
                              @closeDirectDebitsDrilldown="dialog = false"></direct-debits-dialog>

        <v-card-title class="pa-0">Direct Debits</v-card-title>

        <v-tooltip>
            <template v-slot:activator="{ on, attrs }">
                <v-card-subtitle class="pa-0" v-on="on">{{displaySubTitle}}</v-card-subtitle>
            </template>
        </v-tooltip>

        <v-row v-if="statistics">
            <v-col cols="8">
                    <span @click="requestDrilldown()">
                    <stat-number :number="statistics.total_count.toLocaleString()"></stat-number>
                    </span>
            </v-col>

            <v-col cols="4">
                <v-row>
                    <v-col class="text-center py-1">
                    <span @click.prevent="requestDrilldown('HT')">
                        <brand-chip brand_prefix="HT" :text="statistics.HT_direct_debit_count"></brand-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('FL')">
                        <brand-chip brand_prefix="FL" :text="statistics.FL_direct_debit_count"></brand-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('WB')">
                        <brand-chip brand_prefix="WB" :text="statistics.WB_direct_debit_count"></brand-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('PB')">
                        <brand-chip brand_prefix="PB" :text="statistics.PB_direct_debit_count"></brand-chip>
                    </span>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </stat-panel>
</template>

<script>
    import StatNumber from "../../Components/Stats/StatNumber";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";
    import DirectDebitsDialog from "../../Drilldowns/Finance/DirectDebitsDialog";

    export default {
        name: 'direct-debits-total',
        template: 'direct-debits-total',
        components: {DirectDebitsDialog, StatPanel, StatNumber},
        mixins: [stat_panel],
        props: {affinity_team_id:{default:null}, user_id: {default: null}},
        data() {
            return {
                dialog: false,
                loading: false,
                statistics: {
                    total_count: 0
                },
                query: {params: {}}
            }
        },
        methods: {
            /**
             * Open the dialog with the query
             */
            requestDrilldown(brand_prefix) {
                this.query.params.created_between = this.$store.getters['date_range/date_range'];

                this.query.params.affinity_team_id = this.affinity_team_id;

                this.query.params.user_id = (this.user_id) ? this.user_id : null;

                this.query.params.brand = (brand_prefix) ? brand_prefix : null;

                this.dialog = true;
            },

            /**
             * Get the statistics, must have this function, obvs
             */
            getStatistics() {
                this.loading = true;

                let params ={
                    created_between: this.$store.getters['date_range/date_range'],
                    affinity_team_id: this.affinity_team_id,
                    user_id: this.user_id
                }

                let request = {
                    endpoint: 'stats_direct_debits_total',
                    fields: ['stats'],
                    params: params
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Stats Direct Debits', response);

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

        computed:{
            displaySubTitle() {
                if (this.affinity_team_id) return 'Team: ' + affinity_manager.teams_manager().getTeamByID(this.affinity_team_id).team_name;

                if (this.user_id) return 'User ID: ' + this.user_id;

                return 'All Direct Debits';
            }
        },

        created() {
            this.getStatistics();
        }
    }
</script>
