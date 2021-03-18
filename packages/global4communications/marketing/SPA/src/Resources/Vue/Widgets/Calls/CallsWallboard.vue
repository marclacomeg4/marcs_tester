<template>
    <stat-panel :loading="loading">

        <calls-dialog :display_dialog="dialog"
                         :init_query="query"
                         @closeContractDrilldown="dialog = false"
        ></calls-dialog>

    <v-data-table
        :headers="columns"
        :items="statistics"
        :options="tableOptions"
        :footer-props="footerProps"
    >
        <template v-slot:item="{item}">
            <tr>
                <td
                    class="pa-0 stat-td"
                    v-for="header_value in columns"
                    @click.prevent="requestDrilldown(item['attributed_to_user_id'], header_value.onclick)"
                >
                    <stat-table-cell :user_id="item['user_id']">
                        {{ item[header_value.value] }}
                    </stat-table-cell>
                </td>
            </tr>
        </template>
    </v-data-table>
    </stat-panel>

</template>

<script>
import StatTableCell from "../../Components/Stats/StatTableCell";
import StatUserTableCell from "../../Components/Stats/StatUserTableCell";
import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
import CallsDialog from "../../Drilldowns/Calls/CallsDialog";

export default {
    name: 'calls-wallboard-widget',
    components: {StatTableCell, StatUserTableCell, CallsDialog},
    data() {
        return {
            statistics: [],
            loading: false,
            dialog: false,
            tableOptions: {itemsPerPage: 15},
            footerProps: {itemsPerPageOptions: [15, 20, 25, -1]},
            query: {params: {}},
            columns: [
                {
                    text: "Brand",
                    value: "brand",
                    class: "tabhead",
                    onclick: {}
                },
                {
                    text: "Outstanding",
                    value: "opportunitiesOutstanding",
                    class: "tabhead",
                    onclick: {}
                },
                {
                    text: "Completed",
                    value: "opportunitiesCompleted",
                    class: "tabhead",
                    onclick: {payload:'broadband'}
                },
                {
                    text: "Callbacks",
                    value: "opportunitiesCallbacksOutstanding",
                    class: "tabhead"
                },
                {
                    text: "Actions?",
                    value: "opportunitiesActions",
                    class: "tabhead"
                }
            ]
        }
    },
    mixins: [stat_panel],
    methods: {
        getStatistics() {
            this.loading = true;

            let request = {
                endpoint: 'telesales_opportunities_statistics',
                fields: ['stats'
                ],
                params: {
                    created_between: this.$store.getters['date_range/date_range'],
                },
                relations: {}
            }

            this.$graph.getEndPointQuery(request)
                .then((response) => {
                    console.log("get statistics " + JSON.stringify(response));
                    this.statistics = Object.values(response.stats);

                })

                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                })
        },

        requestDrilldown(user_id, payload) {

            this.query.params = {};
            this.query.params.created_between = this.$store.getters['date_range/date_range'];
            this.dialog = true;

            console.log("REQUEST DRILLDOWN!!! " + JSON.stringify(payload));
        }
    },
    created() {
        this.getStatistics();
    },

}
</script>

<style scoped>

</style>
