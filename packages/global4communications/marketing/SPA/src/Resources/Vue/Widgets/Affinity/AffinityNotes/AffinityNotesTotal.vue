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
        name: 'affinity-notes-total',
        template: 'affinity-notes-total',
        components: {AffinityNotesDialog, DirectDebitsDialog},
        mixins: [stat_panel],
        props: {connection_type:{default:null}, user_id:{default:null}, affinity_team_id: {default:null}},
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
                this.query.params.date_entered_between = this.$store.getters['date_range/date_range'];

                this.query.params.connection_type = (this.connection_type) ? this.connection_type : null;

                this.query.params.user_id = (this.user_id) ? this.user_id : null;

                this.query.params.affinity_team_id = (this.affinity_team_id) ? this.affinity_team_id : null;

                this.dialog = true;
            },

            /**
             * Get the statistics, must have this function, obvs
             */
            getStatistics() {
                this.loading = true;

                let params ={
                    date_entered_between: this.$store.getters['date_range/date_range'],
                    connection_type: this.connection_type,
                    user_id: this.user_id,
                    affinity_team_id: this.affinity_team_id,
                }

                let request = {
                    endpoint: 'stats_affinity_notes_total',
                    fields: ['stats'],
                    params: params
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Stats Affinity Notes', response);

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
                if (this.connection_type) return  _.capitalize(this.connection_type) + ' Notes';

                return 'All Affinity Notes';
            },

            displaySubTitle() {
                if (this.connection_type) return 'Note Type: ' + _.capitalize(this.connection_type);

                return 'All Note Types';
            }
        },

        created() {
            this.getStatistics();
        }
    }
</script>
