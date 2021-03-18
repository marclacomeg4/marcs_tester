<template>
    <v-dialog v-model="display_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Residential Leads Quarantine</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-toolbar-items>
                    <v-btn fab  @click="download" :loading="downloading">
                        <v-icon>cloud_download</v-icon>
                    </v-btn>

                    <v-btn fab @click="$emit('closeLeadsQuarantineDrilldown')">
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

                            <template v-slot:item.status="{ item }">
                                <lead-quarantine-status-chip :status="item.status"></lead-quarantine-status-chip>
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

    export default {
        name: 'leads-quarantine-dialog',
        template: 'leads-quarantine-dialog',

        components: {
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
                    endpoint: 'residential_lead_quarantines',
                    fields: [
                        'created_at',
                        'email',
                        'mobile',
                        'full_name',
                        'status',
                        'duplication_assessment',
                        'failed_exception_messages',
                        'validation_messages',
                    ],
                    relations: {
                        residentialPartner: {
                            fields: ['name']
                        },
                        residentialSubPartner: {
                            fields: ['name']
                        },
                        residentialPartnerBranch: {
                            fields: ['name']
                        }
                    },
                    order_by: [{field: 'CREATED_AT', order: 'DESC'}],
                    params: {},
                },

                columns: [
                    {
                        text: 'Created',
                        value: 'created_at',
                    },
                    {
                        text: 'Name',
                        value: 'full_name',
                    },
                    {
                        text: 'Email',
                        value: 'email',
                    },
                    {
                        text: 'Mobile',
                        value: 'mobile',
                    },
                    {
                        text: 'Partner',
                        value: 'residentialPartner.name',
                    },
                    {
                        text: 'Sub-Partner',
                        value: 'residentialSubPartner.name',
                    },
                    {
                        text: 'Branch',
                        value: 'residentialPartnerBranch.name',
                    },
                    {
                        text: 'Status',
                        value: 'status',
                    }
                ],

                download_setup: {
                    filename: 'Leads Quarantine',
                    columns: null
                }
            }
        }
    }
</script>
