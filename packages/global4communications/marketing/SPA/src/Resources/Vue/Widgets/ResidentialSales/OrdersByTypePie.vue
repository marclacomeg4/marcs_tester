<template>
    <stat-panel :loading="loading">
        <v-card-title class="pa-0">{{title}}</v-card-title>

        <apexchart type="pie" height="300" :options="computedChartOptions"
                   :series="computedSeries" v-if="ready"></apexchart>
    </stat-panel>
</template>

<script>
    import PageLoader from "g4-components/Layout/PageLoader";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";

    export default {
        name: 'orders-by-type-pie',
        template: 'orders-by-type-pie',
        components: {StatPanel, PageLoader},
        mixins: [stat_panel],
        props: {
            affinity_team_slug: {required: false}
        },
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

                let affinity_team_id = (this.affinityTeam) ? this.affinityTeam.affinity_team_id : null;

                let request = {
                    endpoint: 'stats_orders_by_type',
                    fields: ['stats'],
                    params: {
                        ordered_between: this.$store.getters['date_range/date_range'],
                        affinity_team_id: affinity_team_id
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('CDR Orders By Type', response);

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
            affinityTeam() {
                if (this.affinity_team_slug) return affinity_manager.teams_manager().getTeamBySlug(this.affinity_team_slug);

                return null;
            },

            title() {
                if (this.affinityTeam) return this.affinityTeam.team_name + ' Orders';

                return 'Orders By Type';
            },

            computedSeries() {
                return [
                    parseInt(this.statistics.new_order_count),
                    parseInt(this.statistics.home_move_count),
                    parseInt(this.statistics.upgrade_count),
                    parseInt(this.statistics.account_takeover_count),
                    parseInt(this.statistics.renewal_count),
                    parseInt(this.statistics.package_change_count)
                ]
            },

            computedChartOptions() {
                return {
                    colors: [COLOR_GREEN, COLOR_YELLOW, COLOR_PURPLE, COLOR_PINK, COLOR_TEAL, COLOR_ORANGE],
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
                        'New Order',
                        'Home Move',
                        'Upgrade',
                        'Account Takeover',
                        'Renewal',
                        'Package Change',
                    ],
                }
            }
        },
        created() {
            this.getStatistics();
        }
    }
</script>
