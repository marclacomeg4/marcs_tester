<template>
    <v-dialog v-model="display_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Broadband Monthly Contract Drilldown</v-toolbar-title>

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

                            <template v-slot:item.contract_object_meta.attributed_to.affinity_team_id="{ item }">
                                <affinity-team-chip :affinity_team_id="item.contract_object_meta.attributed_to.affinity_team_id"></affinity-team-chip>
                            </template>

                            <template v-slot:item.status="{ item }">
                                <contract-status-chip :status="item.status"></contract-status-chip>
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
    import AffinityTeamChip from "g4-components/Chips/AffinityTeamChip";
    import {drilldown} from "../../../../Assets/js/mixins/drilldown";
    import UserChip from "g4-components/Chips/UserChip";

    export default {
        name: 'contract-broadband-monthly-dialog',
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
                            fields: ['affinity_site_id', 'email']
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
                    filename: 'Residential Broadband Monthly Contracts',
                    fields: ['full_name',
                        'bsa',
                        'status',
                        'brand',
                        'contract_type',
                        'order_date',
                        'contract_object_checkout{discount{product_discount_gross_pence, subscription_discount_gross_pence}final{product_price_gross_pence, subscription_price_gross_pence}}',
                        'contract_object_call_features{total_selected, subscription_gross_price_pence}',
                        'contract_object_call_packages{uk{name, subscription_gross_price_pence}international{name, subscription_gross_price_pence}}',
                        'contract_object_meta{requested_start_date, expiry_date, attributed_to{affinity_team_id}}',
                        'contract_object_phones{total_qty, product_gross_price_pence, delivery_gross_price_pence}',
                        'contract_object_discount{promocode{name}}',
                        'contract_object_broadband_package{provider, product_gross_price_pence, subscription_gross_price_pence, product_broadband{name}}',
                        'contract_object_router{type, product_gross_price_pence, delivery_gross_price_pence}',
                        'contract_object_addons{fast_track{qty, product_gross_price_pence}enhance_care{qty, subscription_gross_price_pence}wireless_booster{qty, product_gross_price_pence}}',
                        'contract_length',
                        'contract_ref',
                        'signed_up_by_user_id',
                        'attributed_to_user_id'
                    ],
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
                        {
                            text: 'Broadband Package',
                            value: 'contract_object_broadband_package.product_broadband.name',
                        },
                        {
                            text: 'Provider',
                            value: 'contract_object_broadband_package.provider',
                        },
                        {
                            text: 'Broadband Product Price Pence',
                            value: 'contract_object_broadband_package.product_gross_price_pence',
                        },
                        {
                            text: 'Broadband Subscription Price Pence',
                            value: 'contract_object_broadband_package.subscription_gross_price_pence',
                        },
                        {
                            text: 'Router Type',
                            value: 'contract_object_router.type',
                        },
                        {
                            text: 'Router Price Pence',
                            value: 'contract_object_router.product_gross_price_pence',
                        },
                        {
                            text: 'Router Delivery Pence',
                            value: 'contract_object_router.delivery_gross_price_pence',
                        },
                        {
                            text: 'Fast Track',
                            value: 'contract_object_addons.fast_track.qty',
                        },
                        {
                            text: 'Fast Track Price Pence',
                            value: 'contract_object_addons.fast_track.product_gross_price_pence',
                        },
                        {
                            text: 'Enhance Care',
                            value: 'contract_object_addons.enhance_care.qty',
                        },
                        {
                            text: 'Enhance Care Price Pence',
                            value: 'contract_object_addons.enhance_care.subscription_gross_price_pence',
                        },
                        {
                            text: 'Wireless Booster',
                            value: 'contract_object_addons.wireless_booster.qty',
                        },
                        {
                            text: 'Wireless Booster Price Pence',
                            value: 'contract_object_addons.wireless_booster.product_gross_price_pence',
                        },
                        {
                            text: 'Call Package UK',
                            value: 'contract_object_call_packages.uk.name',
                        },
                        {
                            text: 'Call Package UK Price Pence',
                            value: 'contract_object_call_packages.uk.subscription_gross_price_pence',
                        },
                        {
                            text: 'Call Package International',
                            value: 'contract_object_call_packages.international.name',
                        },
                        {
                            text: 'Call Package International Price Pence',
                            value: 'contract_object_call_packages.international.subscription_gross_price_pence',
                        },
                        {
                            text: 'Call Features',
                            value: 'contract_object_call_features.total_selected',
                        },
                        {
                            text: 'Call Features Price Pence',
                            value: 'contract_object_call_features.subscription_gross_price_pence',
                        },
                        {
                            text: 'Total Phones',
                            value: 'contract_object_phones.total_qty',
                        },
                        {
                            text: 'Total Phone Price Pence',
                            value: 'contract_object_phones.product_gross_price_pence',
                        },
                        {
                            text: 'Total Phone Delivery Price Pence',
                            value: 'contract_object_phones.delivery_gross_price_pence',
                        },
                        {
                            text: 'Promo Code',
                            value: 'contract_object_discount.promocode.name',
                        },
                        {
                            text: 'Product Discount Pence',
                            value: 'contract_object_checkout.discount.product_discount_gross_pence',
                        },
                        {
                            text: 'Subscription Discount Pence',
                            value: 'contract_object_checkout.discount.subscription_discount_gross_pence',
                        },
                        {
                            text: 'Contract Product Total Pence',
                            value: 'contract_object_checkout.final.product_price_gross_pence',
                        },
                        {
                            text: 'Contract Subscription Total Pence',
                            value: 'contract_object_checkout.final.subscription_price_gross_pence',
                        },
                    ],
                }
            }
        }
    }
</script>
