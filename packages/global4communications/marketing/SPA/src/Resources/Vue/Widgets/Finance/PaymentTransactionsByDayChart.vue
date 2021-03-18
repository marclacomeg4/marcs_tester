<template>
    <stat-panel :loading="loading">
        <v-card-title class="pa-0">{{displayTitle}}</v-card-title>

        <apexchart type="bar" height="300" :options="computedChartOptions"
                   :series="computedSeries" v-if="ready"></apexchart>
    </stat-panel>
</template>

<script>
    import PageLoader from "g4-components/Layout/PageLoader";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";

    export default {
        name: 'payment-transactions-by-day-chart',
        template: 'payment-transactions-by-day-chart',
        components: {StatPanel, PageLoader},
        mixins: [stat_panel],
        props: {transaction_type: {default: null}, affinity_team_id: {default: null}, user_id: {default: null}},
        data() {
            return {
                ready: false,
                loading: false,
                statistics: []
            }
        },

        methods: {
            getStatistics() {
                this.loading = true;

                let request = {
                    endpoint: 'stats_payment_transactions_by_day_chart',
                    fields: ['stats'],
                    params: {
                        created_between: this.$store.getters['date_range/date_range'],
                        transaction_type: this.transaction_type,
                        affinity_team_id: this.affinity_team_id,
                        user_id: this.user_id
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('CDR payments by day', response);

                        this.statistics = _.toArray(response.stats);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.loading = false;

                        this.ready = true;
                    })
            },
        },

        computed: {
            displayTitle() {
                if (this.affinity_team_id) return 'Payment Transactions for Team: ' + affinity_manager.teams_manager().getTeamByID(this.affinity_team_id).team_name;

                if (this.user_id) return 'Payment Transactions per Day for User ID: ' + this.user_id;

                return 'Payment Transactions per Day';
            },

            computedSeries() {
                return [
                    {
                        name: 'Home Telecom',
                        data: this.statistics.map(function (obj) {
                            return parseInt(obj.payments_hometelecom_sum);
                        }),

                    },
                    {
                        name: 'Weekly Broadband',
                        data: this.statistics.map(function (obj) {
                            return parseInt(obj.payments_weeklybroadband_sum);
                        }),

                    },
                    {
                        name: 'Fleur Broadband',
                        data: this.statistics.map(function (obj) {
                            return parseInt(obj.payments_fleurtelecom_sum);
                        }),

                    },
                    {
                        name: 'Perfect Broadband',
                        data: this.statistics.map(function (obj) {
                            return parseInt(obj.payments_perfectbroadband_sum);
                        }),

                    }
                ]
            },

            computedChartOptions() {
                return {
                    colors: [COLOR_HT, COLOR_WB, COLOR_FL, COLOR_PB],
                    chart: {
                        type: 'bar',
                        stacked: true
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        enabled: true,
                        theme: "dark"
                    },
                    xaxis: {
                        categories: this.statistics.map(function (obj) {
                            return obj.date;
                        }),
                        labels: {
                            show: true,
                            rotate: 0
                        }
                    }
                }
            }
        },


        created() {
            this.getStatistics();
        }
    }
</script>
