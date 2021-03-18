<template>
    <stat-panel :loading="loading">
        <v-card-title class="pa-0">{{displayTitle}}</v-card-title>

        <apexchart type="bar" height="300" :options="computedChartOptions"
                   :series="computedSeries" v-if="ready"></apexchart>
    </stat-panel>
</template>

<script>
    import {stat_panel} from "../../../../Assets/js/mixins/stat_panel";

    export default {
        name: 'affinity-notes-by-hour-chart',
        template: 'affinity-notes-by-hour-chart',
        mixins: [stat_panel],
        props: {connection_type: {default: null}, affinity_team_id: {default: null}, user_id: {default: null}},
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
                    endpoint: 'stats_affinity_notes_by_hour_chart',
                    fields: ['stats'],
                    params: {
                        date_entered_between: this.$store.getters['date_range/date_range'],
                        connection_type: this.connection_type,
                        affinity_team_id: this.affinity_team_id,
                        user_id: this.user_id
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('CDR affinity notes by hour', response);

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
                if (this.affinity_team_id) return 'Affinity Notes for Team: ' + affinity_manager.teams_manager().getTeamByID(this.affinity_team_id).team_name;

                if (this.user_id) return 'Affinity Notes per Hour for User ID: ' + this.user_id;

                return 'Affinity Notes per Hour';
            },

            computedSeries() {
                return [
                    {
                        name: 'Site Notes',
                        data: this.statistics.map(function (obj) {
                            return parseInt(obj.affinity_notes_site_count);
                        }),

                    },
                    {
                        name: 'Ticket Notes',
                        data: this.statistics.map(function (obj) {
                            return parseInt(obj.affinity_notes_ticket_count);
                        }),

                    },
                    {
                        name: 'Task Notes',
                        data: this.statistics.map(function (obj) {
                            return parseInt(obj.affinity_notes_task_count);
                        }),

                    }
                ]
            },

            computedChartOptions() {
                return {
                    colors: [COLOR_BLUE, COLOR_GREEN, COLOR_RED],
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
                            return obj.hour;
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
