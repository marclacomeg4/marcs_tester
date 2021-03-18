<template>
    <stat-panel :loading="loading">

        <orders-dialog :display_dialog="dialog"
                       :init_query="query"
                       @closeOrderDrilldown="dialog = false"></orders-dialog>

        <v-card-title class="pa-0">{{title}}</v-card-title>

        <v-tooltip>
            <template v-slot:activator="{ on, attrs }">
                <v-card-subtitle class="pa-0" v-on="on">{{subTitle}}</v-card-subtitle>
            </template>
            <span>Contracts that have gone beyond Initialised, ie COP, In Flight, Concluded.</span>
        </v-tooltip>

        <v-row v-if="statistics">
            <v-col cols="8">
                    <span @click="requestDrilldown()">
                    <stat-number :number="statistics.total"></stat-number>
                    </span>
            </v-col>

            <v-col cols="4">
                <v-row>
                    <v-col class="text-center py-1">
                    <span @click.prevent="requestDrilldown('HT')">
                        <brand-chip brand_prefix="HT" :text="statistics.HT"></brand-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('FL')">
                        <brand-chip brand_prefix="FL" :text="statistics.FL"></brand-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('WB')">
                        <brand-chip brand_prefix="WB" :text="statistics.WB"></brand-chip>
                    </span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="text-center py-1">
                      <span @click.prevent="requestDrilldown('PB')">
                        <brand-chip brand_prefix="PB" :text="statistics.PB"></brand-chip>
                    </span>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </stat-panel>
</template>

<script>
    import BrandChip from "g4-components/Chips/BrandChip";
    import PageLoader from "g4-components/Layout/PageLoader";
    import StatNumber from "../../Components/Stats/StatNumber";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";

    export default {
        name: 'orders-total',
        template: 'orders-total',
        components: {StatPanel, StatNumber, BrandChip, PageLoader},
        mixins: [stat_panel],
        props: {
            order_type: {default: null},
            affinity_team_slug: {required: false}
        },
        data() {
            return {
                dialog: false,
                loading: false,
                statistics: {
                    total: 0,
                    HT: 0,
                    FL: 0,
                    WB: 0,
                    PB: 0
                },
                query: {params: {}}
            }
        },
        methods: {
            /**
             * Open the dialog with the query
             */
            requestDrilldown(brand) {
                this.query.params.ordered_between = this.$store.getters['date_range/date_range'];

                this.query.params.brand = (brand) ? brand : null;

                this.query.params.status = this.status;

                this.query.params.order_type = this.order_type;

                if (this.affinityTeam) this.query.params.affinity_team_id = this.affinityTeam.affinity_team_id;

                this.dialog = true;
            },

            /**
             * Get the statistics, must have this function, obvs
             */
            getStatistics() {
                this.loading = true;

                let affinity_team_id = (this.affinityTeam) ? this.affinityTeam.affinity_team_id : null;

                let request = {
                    endpoint: 'stats_orders_total',
                    fields: ['stats'],
                    params: {
                        ordered_between: this.$store.getters['date_range/date_range'],
                        status: this.status,
                        order_type: this.order_type,
                        affinity_team_id: affinity_team_id
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('SeqContracts', response);

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

        computed: {
            title() {
                if (this.order_type) return this.$presenter.orderType(this.order_type) + ' Orders';

                return 'Orders';
            },

            subTitle() {
                let title = '';

                if (this.affinityTeam) title += this.affinityTeam.team_name + ' ';

                return title + 'Orders';
            },


            /**
             * Calcualte the status based on the props
             * @return {null|string[]}
             */
            status() {
                if (this.actioned_contracts) {
                    return ['COP', 'in_flight', 'concluded'];
                }

                return null
            },

            affinityTeam() {
                if (this.affinity_team_slug) return affinity_manager.teams_manager().getTeamBySlug(this.affinity_team_slug);

                return null;
            }
        },

        created() {
            this.getStatistics();
        }
    }
</script>
