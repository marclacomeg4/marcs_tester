<template>
    <v-card :loading="loading">

        <telesales-calls-dialog :display_dialog="dialog"
                                :init_query="query"
                                @closeTelesalesCallsDrilldown="dialog = false"></telesales-calls-dialog>

        <v-card-text>
            <v-card-title>Leads Call Lists</v-card-title>

            <v-card-subtitle>Summary of the current call lists by scheduled date</v-card-subtitle>

            <v-simple-table v-if="statistics">
                <template v-slot:default>
                    <thead>
                    <tr>
                        <th>Name</th>

                        <th>Assigned Users</th>

                        <th class="text-center">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-on="on">Pending</span>
                                </template>
                                <span>Calls that have schedule but not started</span>
                            </v-tooltip>
                        </th>

                        <th class="text-center">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-on="on">Started</span>
                                </template>
                                <span>Calls that have schedule within period</span>
                            </v-tooltip>
                        </th>

                        <th class="text-center">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-on="on">Call Backs</span>
                                </template>
                                <span>Call backs that have schedule during period</span>
                            </v-tooltip>
                        </th>

                        <th class="text-center">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-on="on">Completed</span>
                                </template>
                                <span>Calls that have schedule during period that are completed</span>
                            </v-tooltip>
                        </th>

                        <th class="text-center">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-on="on">Total Calls</span>
                                </template>
                                <span>Total calls that have schedule during period</span>
                            </v-tooltip>
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="(statistic, index) in statistics" :key="index">
                        <td>{{statistic.name}}</td>
                        <td></td>
                        <td class="text-center">
                             <span @click="requestDrilldown('pending', statistic.telesales_call_list_id)">
                                {{statistic.pending_count}}
                            </span>
                        </td>
                        <td class="text-center">
                             <span @click="requestDrilldown('started', statistic.telesales_call_list_id)">
                                {{statistic.started_count}}
                            </span>
                        </td>
                        <td class="text-center">
                             <span @click="requestDrilldown('call_back', statistic.telesales_call_list_id)">
                                {{statistic.call_back_count}}
                            </span>
                        </td>
                        <td class="text-center">
                             <span @click="requestDrilldown('completed', statistic.telesales_call_list_id)">
                                  {{statistic.completed_count}}
                            </span>
                        </td>
                        <td class="text-center">
                            <span @click="requestDrilldown(null, statistic.telesales_call_list_id)">
                                 {{statistic.total}}
                            </span>
                        </td>
                    </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-card-text>
    </v-card>
</template>

<script>
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import TelesalesCallsDialog from "../../Drilldowns/ResidentialSales/Leads/TelesalesCallsDialog";

    export default {
        name: 'telesales-calls-list-list',
        components: {TelesalesCallsDialog},
        template: 'telesales-calls-list-list',
        mixins: [stat_panel],
        props: {},
        data() {
            return {
                dialog: false,
                loading: false,
                statistics: false,
                query: {params: {}}
            }
        },
        methods: {
            /**
             * Open the dialog with the query
             */
            requestDrilldown(status, telesales_call_list_id) {
                this.query.params.scheduled_between = this.$store.getters['date_range/date_range'];

                this.query.params.status = (status) ? status : null;

                this.query.params.telesales_call_list_id = (telesales_call_list_id) ? telesales_call_list_id : null;

                this.dialog = true;
            },

            /**
             * Get the statistics, must have this function, obvs
             */
            getStatistics() {
                this.loading = true;

                let request = {
                    endpoint: 'stats_telesales_call_list_total',
                    fields: ['stats'],
                    params: {scheduled_between: this.$store.getters['date_range/date_range']}
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Stats Residential Telesales Call Total', response);

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
