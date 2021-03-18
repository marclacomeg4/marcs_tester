<template>
    <v-dialog v-model="display_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Telesales Calls</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-toolbar-items>
                    <v-btn fab @click="download" :loading="downloading">
                        <v-icon>cloud_download</v-icon>
                    </v-btn>

                    <v-btn fab @click="$emit('closeTelesalesCallsDrilldown')">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <v-card-text class="mt-4">
                <v-row>
                    <v-col>
                        <v-data-table
                            :headers="displayColumns"
                            :items="rows"
                            :options.sync="options"
                            :server-items-length="server_total_rows"
                            :loading="loading"
                            :footer-props="{'items-per-page-options': [25, 50 ,100, 250]}"
                        >
                            <template v-slot:top="{ pagination, options, updateOptions }">
                                <v-data-footer
                                    :pagination="pagination"
                                    :options="options"
                                    @update:options="updateOptions"
                                    :items-per-page-options="[25, 50 ,100, 250]"
                                    items-per-page-text="$vuetify.dataTable.itemsPerPageText"/>
                            </template>

                            <template v-slot:item.user.name="{ item }">
                                <user-chip v-if="item.user" :user_id="item.user.id" :user_name="item.user.name"></user-chip>

                                <span v-else>-</span>
                            </template>

                            <template v-slot:item.residentialLead.full_name="{ item }">
                                <lead-chip v-if="item.residentialLead" :residential_lead_uid="item.residential_lead_uid" :text="item.residentialLead.full_name"></lead-chip>
                            </template>

                            <template v-slot:item.attempts="{ item }">
                                <telesales-calls-attempt-chip :attempts="item.attempts"></telesales-calls-attempt-chip>
                            </template>

                            <template v-slot:item.status="{ item }">
                                <telesales-calls-status-chip :status="item.status"></telesales-calls-status-chip>
                            </template>

                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import BrandFab from "g4-components/Icons/BrandFab";
    import {drilldown} from "../../../../Assets/js/mixins/drilldown";
    import LeadQuarantineStatusChip from "../../../Components/Chips/LeadQuarantineStatusChip";
    import TelesalesCallsStatusChip from "../../../Components/Chips/TelesaleCallsStatusChip";
    import TelesalesCallsAttemptChip from "../../../Components/Chips/TelesalesCallsAttemptChip";
    import LeadChip from "../../../Components/Chips/LeadChip";

    export default {
        name: 'telesales-calls-dialog',
        template: 'telesales-calls-dialog',

        components: {
            LeadChip,
            TelesalesCallsAttemptChip,
            TelesalesCallsStatusChip,
            LeadQuarantineStatusChip,
            BrandFab,
        },

        mixins: [drilldown],

        props: {
            display_dialog: {required: true},
            init_query: {required: true}
        },

        data() {
            return {
                default_query: {
                    endpoint: 'telesales_call_list_calls',
                    fields: [
                        'created_at',
                        'status',
                        'locked_by',
                        'schedule_at',
                        'completed_at',
                        'attempts',
                        'residential_lead_uid'
                    ],
                    relations: {
                        telesalesCallList: {
                            fields: ['name']
                        },
                        residentialLead: {
                            fields: ['full_name']
                        },
                        user: {
                            fields: ['name', 'id']
                        },
                    },
                    order_by: [{field: 'SCHEDULE_AT', order: 'DESC'}],
                    params: {},
                },

                columns: [
                    {
                        text: 'Created',
                        value: 'created_at',
                    },
                    {
                        text: 'Name',
                        value: 'residentialLead.full_name',
                    },
                    {
                        text: 'Scheduled At',
                        value: 'schedule_at',
                    },
                    {
                        text: 'Status',
                        value: 'status',
                    },
                    {
                        text: 'Attempts',
                        value: 'attempts',
                    },
                    {
                        text: 'User',
                        value: 'user.name',
                    },
                    {
                        text: 'Call List',
                        value: 'telesalesCallList.name',
                    }
                ],

                download_setup: {
                    filename: 'Telesales Calls',
                    columns: null
                },
            }
        }
    }
</script>
