<template>
    <stat-panel :loading="loading">

        <payment-transactions-dialog :display_dialog="dialog"
                                     :init_query="query"
                                     @closePaymentTransactionsDrilldown="dialog = false"></payment-transactions-dialog>

        <v-card-title class="pa-0">{{displayTitle}}</v-card-title>

        <v-tooltip>
            <template v-slot:activator="{ on, attrs }">
                <v-card-subtitle class="pa-0" v-on="on">{{displaySubTitle}}</v-card-subtitle>
            </template>
        </v-tooltip>

        <v-row v-if="statistics">
            <v-col cols="12">
                    <span @click="requestDrilldown()">
                    <stat-number :number="displayNumber"></stat-number>
                    </span>
            </v-col>
        </v-row>
    </stat-panel>
</template>

<script>
    import StatNumber from "../../Components/Stats/StatNumber";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";
    import PaymentTransactionsDialog from "../../Drilldowns/Finance/PaymentTransactionsDialog";

    export default {
        name: 'payment-transactions-total',
        template: 'payment-transactions-total',
        components: {PaymentTransactionsDialog, StatPanel, StatNumber},
        mixins: [stat_panel],
        props: {count: {default: false}, transaction_type: {default: null}, affinity_team_id: {default: null}, user_id: {default: null}},
        data() {
            return {
                dialog: false,
                loading: false,
                statistics: {
                    payment_transactions_amount_pence_sum: 0,
                    payment_transactions_count: 0
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

                this.query.params.transaction_type = (this.transaction_type) ? this.transaction_type : null;

                this.query.params.affinity_team_id = (this.affinity_team_id) ? this.affinity_team_id : null;

                this.query.params.user_id = (this.user_id) ? this.user_id : null;

                this.dialog = true;
            },

            /**
             * Get the statistics, must have this function, obvs
             */
            getStatistics() {
                this.loading = true;

                let params = {
                    created_between: this.$store.getters['date_range/date_range'],
                    transaction_type: this.transaction_type,
                    affinity_team_id: this.affinity_team_id,
                    user_id: this.user_id
                }

                let request = {
                    endpoint: 'stats_payment_transactions_total',
                    fields: ['stats'],
                    params: params
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Stats Payment Transaction', response);

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

        computed: {
            displayNumber() {
                if (this.count) return this.statistics.payment_transactions_count.toLocaleString();

                return '£' + parseInt(this.statistics.payment_transactions_amount_pence_sum / 100).toLocaleString();
            },

            displayTitle() {
                if (this.transaction_type === 'repeat') return 'Repeat Payments';

                if (this.transaction_type === 'payment') return 'Single Payments';

                return 'Payment Transactions'
            },
            displaySubTitle() {
                if (this.affinity_team_id) return 'Team: ' + affinity_manager.teams_manager().getTeamByID(this.affinity_team_id).team_name;

                if (this.user_id) return 'User ID: ' + this.user_id;

                return 'All Successful Payments';
            }
        },

        created() {
            this.getStatistics();
        }
    }
</script>
