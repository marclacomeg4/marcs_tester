<template>
    <v-dialog v-model="display_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Orders Drilldown</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-toolbar-items>
                    <v-btn fab @click="download" :loading="downloading">
                        <v-icon>cloud_download</v-icon>
                    </v-btn>

                    <v-btn fab @click="$emit('closeOrderDrilldown')">
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
                                <contract-type-chip :contract_type="item.contract_type" :contract_uid="item.contract_uid"></contract-type-chip>
                            </template>

                            <template v-slot:item.order_object_meta.order_type="{ item }">
                                <order-type-chip :order_type="item.order_object_meta.order_type"></order-type-chip>
                            </template>

                            <template v-slot:item.order_object_meta.attributed_to.affinity_team_id="{ item }">
                                <affinity-team-chip :affinity_team_id="item.order_object_meta.attributed_to.affinity_team_id"></affinity-team-chip>
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
    import OrderTypeChip from "g4-components/Chips/OrderTypeChip";
    import BrandFab from "g4-components/Icons/BrandFab";
    import ContractStatusChip from "g4-components/Chips/ContractStatusChip";
    import OrderStatusChip from "g4-components/Chips/OrderStatusChip";
    import AffinitySiteChip from "g4-components/Chips/AffinitySiteChip";
    import AffinityTeamChip from "g4-components/Chips/AffinityTeamChip";
    import {drilldown} from "../../../../Assets/js/mixins/drilldown";
    import UserChip from "g4-components/Chips/UserChip";

    export default {
        name: 'contract-dialog',
        components: {
            UserChip,
            OrderStatusChip,
            ContractStatusChip,
            BrandFab,
            ContractTypeChip,
            AffinitySiteChip,
            OrderTypeChip,
            AffinityTeamChip,
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
                    endpoint: 'seq_orders',
                    fields: [
                        'status',
                        'brand',
                        'order_date',
                        'order_ref',
                        'signed_up_by_user_id',
                        'attributed_to_user_id',
                        'contracts_count',
                        'broadband_contracts_count',
                        'sim_only_count',
                        'sky_tv_count',
                        'order_object_meta{order_type, attributed_to{affinity_team_id}}',
                        'order_object_checkout{sub_total{product_price_gross_display, weekly_subscription_price_gross_display, monthly_subscription_price_gross_display},discount{product_discount_gross_display, weekly_subscription_discount_gross_display, monthly_subscription_discount_gross_display},final{product_price_gross_display, weekly_subscription_price_gross_display, monthly_subscription_price_gross_display}}',
                    ],
                    relations: {
                        attributedToUser: {
                            fields: ['name', 'id']
                        },
                        signedByUser: {
                            fields: ['name', 'id']
                        },
                        seqCustomer: {
                            fields: ['bsa', 'full_name', 'affinity_site_id', 'email', 'telephone', 'mobile'],
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
                    order_by: [{field: 'ORDER_DATE', order: 'DESC'}],
                    params: {},
                },

                columns: [
                    {
                        text: 'Order Ref',
                        value: 'order_ref',
                    },
                    {
                        text: 'Site ID',
                        value: 'seqCustomer.affinity_site_id',
                    },
                    {
                        text: 'Customer Name',
                        value: 'seqCustomer.full_name',
                    },
                    {
                        text: 'Customer Ref',
                        value: 'seqCustomer.bsa',
                    },
                    {
                        text: 'Status',
                        value: 'status',
                    },
                    {
                        text: 'Order Type',
                        value: 'order_object_meta.order_type',
                    },
                    {
                        text: 'Team',
                        value: 'order_object_meta.attributed_to.affinity_team_id',
                    },
                    {
                        text: 'Brand',
                        value: 'brand',
                    },
                    {
                        text: 'Order Date',
                        value: 'order_date',
                    },
                    {
                        text: 'Signed Up User',
                        value: 'signedByUser.name',
                    },
                    {
                        text: 'Attributed User',
                        value: 'attributedToUser.name',
                    },
                ],

                download_setup: {
                    filename: 'Residential Orders',
                    columns: [
                        {
                            text: 'Order Ref',
                            value: 'order_ref',
                        },
                        {
                            text: 'Site ID',
                            value: 'seqCustomer.affinity_site_id',
                        },
                        {
                            text: 'Customer Name',
                            value: 'seqCustomer.full_name',
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
                            value: 'seqCustomer.bsa',
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
                            text: 'Order Date',
                            value: 'order_date',
                        },

                        {
                            text: 'Total Contracts',
                            value: 'contracts_count',
                        },
                        {
                            text: 'Number Of Broadband Contracts',
                            value: 'broadband_contracts_count',
                        },
                        {
                            text: 'Number Of SIM Only Contracts',
                            value: 'sim_only_count',
                        },
                        {
                            text: 'Number Of Sky TV Contracts',
                            value: 'sky_tv_count',
                        },

                        {
                            text: 'Sub-Total Initial Value',
                            value: 'order_object_checkout.sub_total.product_price_gross_display',
                        },
                        {
                            text: 'Sub-Total Weekly Subscription Value',
                            value: 'order_object_checkout.sub_total.weekly_subscription_price_gross_display',
                        },
                        {
                            text: 'Sub-Total Monthly Subscription Value',
                            value: 'order_object_checkout.sub_total.monthly_subscription_price_gross_display',
                        },

                        {
                            text: 'Discount Initial Value',
                            value: 'order_object_checkout.discount.product_discount_gross_display',
                        },
                        {
                            text: 'Discount Weekly Subscription Value',
                            value: 'order_object_checkout.discount.weekly_subscription_discount_gross_display',
                        },
                        {
                            text: 'Discount Monthly Subscription Value',
                            value: 'order_object_checkout.discount.monthly_subscription_discount_gross_display',
                        },

                        {
                            text: 'Final Initial Value',
                            value: 'order_object_checkout.final.product_price_gross_display',
                        },
                        {
                            text: 'Final Weekly Subscription Value',
                            value: 'order_object_checkout.final.weekly_subscription_price_gross_display',
                        },
                        {
                            text: 'Final Monthly Subscription Value',
                            value: 'order_object_checkout.final.monthly_subscription_price_gross_display',
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
