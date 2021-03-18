<template>
    <stat-panel :loading="loading">
        <v-card-title class="pa-0">Contracts by Type</v-card-title>

        <apexchart type="pie" height="300" :options="computedChartOptions"
                   :series="computedSeries" v-if="ready"></apexchart>
    </stat-panel>
</template>

<script>
    import PageLoader from "g4-components/Layout/PageLoader";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";

    export default {
        name: 'contracts-by-type-pie',
        template: 'contracts-by-type-pie',
        components: {StatPanel, PageLoader},
        mixins: [stat_panel],
        props: {},
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
                    endpoint: 'stats_contracts_by_type',
                    fields: ['stats'],
                    params: {
                        ordered_between: this.$store.getters['date_range/date_range'],
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('CDR Contracts by Type', response);

                        this.statistics = response.stats;
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
            computedSeries() {
                return [
                    parseInt(this.statistics.broadband_monthly_contract_count),
                    parseInt(this.statistics.broadband_weekly_contract_count),
                    parseInt(this.statistics.sky_tv_contract_count),
                    parseInt(this.statistics.sim_only_contract_count)
                ]
            },

            computedChartOptions() {
                return {
                    chart: {
                        type: 'pie',
                    },
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        enabled: true,
                    },
                    labels: [
                        'Monthly Broadband',
                        'Weekly Broadband',
                        'Sky TV',
                        'SIM Only',
                    ],
                }
            }
        },
        created() {
            this.getStatistics();
        }
    }
</script>
