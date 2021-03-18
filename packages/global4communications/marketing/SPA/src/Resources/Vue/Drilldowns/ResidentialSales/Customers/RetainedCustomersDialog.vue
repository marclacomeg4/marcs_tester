<template>
    <v-dialog v-model="display_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Retained Customers</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-toolbar-items>
                    <v-btn fab @click="download" :loading="downloading">
                        <v-icon>cloud_download</v-icon>
                    </v-btn>

                    <v-btn fab @click="$emit('closeRetainedCustomersDrilldown')">
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

                            <template v-slot:item.site_id="{ item }">
                                <affinity-site-chip :site_id="item.site_id" :display="item.site_id"></affinity-site-chip>
                            </template>

                            <template v-slot:item.affinitySite.site_name="{ item }">
                                <affinity-site-chip v-if="item.affinitySite" :site_id="item.affinitySite.site_id" :display="item.affinitySite.site_name"></affinity-site-chip>
                            </template>

                            <template v-slot:item.affinitySite.brand="{ item }">
                                <brand-fab v-if="item.affinitySite" :brand_prefix="item.affinitySite.brand"></brand-fab>
                            </template>

                            <template v-slot:item.affinityUser.user.id="{ item }">
                               <user-chip v-if="item.affinityUser && item.affinityUser.user" :user_id="item.affinityUser.user.id" :user_name="item.affinityUser.user.name"></user-chip>
                            </template>

                            <template v-slot:item.attributedToUser.name="{ item }">
                                <user-chip v-if="item.attributedToUser"
                                           :user_id="item.attributedToUser.id"
                                           :user_name="item.attributedToUser.name"></user-chip>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import {drilldown} from "../../../../Assets/js/mixins/drilldown";
    import AffinitySiteChip from "g4-components/Chips/AffinitySiteChip";

    export default {
        name: 'retained-customers-dialog',
        template: 'retained-customers-dialog',
        components: {AffinitySiteChip},
        mixins: [drilldown],

        props: {
            display_dialog: {required: true},
            init_query: {required: true}
        },

        data() {
            return {
                default_query: {
                    endpoint: 'affinity_tickets',
                    fields: [
                        'created_at',
                        'ticket_id',
                        'site_id',
                        'owner_id',
                        'team_id',
                        'status',
                        'user_field_customer_or_ticket_status'
                    ],
                    relations: {
                        affinitySite: {
                            fields: [
                                'site_name',
                                'bsa',
                                'brand'
                            ]
                        },

                        affinityUser: {
                            fields: [
                                'user_id'
                            ],
                            relations:{
                                user:{
                                    fields:[
                                        'id',
                                        'name'
                                    ]
                                }
                            }
                        }

                    },
                    order_by: [{field: 'CREATED_AT', order: 'DESC'}],
                    params: {},
                },

                columns: [
                    {
                        text: 'Created Date',
                        value: 'created_at',
                    },
                    {
                        text: 'Ticket ID',
                        value: 'ticket_id',
                    },
                    {
                        text: 'Site ID',
                        value: 'site_id',
                    },
                    {
                        text: 'Site Name',
                        value: 'affinitySite.site_name',
                    },
                    {
                        text: 'Reference',
                        value: 'affinitySite.bsa',
                    },
                    {
                        text: 'Brand',
                        value: 'affinitySite.brand',
                    },
                    {
                        text: 'Ticket Status',
                        value: 'status',
                    },
                    {
                        text: 'User Field Status',
                        value: 'user_field_customer_or_ticket_status',
                    },
                    {
                        text: 'Ticket Owner',
                        value: 'affinityUser.user.id',
                    }
                ],

                download_setup: {
                    filename: 'Retained Customers',
                    columns: [
                        {
                            text: 'Created Date',
                            value: 'created_at',
                        },
                        {
                            text: 'Ticket ID',
                            value: 'ticket_id',
                        },
                        {
                            text: 'Site ID',
                            value: 'site_id',
                        },
                        {
                            text: 'Site Name',
                            value: 'affinitySite.site_name',
                        },
                        {
                            text: 'Reference',
                            value: 'affinitySite.bsa',
                        },
                        {
                            text: 'Brand',
                            value: 'affinitySite.brand',
                        },
                        {
                            text: 'Ticket Status',
                            value: 'status',
                        },
                        {
                            text: 'User Field Status',
                            value: 'user_field_customer_or_ticket_status',
                        },
                        {
                            text: 'Ticket Owner',
                            value: 'affinityUser.user.id',
                        }
                    ],
                }
            }
        }
    }
</script>
