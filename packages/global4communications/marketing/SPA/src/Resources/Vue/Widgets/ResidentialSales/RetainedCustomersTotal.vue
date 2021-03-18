<template>
    <stat-panel :loading="loading">

        <retained-customers-dialog :display_dialog="dialog"
                                   :init_query="query"
                                   @closeRetainedCustomersDrilldown="dialog = false"></retained-customers-dialog>

        <v-card-title class="pa-0">{{displayTitle}}</v-card-title>

        <v-tooltip>
            <template v-slot:activator="{ on, attrs }">
                <v-card-subtitle class="pa-0" v-on="on">{{displaySubTitle}}</v-card-subtitle>
            </template>
        </v-tooltip>

        <v-row v-if="displayValue">
            <v-col cols="12">
                      <span @click="requestDrilldown()">
                    <stat-number :number="displayValue.toLocaleString()"></stat-number>
                    </span>
            </v-col>
        </v-row>
    </stat-panel>
</template>

<script>

    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import RetainedCustomersDialog from "../../Drilldowns/ResidentialSales/Customers/RetainedCustomersDialog";

    export default {
        name: 'retained-customers-total',
        components: {RetainedCustomersDialog},
        template: 'retained-customers-total',
        mixins: [stat_panel],
        props: {
            user_field_customer_or_ticket_status: {required: false}
        },
        data() {
            return {
                dialog: false,
                loading: false,
                statistics: null,
                query: {params: {}}
            }
        },
        methods: {
            /**
             * Open the dialog with the query
             */
            requestDrilldown() {
                this.query.params.created_between = this.$store.getters['date_range/date_range'];

                this.query.params.retained_customer = true;

                this.query.params.user_field_customer_or_ticket_status = this.user_field_customer_or_ticket_status;

                this.dialog = true;
            },

            /**
             * Get the statistics, must have this function, obvs
             */
            getStatistics() {
                this.loading = true;

                let params = {
                    created_between: this.$store.getters['date_range/date_range']
                }

                let request = {
                    endpoint: 'stats_retained_customers_total',
                    fields: ['stats'],
                    params: params
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('stats_retained_customers_total', response);

                        this.statistics = response.stats;
                    })
                    .catch((error) => {
                        console.log('stats_retained_customers_total', error);
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            }
        },

        computed: {
            displayTitle() {
                switch (this.user_field_customer_or_ticket_status) {
                    case 'saved':
                        return 'Saved Retained';
                    case 'completed':
                        return 'Completed Retained';
                    case 'cancelled':
                        return 'Cancelled Customers';
                    default:
                        return 'Total Retained ';
                }
            },

            displaySubTitle() {
                return 'Retained Customer';
            },

            displayValue() {
                if(_.isNull(this.statistics)) return 0;

                switch (this.user_field_customer_or_ticket_status) {
                    case 'saved':
                        return this.statistics.retained_customers_saved_count;
                    case 'completed':
                        return this.statistics.retained_customers_completed_count;
                    case 'cancelled':
                        return this.statistics.retained_customers_cancelled_count;
                    default:
                        return this.statistics.retained_customers_count;
                }
            }
        },

        created() {
            this.getStatistics();
        }
    }
</script>
