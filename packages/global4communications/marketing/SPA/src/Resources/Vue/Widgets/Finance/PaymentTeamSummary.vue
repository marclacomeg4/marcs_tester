<template>
    <stat-panel :loading="loading">
        <v-card-title class="pa-0">Team Summary</v-card-title>

        <v-row v-if="statistics">
            <v-col cols="12">
                <v-card v-for="(user, index) in statistics" :key="index" class="mb-2">
                    <v-card-text class="py-2">
                        <v-row>
                            <v-col class="py-0">
                                <v-row>
                                    <v-col cols="2" class="pt-0 pb-2">
                                        <v-avatar left small>
                                            <v-img v-if="user"
                                                   :src="'https://admin.global4.co.uk/img/users/thumbnail/'+user.user_id+'.jpg'"></v-img>
                                        </v-avatar>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col class="py-0">
                                        <span class="text-h7">{{ user.user_name }}</span>

                                    </v-col>
                                </v-row>
                            </v-col>

                            <v-col class="text-center pt-0">
                                <span class="overline">Direct Debits</span>
                                <br>
                                <span
                                    class="text-h5">{{ user.direct_debits_count }}</span>
                            </v-col>

                            <v-col class="text-center pt-0">
                                <span class="overline">Payment Plans</span>
                                <br>
                                <span class="text-h5">{{ user.payment_plans_count }}</span>
                            </v-col>

                            <v-col class="text-center pt-0">
                                <span class="overline">Recurring Cards</span>
                                <br>
                                <span class="text-h5">{{ user.payment_recurrings_count }}</span>
                            </v-col>

                            <v-col class="text-center pt-0">
                                <span class="overline">Payments</span>
                                <br>
                                <span class="text-h5">{{ user.payment_transactions_count }}</span>
                            </v-col>

                            <v-col class="text-center pt-0">
                                <span class="overline">Payments</span>
                                <br>
                                <span class="text-h5">£{{ (user.payment_transactions_amount_pence_sum / 100)  }}</span>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </stat-panel>
</template>

<script>
    import StatNumber from "../../Components/Stats/StatNumber";
    import {stat_panel} from "../../../Assets/js/mixins/stat_panel";
    import StatPanel from "../../Components/Stats/StatPanel";

    export default {
        name: 'payment-team-summary',
        template: 'payment-team-summary',
        components: {StatPanel, StatNumber},
        mixins: [stat_panel],
        props: {affinity_team_id:{required:true}},
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
                    endpoint: 'stats_payment_team_summary',
                    fields: ['stats'],
                    params: {
                        date_range: this.$store.getters['date_range/date_range'],
                        affinity_team_id: this.affinity_team_id
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Stats Credit control summary', response);

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
