<template>
    <v-dialog v-model="display_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Residential Leads</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-toolbar-items>
                    <v-btn fab @click="download" :loading="downloading">
                        <v-icon>cloud_download</v-icon>
                    </v-btn>

                    <v-btn fab @click="$emit('closeLeadsDrilldown')">
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

                            <template v-slot:item.mobile="{ item }">
                                <lead-mobile-chip :mobile="item.mobile"
                                                  :mobile_count="item.mobile_count"></lead-mobile-chip>
                            </template>

                            <template v-slot:item.landline="{ item }">
                                <lead-landline-chip :landline="item.landline"
                                                    :landline_count="item.landline_count"></lead-landline-chip>
                            </template>

                            <template v-slot:item.status.optin_broadband="{ item }">
                                <tick-icon :positive="item.status.optin_broadband"></tick-icon>
                            </template>

                            <template v-slot:item.status.optin_sky="{ item }">
                                <tick-icon :positive="item.status.optin_sky"></tick-icon>
                            </template>

                            <template v-slot:item.status.optin_energy="{ item }">
                                <tick-icon :positive="item.status.optin_energy"></tick-icon>
                            </template>

                            <template v-slot:item.status.optin_mobile="{ item }">
                                <tick-icon :positive="item.status.optin_mobile"></tick-icon>
                            </template>

                            <template v-slot:item.calls_count="{ item }">

                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-on="on">
                                            <telesales-calls-chip :residential_lead_uid="item.uid"
                                                                  :calls_count="item.calls_count"></telesales-calls-chip>
                                        </span>
                                    </template>
                                    <span>Calls that have been assigned</span>
                                </v-tooltip>

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
    import LeadMobileChip from "../../../Components/Chips/LeadMobileChip";
    import LeadLandlineChip from "../../../Components/Chips/LeadLandlineChip";
    import TelesalesCallsChip from "../../../Components/Chips/TelesalesCallsChip";

    export default {
        name: 'leads-dialog',
        template: 'leads-dialog',

        components: {
            TelesalesCallsChip,
            LeadLandlineChip,
            LeadMobileChip,
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
                    endpoint: 'residential_leads',

                    fields: [
                        'one_line_address',
                        'address{building_name, building_number, sub_building, street, county, town, locality, postcode, address1, address2, address3}',
                        'uid',
                        'email',
                        'mobile',
                        'landline',
                        'full_name',
                        'one_line_address',
                        'created_at',
                        'status{optin_sky, optin_broadband, optin_energy, optin_mobile, tenancy_length, tenancy_start_at}',
                        'acquire{acquire_method, source_reference}',
                        'mobile_count',
                        'landline_count',
                        'calls_to_action_count',
                        'calls_count'
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
                        text: 'Address',
                        value: 'one_line_address',
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
                        text: 'Land Line',
                        value: 'landline',
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
                        text: 'Optin Broadband',
                        value: 'status.optin_broadband',
                        align: 'center'
                    },
                    {
                        text: 'Optin Energy',
                        value: 'status.optin_energy',
                        align: 'center'
                    },
                    {
                        text: 'Optin Sky',
                        value: 'status.optin_sky',
                        align: 'center'
                    },
                    {
                        text: 'Optin Mobile',
                        value: 'status.optin_mobile',
                        align: 'center'
                    },
                    {
                        text: 'Calls Count',
                        value: 'calls_count',
                        align: 'right'
                    }
                ],
                download_setup: {
                    filename: 'Residential Leads',
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
                            text: 'Address',
                            value: 'one_line_address',
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
                            text: 'Land Line',
                            value: 'landline',
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
                            text: 'Optin Broadband',
                            value: 'status.optin_broadband',
                            align: 'center'
                        },
                        {
                            text: 'Optin Energy',
                            value: 'status.optin_energy',
                            align: 'center'
                        },
                        {
                            text: 'Optin Sky',
                            value: 'status.optin_sky',
                            align: 'center'
                        },
                        {
                            text: 'Optin Mobile',
                            value: 'status.optin_mobile',
                            align: 'center'
                        },
                        {
                            text: 'Tenancy Length',
                            value: 'status.tenancy_length'
                        },
                        {
                            text: 'Tenancy Start',
                            value: 'status.tenancy_start_at'
                        },
                        {
                            text: 'Source Method',
                            value: 'acquire.acquire_method',
                        },
                        {
                            text: 'Source Ref',
                            value: 'acquire.source_reference',
                        },
                        {
                            text: 'Building Name',
                            value: 'address.building_name',
                        },
                        {
                            text: 'Building Number',
                            value: 'address.building_number',
                        },
                        {
                            text: 'Sub Building',
                            value: 'address.sub_building',
                        },
                        {
                            text: 'Street',
                            value: 'address.street',
                        },
                        {
                            text: 'Town',
                            value: 'address.town',
                        },
                        {
                            text: 'Locality',
                            value: 'address.locality',
                        },
                        {
                            text: 'County',
                            value: 'address.county',
                        },
                        {
                            text: 'Postcode',
                            value: 'address.postcode',
                        },
                        {
                            text: 'Address 1',
                            value: 'address.address1',
                        },
                        {
                            text: 'Address 2',
                            value: 'address.address2',
                        },
                        {
                            text: 'Address 3',
                            value: 'address.address3',
                        },
                    ]
                }
            }
        }
    }
</script>
