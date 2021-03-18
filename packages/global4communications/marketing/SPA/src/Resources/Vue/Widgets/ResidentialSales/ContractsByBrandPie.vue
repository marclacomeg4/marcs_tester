<template>
    <stat-panel :loading="loading">
        <v-card-title class="pa-0">Contracts by Brand</v-card-title>

        <apexchart type="pie" height="300" :options="computedChartOptions"
                   :series="computedSeries" v-if="ready"></apexchart>
    </stat-panel>
</template>

<script>
    import PageLoader from "g4-components/Layout/PageLoader";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";

    export default {
        name: 'contracts-by-brand-pie',
        template: 'contracts-by-brand-pie',
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
                    endpoint: 'stats_contracts_by_brand',
                    fields: ['stats'],
                    params: {
                        ordered_between: this.$store.getters['date_range/date_range'],
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('CDR Contracts by Brand', response);

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
                    parseInt(this.statistics.HT_contract_count),
                    parseInt(this.statistics.FL_contract_count),
                    parseInt(this.statistics.WB_contract_count),
                    parseInt(this.statistics.PB_contract_count)
                ]
            },

            computedChartOptions() {
                return {
                    colors: [COLOR_HT, COLOR_FL, COLOR_WB, COLOR_PB],
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
                        'Home Telecom',
                        'Fleur Telecom',
                        'Weekly Broadband',
                        'Perfect Broadband',
                    ],
                }
            }
        },
        created() {
            this.getStatistics();
        }
    }
</script>
