<template>
    <v-dialog v-model="display_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Contract Drilldown</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-toolbar-items>
                    <v-btn fab @click="download">
                        <v-icon>cloud_download</v-icon>
                    </v-btn>

                    <v-btn fab @click="$emit('closeContractDrilldown')">
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
                            <template v-slot:item.seqCustomer.affinity_site_id="{ item }">
                                <affinity-site-chip :site_id="item.seqCustomer.affinity_site_id"></affinity-site-chip>
                            </template>

                            <template v-slot:item.full_name="{ item }">
                                <customer-chip :display="item.full_name" :brand="item.brand"></customer-chip>
                            </template>

                            <template v-slot:item.bsa="{ item }">
                                <customer-chip :display="item.bsa" :brand="item.brand"></customer-chip>
                            </template>

                            <template v-slot:item.contract_type="{ item }">
                                <contract-type-chip :contract_type="item.contract_type"
                                                    :contract_uid="item.contract_uid"></contract-type-chip>
                            </template>

                            <template v-slot:item.status="{ item }">
                                <contract-status-chip :status="item.status"></contract-status-chip>
                            </template>

                            <template v-slot:item.contract_object_meta.attributed_to.affinity_team_id="{ item }">
                                <affinity-team-chip :affinity_team_id="item.contract_object_meta.attributed_to.affinity_team_id"></affinity-team-chip>
                            </template>

                            <template v-slot:item.brand="{ item }">
                                <brand-fab :brand_prefix="item.brand"></brand-fab>
                            </template>

                            <template v-slot:item.attributedToUser.name="{ item }">
                                <user-chip v-if="item.attributedToUser"
                                           :user_id="item.attributedToUser.id"
                                           :user_name="item.attributedToUser.name"></user-chip>
                            </template>

                            <template v-slot:item.affinitySite.affinityBalance.balance="{ item }">
                                <span v-if="item.affinitySite && item.affinitySite.affinityBalance">{{item.affinitySite.affinityBalance.balance}}</span>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import ContractTypeChip from "g4-components/Chips/ContractTypeChip";
    import BrandFab from "g4-components/Icons/BrandFab";
    import ContractStatusChip from "g4-components/Chips/ContractStatusChip";
    import CustomerChip from "g4-components/Chips/CustomerChip";
    import AffinitySiteChip from "g4-components/Chips/AffinitySiteChip";
    import {drilldown} from "../../../../Assets/js/mixins/drilldown";
    import UserChip from "g4-components/Chips/UserChip";
    import AffinityTeamChip from "g4-components/Chips/AffinityTeamChip";

    export default {
        name: 'contract-dialog',
        components: {
            UserChip,
            CustomerChip,
            ContractStatusChip,
            BrandFab,
            ContractTypeChip,
            AffinitySiteChip,
            AffinityTeamChip
        },
        template: 'contract-dialog',

        mixins: [drilldown],

        props: {
            display_dialog: {required: true},
            init_query: {required: true}
        },

        data() {
            return {
                default_query: {
                    endpoint: 'seq_contracts',
                    fields: ['full_name',
                        'bsa',
                        'contract_uid',
                        'status',
                        'brand',
                        'contract_type',
                        'order_date',
                        'contract_object_meta{requested_start_date, expiry_date, attributed_to{affinity_team_id}}',
                        'contract_length',
                        'contract_ref',
                        'signed_up_by_user_id',
                        'attributed_to_user_id'],
                    relations: {
                        attributedToUser: {
                            fields: ['name', 'id']
                        },
                        signedByUser: {
                            fields: ['name', 'id']
                        },
                        seqCustomer: {
                            fields: ['affinity_site_id']
                        }
                    },
                    order_by: [{field: 'ORDER_DATE', order: 'DESC'}],
                    params: {},
                },
                columns: [
                    {
                        text: 'Contract Ref',
                        value: 'contract_ref',
                    },
                    {
                        text: 'Site ID',
                        value: 'seqCustomer.affinity_site_id',
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
                        text: 'Status',
                        value: 'status',
                    },
                    {
                        text: 'Brand',
                        value: 'brand',
                    },
                    {
                        text: 'Contract Type',
                        value: 'contract_type',
                    },
                    {
                        text: 'Order Date',
                        value: 'order_date',
                    },
                    {
                        text: 'Contract Length',
                        value: 'contract_length',
                    },
                    {
                        text: 'Requested Start Date',
                        value: 'contract_object_meta.requested_start_date',
                    },
                    {
                        text: 'Expiry Date',
                        value: 'contract_object_meta.expiry_date',
                    },
                    {
                        text: 'Signed Up User',
                        value: 'signedByUser.name',
                    },
                    {
                        text: 'Attributed User',
                        value: 'attributedToUser.name',
                    },
                    {
                        text: 'Team',
                        value: 'contract_object_meta.attributed_to.affinity_team_id',
                    }
                ],

                download_setup: {
                    filename: 'Residential Contracts',
                    fields: ['full_name',
                        'bsa',
                        'status',
                        'brand',
                        'contract_type',
                        'order_date',
                        'contract_object_meta{requested_start_date, expiry_date}',
                        'contract_length',
                        'contract_ref',
                        'signed_up_by_user_id',
                        'attributed_to_user_id'],
                    relations: {
                        attributedToUser: {
                            fields: ['name', 'id']
                        },
                        signedByUser: {
                            fields: ['name', 'id']
                        },
                        seqCustomer: {
                            fields: ['bsa', 'affinity_site_id', 'email', 'telephone', 'mobile'],
                            relations: {
                                affinitySite: {
                                    fields: ['dealer_id', 'billing_cycle', 'affinity_tickets_open_count'],
                                    relations: {
                                        affinityBalance: {
                                            fields: ['balance']
                                        }
                                    }
                                }
                            }
                        }

                    },
                    columns: [
                        {
                            text: 'Contract Ref',
                            value: 'contract_ref',
                        },
                        {
                            text: 'Site ID',
                            value: 'seqCustomer.affinity_site_id',
                        },
                        {
                            text: 'Customer Name',
                            value: 'full_name',
                        },
                        {
                            text: 'Email',
                            value: 'seqCustomer.email',
                        },
                        {
                            text: 'Telephone',
                            value: 'seqCustomer.telephone',
                        },
                        {
                            text: 'Mobile',
                            value: 'seqCustomer.mobile',
                        },
                        {
                            text: 'Customer Ref',
                            value: 'bsa',
                        },
                        {
                            text: 'Status',
                            value: 'status',
                        },
                        {
                            text: 'Brand',
                            value: 'brand',
                        },
                        {
                            text: 'Contract Type',
                            value: 'contract_type',
                        },
                        {
                            text: 'Order Date',
                            value: 'order_date',
                        },
                        {
                            text: 'Contract Length',
                            value: 'contract_length',
                        },
                        {
                            text: 'Requested Start Date',
                            value: 'contract_object_meta.requested_start_date',
                        },
                        {
                            text: 'Expiry Date',
                            value: 'contract_object_meta.expiry_date',
                        },
                        {
                            text: 'Signed Up User',
                            value: 'signedByUser.name',
                        },
                        {
                            text: 'Attributed User',
                            value: 'attributedToUser.name',
                        },
                        {
                            text: 'Dealer ID',
                            value: 'seqCustomer.affinitySite.dealer_id',
                        },
                        {
                            text: 'Billing Cycle',
                            value: 'seqCustomer.affinitySite.billing_cycle',
                        },
                        {
                            text: 'Open Tickets',
                            value: 'seqCustomer.affinitySite.affinity_tickets_open_count',
                        },
                        {
                            text: 'Balance',
                            value: 'seqCustomer.affinitySite.affinityBalance.balance',
                        },
                    ],
                }
            }
        }
    }
</script>
