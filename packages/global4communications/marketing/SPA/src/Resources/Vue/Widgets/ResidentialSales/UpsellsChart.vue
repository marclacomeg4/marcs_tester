<template>
    <stat-panel :loading="loading">
        <v-card-title class="pa-0">Upsells</v-card-title>

        <apexchart type="bar" height="300" :options="computedChartOptions"
                   :series="computedSeries" v-if="ready"></apexchart>
    </stat-panel>
</template>

<script>
    import PageLoader from "g4-components/Layout/PageLoader";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";

    export default {
        name: 'upsells-chart',
        template: 'upsells-chart',
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
                    endpoint: 'stats_upsells',
                    fields: ['stats'],
                    params: {
                        ordered_between: this.$store.getters['date_range/date_range'],
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('CDR Upsells', response.stats);

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
                return [{
                    data: [
                        parseInt(this.statistics.fast_track_count),
                        parseInt(this.statistics.upgrade_router_count),
                        parseInt(this.statistics.enhance_care_count),
                        parseInt(this.statistics.weekly_call_package_landline_count),
                        parseInt(this.statistics.weekly_call_package_mobile_count),
                    ]
                }]
            },

            computedChartOptions() {
                return {
                    colors: [COLOR_GREEN, COLOR_RED, COLOR_BLUE, COLOR_YELLOW, COLOR_ORANGE, COLOR_PURPLE],
                    chart: {
                        type: 'bar'
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                            distributed: true
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
                        categories: [
                            'Fast Track',
                            'Router Upgrade',
                            'Enhanced Care',
                            ['Weekly', 'Landline Calls'],
                            ['Weekly', 'Mobile Calls'],
                        ],
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
