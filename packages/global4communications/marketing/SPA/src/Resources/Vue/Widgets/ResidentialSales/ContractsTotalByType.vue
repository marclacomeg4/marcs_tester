<template>
    <stat-panel :loading="loading">

        <component :is="drilldownDialog"
                   :display_dialog="dialog"
                   :init_query="query"
                   @closeContractDrilldown="dialog = false"
        ></component>

        <v-card-title class="pa-0">{{title}}</v-card-title>

        <v-tooltip bottom v-if="actioned_contracts">
            <template v-slot:activator="{ on, attrs }">
                <v-card-subtitle class="pa-0" v-on="on">Actioned Contracts</v-card-subtitle>
            </template>
            <span>Contracts that have gone beyond Initialised, ie COP, In Flight, Cancelled.</span>
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
        name: 'contracts-total-by-type',
        template: 'contracts-total-by-type',
        components: {StatPanel, StatNumber, BrandChip, PageLoader},
        mixins: [stat_panel],
        props: {
            contract_type: {default: null},
            actioned_contracts: {type: Boolean}
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

                this.query.params.contract_type = this.contract_type;

                this.dialog = true;
            },

            /**
             * Get the statistics, must have this function, obvs
             */
            getStatistics() {
                this.loading = true;

                let request = {
                    endpoint: 'stats_contracts_total_by_type',
                    fields: ['stats'],
                    params: {
                        ordered_between: this.$store.getters['date_range/date_range'],
                        contract_type: this.contract_type,
                        status: this.status
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
            drilldownDialog() {
                switch (this.contract_type) {
                    case 'broadband_monthly' :
                        return 'contract-broadband-monthly-dialog';
                    case 'sky_tv' :
                        return 'contract-sky-tv-dialog';
                    default:
                        return 'contract-dialog';
                }
            },

            /**
             * Calcualte the status based on the props
             * @return {null|string[]}
             */
            status() {
                if (this.actioned_contracts) {
                    return ['COP', 'in_flight', 'cancelled', 'active'];
                }

                return null
            },

            title() {
                return (this.contract_type) ? this.$presenter.contractType(this.contract_type) : 'All Contracts'
            }
        },

        created() {
            this.getStatistics();
        }
    }
</script>
