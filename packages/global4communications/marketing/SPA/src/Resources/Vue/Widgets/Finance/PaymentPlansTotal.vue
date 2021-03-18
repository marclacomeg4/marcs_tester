<template>
    <stat-panel :loading="loading">

       <payment-plans-dialog :display_dialog="dialog"
                              :init_query="query"
                              @closePaymentPlansDrilldown="dialog = false"></payment-plans-dialog>

        <v-card-title class="pa-0">Payment Plans</v-card-title>

        <v-tooltip>
            <template v-slot:activator="{ on, attrs }">
                <v-card-subtitle class="pa-0" v-on="on">{{displaySubTitle}}</v-card-subtitle>
            </template>
        </v-tooltip>

        <v-row v-if="statistics">
            <v-col cols="12">
                    <span @click="requestDrilldown()">
                    <stat-number :number="statistics.total.toLocaleString()"></stat-number>
                    </span>
            </v-col>
        </v-row>
    </stat-panel>
</template>

<script>
    import StatNumber from "../../Components/Stats/StatNumber";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";
    import PaymentPlansDialog from "../../Drilldowns/Finance/PaymentPlansDialog";

    export default {
        name: 'payment-plans-total',
        template: 'payment-plans-total',
        components: {PaymentPlansDialog, StatPanel, StatNumber},
        mixins: [stat_panel],
        props: {affinity_team_id:{default:null}, user_id: {default: null}},
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
            requestDrilldown() {
                this.query.params.created_between = this.$store.getters['date_range/date_range'];

                this.query.params.affinity_team_id = this.affinity_team_id;

                this.query.params.user_id = (this.user_id) ? this.user_id : null;

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
                    endpoint: 'stats_payment_plans_total',
                    fields: ['stats'],
                    params: params
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Stats Payment Plans', response);

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

                return 'All Payment Plans';
            }
        },

        created() {
            this.getStatistics();
        }
    }
</script>
