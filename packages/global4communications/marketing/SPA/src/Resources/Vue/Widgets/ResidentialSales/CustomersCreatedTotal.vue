<template>
    <stat-panel :loading="loading">

        <customer-dialog :display_dialog="dialog"
                       :init_query="query"
                       @closeCustomersDrilldown="dialog = false"></customer-dialog>

        <v-card-title class="pa-0">Customers Created</v-card-title>

        <v-tooltip>
            <template v-slot:activator="{ on, attrs }">
                <v-card-subtitle v-on="on" class="pa-0">New Customers</v-card-subtitle>
            </template>
            <span>Customers that have been created today</span>
        </v-tooltip>


        <v-row v-if="statistics">
            <v-col cols="8">
                    <span @click="requestDrilldown()">
                    <stat-number :number="statistics.total_count"></stat-number>
                    </span>
            </v-col>

            <v-col cols="4">
                <v-row>
                    <v-col class="text-center py-1">
                    <span @click.prevent="requestDrilldown('HT')">
                        <brand-chip brand_prefix="HT" :text="statistics.HT_count"></brand-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('FL')">
                        <brand-chip brand_prefix="FL" :text="statistics.FL_count"></brand-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('WB')">
                        <brand-chip brand_prefix="WB" :text="statistics.WB_count"></brand-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('PB')">
                        <brand-chip brand_prefix="PB" :text="statistics.PB_count"></brand-chip>
                    </span>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </stat-panel>
</template>

<script>
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import CustomerDialog from "../../Drilldowns/ResidentialSales/Customers/CustomerDialog";

    export default {
        name: 'customers-created-total',
        components: {CustomerDialog},
        template: 'customers-created-total',
        mixins: [stat_panel],
        props: {},
        data() {
            return {
                dialog: false,
                loading: false,
                statistics: {
                    total_count: 0,
                    HT_count: 0,
                    FL_count: 0,
                    WB_count: 0,
                    PB_count: 0
                },
                query: {params: {}}
            }
        },
        methods: {
            /**
             * Open the dialog with the query
             */
            requestDrilldown(brand) {
                this.query.params.created_between = this.$store.getters['date_range/date_range'];

                this.query.params.brand = (brand) ? brand : null;

                this.query.params.is_customer = true;

                this.dialog = true;
            },

            /**
             * Get the statistics, must have this function, obvs
             */
            getStatistics() {
                this.loading = true;

                let request = {
                    endpoint: 'stats_customers_created_total',
                    fields: ['stats'],
                    params: {
                        created_between: this.$store.getters['date_range/date_range']
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('stats_customers_created_total', response);

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
