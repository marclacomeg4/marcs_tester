<template>
    <stat-panel :loading="loading">
        <v-card-title class="pa-0">{{title}}</v-card-title>

        <v-simple-table>
            <template v-slot:default>
                <thead>
                <tr>
                    <th>Hour</th>
                    <th class="text-center">Outbound Duration</th>
                    <th class="text-center">Outbound</th>

                    <th class="text-center">Inbound Duration</th>
                    <th class="text-center">Inbound</th>

                    <th class="text-center">Internal Duration</th>
                    <th class="text-center">Internal</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="(statistic, index) in statistics" :key="index">
                    <td>
                        {{statistic.hour}}
                    </td>
                    <td class="text-center">{{statistic.outbound_duration}}</td>
                    <td class="text-center">{{statistic.outbound_count}}</td>
                    <td class="text-center">{{statistic.inbound_duration}}</td>
                    <td class="text-center">{{statistic.inbound_count}}</td>
                    <td class="text-center">{{statistic.internal_duration}}</td>
                    <td class="text-center">{{statistic.internal_count}}</td>
                </tr>
                </tbody>
            </template>
        </v-simple-table>

    </stat-panel>
</template>

<script>
    import BrandChip from "g4-components/Chips/BrandChip";
    import PageLoader from "g4-components/Layout/PageLoader";
    import StatNumber from "../../Components/Stats/StatNumber";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";
    import UserAvatar from "g4-components/Icons/UserAvatar";

    export default {
        name: 'calls-per-user-per-hour-table',
        template: 'calls-per-user-per-hour-table',
        components: {StatPanel, StatNumber, BrandChip, PageLoader, UserAvatar},
        mixins: [stat_panel],
        props: {team_id: {required: true}, duration: {default: false}, title: {required: true}},
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
        created() {
            this.getStatistics();
        }
    }
</script>
