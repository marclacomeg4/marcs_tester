<template>
    <stat-panel :loading="loading">

        <affinity-notes-dialog :display_dialog="dialog"
                              :init_query="query"
                              @closeAffinityNotesDrilldown="dialog = false"></affinity-notes-dialog>

        <v-card-title class="pa-0">{{displayTitle}}</v-card-title>

        <v-tooltip>
            <template v-slot:activator="{ on, attrs }">
                <v-card-subtitle class="pa-0" v-on="on">{{displaySubTitle}}</v-card-subtitle>
            </template>
        </v-tooltip>

        <v-row v-if="statistics">
            <v-col cols="12">
                    <span @click="requestDrilldown()">
                    <stat-number :number="statistics.total.toLocaleString()"></stat-number>
                    </span>
            </v-col>
        </v-row>
    </stat-panel>
</template>

<script>
    import {stat_panel} from "../../../../Assets/js/mixins/stat_panel";
    import DirectDebitsDialog from "../../../Drilldowns/Finance/DirectDebitsDialog";
    import AffinityNotesDialog from "../../../Drilldowns/Affinity/AffinityNotesDialog";

    export default {
        name: 'affinity-tickets-total',
        template: 'affinity-tickets-total',
        components: {AffinityNotesDialog, DirectDebitsDialog},
        mixins: [stat_panel],
        props: {status:{default:null},
            user_id:{default:null},
            team_id: {default:null},
            category: {default:null},
            sub_category: {default:null}},
        data() {
            return {
                dialog: false,
                loading: false,
                statistics: {
                    total: 0
                },
                query: {params: {}}
            }
        },
        methods: {
            /**
             * Open the dialog with the query
             */
            requestDrilldown() {
                this.query.params.user_id = (this.user_id) ? this.user_id : null;

                this.query.params.team_id = (this.team_id) ? this.team_id : null;

                this.query.params.category = (this.category) ? this.category : null;

                this.query.params.sub_category = (this.sub_category) ? this.sub_category : null;

                this.dialog = true;
            },

            /**
             * Get the statistics, must have this function, obvs
             */
            getStatistics() {
                this.loading = true;

                let params ={
                    category: this.category,
                    sub_category: this.sub_category,
                    user_id: this.user_id,
                    team_id: this.team_id,
                }

                let request = {
                    endpoint: 'stats_affinity_tickets_total',
                    fields: ['stats'],
                    params: params
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Stats Affinity Tickets', response);

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

        computed:{
            displayTitle() {
                return 'All Affinity Tickets';
            },

            displaySubTitle() {
                return 'All Tickets';
            }
        },

        created() {
            this.getStatistics();
        }
    }
</script>
