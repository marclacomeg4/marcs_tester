<template>
    <stat-panel :loading="loading">

        <contract-dialog :display_dialog="dialog"
                         :init_query="query"
                         @closeContractDrilldown="dialog = false"
        ></contract-dialog>

        <v-card>

            <v-data-table
                :headers="columns"
                :items="statistics"
                :options="tableOptions"
                :footer-props="footerProps"
                :custom-sort="customSort"
            >
                <template v-slot:item="{item}">
                    <tr>
                        <td
                            class="pa-0 stat-td"
                            v-for="header_value in columns"
                            @click.prevent="requestDrilldown(item['attributed_to_user_id'], header_value.onclick)"
                        >
                            <component :user_id="item['user_id']" :is="getTDComponent(header_value.value)">
                                {{ item[header_value.value] }}
                            </component>
                        </td>
                    </tr>
                </template>
            </v-data-table>

        </v-card>

    </stat-panel>
</template>

<style>
.tabhead {
    font-size: 13px !important;
    max-width: 100px;
}

.v-icon {
    display: block !important;
}
</style>

<script>
import StatTableCell from "../../Components/Stats/StatTableCell";
import StatUserTableCell from "../../Components/Stats/StatUserTableCell";
import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
import ContractUserDrilldown from "../../Drilldowns/ContractUserDrilldown";

export default {
    name: 'residential-sales-wallboard-widget',
    components: { StatTableCell,  StatUserTableCell,  ContractUserDrilldown  },
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
                    text: "Agent",
                    value: "user_name",
                    class: "tabhead",
                    onclick: {} //no params, so gets everything filtered by user and date
                },
                {
                    text: "Total Sales",
                    value: "count_total_sales",
                    class: "tabhead",
                    onclick: {}
                },
                {
                    text: "BB Monthly",
                    value: "count_broadband_monthly",
                    class: "tabhead",
                    onclick: {query: 'jsonContractType', payload: 'broadband_monthly'}
                },
                {
                    text: "BB Weekly",
                    value: "count_broadband_weekly",
                    class: "tabhead",
                    onclick: {query: 'jsonContractType', payload: 'broadband_weekly'}
                },
                {
                    text: "BB Only",
                    value: "count_broadband_only",
                    class: "tabhead",
                    onclick: {query: 'jsonContractType', payload: 'broadband_only'}
                },
                {
                    text: "Sky",
                    value: "count_sky",
                    class: "tabhead",
                    onclick: {query: 'hasSky'}
                },
                {
                    text: "Energy",
                    value: "count_energy",
                    class: "tabhead",
                    onclick: {query: 'jsonContractType', payload: 'energy'}
                },
                {
                    text: "Sim",
                    value: "count_sim",
                    class: "tabhead",
                    onclick: {query: 'jsonContractType', payload: 'sim_only'}
                },
                {
                    text: "Line Only",
                    value: "count_line",
                    class: "tabhead",
                    onclick: {query: 'jsonContractType', payload: 'line'}
                },
                {
                    text: "Care",
                    value: "count_care",
                    class: "tabhead",
                    onclick: {query: 'hasCare'}
                },
                {
                    text: "Fast Track",
                    value: "count_fast_track",
                    class: "tabhead",
                    onclick: {query: 'hasFastTrack'}
                },
                {
                    text: "Routers",
                    value: "count_routers",
                    class: "tabhead",
                    onclick: {query: 'hasRouter'}
                },
                {
                    text: "Packages UK",
                    value: "count_packages_uk",
                    class: "tabhead",
                    onclick: {query: 'hasUKCallPackage'}
                },
                {
                    text: "Packages International",
                    value: "count_packages_international",
                    class: "tabhead",
                    onclick: {query: 'hasInternationalCallPackage'}
                },
                {
                    text: "Features",
                    value: "count_features",
                    class: "tabhead",
                    onclick: {query: 'hasCallFeatures'}
                },
                {
                    text: "Phones",
                    value: "count_phones",
                    class: "tabhead",
                    onclick: {query: 'hasPhone'}
                },
                {
                    text: "Deposits",
                    value: "sum_deposits",
                    class: "tabhead",
                    onclick: {}
                }
            ]
        }
    },
    mixins: [stat_panel],
    watch:{
        '$route.path':function(){
            this.getStatistics();
        }

    },
    methods: {
        getStatistics() {
            this.loading = true;
            let affinity_team_id;
            let title;
            switch(this.$route.path)
            {
                case '/wallboard/residential-sales':
                    affinity_team_id = 26;
                    title = "Residential Sales";
                    break;
                case '/wallboard/customer-care1':
                    affinity_team_id = 32;
                    title = "Customer Care 1";
                    break;
                case '/wallboard/customer-care2':
                    affinity_team_id = 25;
                    title = "Customer Care 2";
                    break;
            }

            this.$bus.emit('settitle', title);

            let request = {
                endpoint: 'stats_contracts_total_by_user',
                fields: ['stats'
                ],
                params: {
                    ordered_between: this.$store.getters['date_range/date_range'],
                    affinity_team_id: affinity_team_id
                },
                relations: {}
            }

            this.$graph.getEndPointQuery(request)
                .then((response) => {
                    this.statistics = Object.values(response.stats);

                    this.statistics.forEach(item =>
                        item.sum_deposits = '£' + parseInt(item.sum_deposits / 100).toLocaleString()
                    )
                })

                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                })
        },
        requestDrilldown(user_id, match) {
            if (!match)
                return;

            this.query.params = {};

            if(user_id) {
                this.query.params.attributed_to_user_id = [user_id];
            }
            else
            {
                this.query.params.attributed_to_user_id = this.statistics.map(item=>item.user_id ? item.user_id:null)
                    .filter(item=>item != null);
            }


            if (match.hasOwnProperty('query'))
                this.query.params[match.query] = match.hasOwnProperty('payload') ? match.payload : true;

            this.query.params.ordered_between = this.$store.getters['date_range/date_range'];

            this.dialog = true;
        },

        getTDComponent(query) {
            return query === "user_name" ? "StatUserTableCell" : "StatTableCell";
        },
        customSort:function(items, index, isDesc){
            //do the sort without totals then append it to the sorted list
            let sortable_items = items.filter(item=>item.attributed_to_user_id !== false);
            //non-numeric data (£nnn) needs to be handled differently
            if(index != 'sum_deposits') {

                sortable_items.sort((a, b) => {

                    if (isDesc[0])

                        return a[index] - b[index];

                    else

                        return b[index] - a[index];
                });
            }
            else {
                sortable_items.sort((a, b) => {

                    const integerA = parseInt(a.sum_deposits.replace(/[£,]/g, ""),10);

                    const integerB = parseInt(b.sum_deposits.replace(/[£,]/g, ""),10);

                    if (isDesc[0])

                        return integerA - integerB;

                    else

                        return integerB - integerA;
                });
            }
            sortable_items.push(items.find(item=>item.attributed_to_user_id == false))
            return sortable_items;
        }
    },
    created() {
        this.getStatistics();
    },
}
</script>

