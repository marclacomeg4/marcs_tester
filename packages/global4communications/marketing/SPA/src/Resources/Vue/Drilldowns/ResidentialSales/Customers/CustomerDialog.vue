<template>
    <v-dialog v-model="display_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Customer Drilldown</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-toolbar-items>
                    <v-btn fab @click="download" :loading="downloading">
                        <v-icon>cloud_download</v-icon>
                    </v-btn>

                    <v-btn fab @click="$emit('closeCustomersDrilldown')">
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
                            <template v-slot:item.full_name="{ item }">
                                <customer-chip :display="item.full_name" :brand="item.brand"></customer-chip>
                            </template>

                            <template v-slot:item.bsa="{ item }">
                                <customer-chip :display="item.bsa" :brand="item.brand"></customer-chip>
                            </template>

                            <template v-slot:item.brand="{ item }">
                                <brand-fab :brand_prefix="item.brand"></brand-fab>
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

    export default {
        name: 'prospect-dialog',
        template: 'prospect-dialog',

        mixins: [drilldown],

        props: {
            display_dialog: {required: true},
            init_query: {required: true}
        },

        data() {
            return {
                default_query: {
                    endpoint: 'seq_customers',
                    fields: [
                        'brand',
                        'bsa',
                        'full_name',
                        'mobile',
                        'telephone',
                        'email',
                        'one_line_address',
                        'created_at'
                    ],
                    relations: {
                       affinitySite:{
                           fields:['site_id']
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
                        text: 'Site ID',
                        value: 'affinitySite.site_id',
                    },
                    {
                        text: 'Brand',
                        value: 'brand',
                    },
                    {
                        text: 'Customer Name',
                        value: 'full_name',
                    },
                    {
                        text: 'Customer Ref',
                        value: 'bsa',
                    },
                    {
                        text: 'Mobile',
                        value: 'mobile',
                    },
                    {
                        text: 'Telephone',
                        value: 'telephone',
                    },
                    {
                        text: 'Email',
                        value: 'email',
                    },
                ],

                download_setup: {
                    filename: 'Residential Orders',
                    columns: [
                        {
                            text: 'Created Date',
                            value: 'created_at',
                        },
                        {
                            text: 'Site ID',
                            value: 'affinitySite.site_id',
                        },
                        {
                            text: 'Brand',
                            value: 'brand',
                        },
                        {
                            text: 'Customer Name',
                            value: 'full_name',
                        },
                        {
                            text: 'Customer Ref',
                            value: 'bsa',
                        },
                        {
                            text: 'Mobile',
                            value: 'mobile',
                        },
                        {
                            text: 'Telephone',
                            value: 'telephone',
                        },
                        {
                            text: 'Email',
                            value: 'email',
                        },
                    ],
                }
            }
        }
    }
</script>
