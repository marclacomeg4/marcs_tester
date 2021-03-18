<template>
    <stat-panel :loading="loading">
        <v-card-title class="pa-0">{{title}}</v-card-title>

        <apexchart type="bar" height="300" :options="computedChartOptions"
                   :series="computedSeries" v-if="ready"></apexchart>
    </stat-panel>
</template>

<script>
    import BrandChip from "g4-components/Chips/BrandChip";
    import PageLoader from "g4-components/Layout/PageLoader";
    import StatNumber from "../../Components/Stats/StatNumber";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";

    export default {
        name: 'calls-per-user-per-hour-chart',
        template: 'calls-per-user-per-hour-chart',
        components: {StatPanel, StatNumber, BrandChip, PageLoader},
        mixins: [stat_panel],
        props: {duration: {default: false}, team_id: {required:true}, title:{required:true}},
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
                    endpoint: 'stats_calls_by_team_by_hour',
                    fields: ['stats'],
                    params: {
                        time_between: this.$store.getters['date_range/date_range'],
                        team_id: this.team_id
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('CDR Team Call Per Hour Stats', response);

                        this.statistics = _.toArray(response.stats);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.loading = false;

                        this.ready = true;
                    })
            }
        },

        computed: {
            computedSeries() {
                if (this.duration) {
                    return [{
                        name: 'Inbound Count',
                        data: this.statistics.map(function (obj) {
                            return obj.inbound_duration;
                        }),
                    },
                        {
                            name: 'Outbound Count',
                            data: this.statistics.map(function (obj) {
                                return obj.outbound_duration;
                            }),
                        },
                        {
                            name: 'Internal Count',
                            data: this.statistics.map(function (obj) {
                                return obj.internal_duration;
                            }),
                        }];
                } else {
                    return [{
                        name: 'Inbound Count',
                        data: this.statistics.map(function (obj) {
                            return obj.inbound_count;
                        }),
                    },
                        {
                            name: 'Outbound Count',
                            data: this.statistics.map(function (obj) {
                                return obj.outbound_count;
                            }),
                        },
                        {
                            name: 'Internal Count',
                            data: this.statistics.map(function (obj) {
                                return obj.internal_count;
                            }),
                        }];
                }
            },

            computedChartOptions() {
                return {
                    colors: [COLOR_GREEN, COLOR_RED, COLOR_BLUE],
                    chart: {
                        height: 250,
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
                            return obj.hour;
                        }),
                        labels: {
                            show: true,
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
