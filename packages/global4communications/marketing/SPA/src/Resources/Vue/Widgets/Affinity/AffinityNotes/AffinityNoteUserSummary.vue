<template>
    <stat-panel :loading="loading">
        <v-card-title class="pa-0">Affinity Note User Summary</v-card-title>

        <v-row v-if="statistics">
            <v-col cols="12">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th>User</th>
                            <th>Name</th>
                            <th class="text-center">Site Notes</th>
                            <th class="text-center">Ticket Notes</th>
                            <th class="text-center">Task Notes</th>
                            <th class="text-center">Total Notes</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr v-for="(user, index) in statistics" :key="index">
                            <td>
                                <user-avatar :user_id="user.user_id"></user-avatar>
                            </td>

                            <td>{{user.name}}</td>

                            <td class="text-center">
                                <affinity-notes-chip
                                    connection_type="site" :user_id="user.user_id"
                                    :text="user.affinity_notes_user_site_count"></affinity-notes-chip>
                            </td>

                            <td class="text-center">
                                <affinity-notes-chip
                                    connection_type="ticket" :user_id="user.user_id"
                                    :text="user.affinity_notes_user_ticket_count"></affinity-notes-chip>
                            </td>

                            <td class="text-center">
                                <affinity-notes-chip
                                    connection_type="task" :user_id="user.user_id"
                                    :text="user.affinity_notes_user_task_count"></affinity-notes-chip>
                            </td>

                            <td class="text-center">
                                <affinity-notes-chip
                                    :user_id="user.user_id"
                                    :text="user.affinity_notes_user_total_count"></affinity-notes-chip>
                            </td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
    </stat-panel>
</template>

<script>
    import {stat_panel} from "../../../../Assets/js/mixins/stat_panel";
    import AffinityNotesChip from "../../../Components/Chips/AffinityNotesChip";

    export default {
        name: 'affinity-note-user-summary',
        components: {AffinityNotesChip},
        template: 'affinity-note-user-summary',
        mixins: [stat_panel],
        props: {},
        data() {
            return {
                dialog: false,
                loading: false,
                statistics: null,
                query: {params: {}}
            }
        },
        methods: {
            /**
             * Get the statistics, must have this function, obvs
             */
            getStatistics() {
                this.loading = true;

                let request = {
                    endpoint: 'stats_affinity_notes_user_summary',
                    fields: ['stats'],
                    params: {
                        date_entered_between: this.$store.getters['date_range/date_range'],
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Stats Affintiy Notes user summary', response);

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
