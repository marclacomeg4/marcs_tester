<template>
    <stat-panel :loading="loading">
        <v-card-title class="pa-0">Calls Results</v-card-title>

        <apexchart type="pie" height="300" :options="computedChartOptions"
                   :series="computedSeries" v-if="ready"></apexchart>
    </stat-panel>
</template>

<script>
    import PageLoader from "g4-components/Layout/PageLoader";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";

    export default {
        name: 'telesales-calls-results-pie',
        template: 'telesales-calls-results-pie',
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
                    endpoint: 'stats_telesales_calls_result',
                    fields: ['stats'],
                    params: {
                        scheduled_between: this.$store.getters['date_range/date_range'],
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Stats Telesales calls result', response);

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
                    parseInt(this.statistics.not_interested_count),
                    parseInt(this.statistics.do_not_contact_count),
                    parseInt(this.statistics.expired_count),
                    parseInt(this.statistics.signed_up_count)
                ]
            },

            computedChartOptions() {
                return {
                    colors: [COLOR_ORANGE, COLOR_PURPLE, COLOR_RED, COLOR_GREEN],
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
                        'Not Interested',
                        'Do Not Contact',
                        'Expired',
                        'Signed Up',
                    ],
                }
            }
        },
        created() {
            this.getStatistics();
        }
    }
</script>
