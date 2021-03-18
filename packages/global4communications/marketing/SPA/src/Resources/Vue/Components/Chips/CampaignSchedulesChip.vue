<template>
    <v-menu offset-x v-model="show_menu" right :min-width="550">
        <template v-slot:activator="{ on: menu, attrs }">
            <v-chip @click="openMenu" small dark>
                {{ display_text }}
            </v-chip>
        </template>

        <v-card>
            <v-card-text class="py-0">
                <v-row v-if="campaign_schedules">
                    <v-col>
                        <v-simple-table v-if="campaign_schedules.length > 0">
                            <template v-slot:default>
                                <thead>
                                <tr>
                                    <template v-for="column in columns">
                                        <td>{{ column }}</td>
                                    </template>
                                    <template v-for="brand in brands">
                                        <td>
                                            <brand-fab :brand_prefix="brand.brand"></brand-fab>
                                        </td>
                                    </template>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(campaignSchedule, index) in campaign_schedules" :key="index">
                                    <td>{{ campaignSchedule.meta.days_from_target }}</td>
                                    <td>{{ campaignSchedule.meta.before_after_target }}</td>
                                    <td>{{ campaignSchedule.meta.target_date }}</td>
                                    <td>{{ campaignSchedule.action_type }}</td>
                                    <td>{{ campaignSchedule.meta.email_subject }}</td>
                                    <td>{{ campaignSchedule.meta.sms }}</td>
                                    <template v-for="brand in brands" v-if="campaignSchedule.action_type==='Email'">
                                        <td>{{ getTemplateForBrand(brand.brand, campaignSchedule.meta.template) }}</td>
                                    </template>

                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                        <h4 v-else>No Schedules Found</h4>
                    </v-col>
                </v-row>
                <page-loader v-else></page-loader>
            </v-card-text>
        </v-card>
    </v-menu>
</template>
<script>


import {mapState} from "vuex";

export default {
    name: 'campaign-schedules-chip',
    template: 'campaign-schedules-chip',
    props: {
        display_text: {required: true},
        campaign_uid: {required: false}
    },
    data() {
        return {
            show_menu: false,
            campaign_schedules: null
        }
    },
    methods: {


        openMenu() {
            this.show_menu = true;
            this.getCampaignSchedules();
        },
        getCampaignSchedules() {
            let query = {};
            query.fields = [
                'marketingCampaignSchedules{uid,action_type,meta}'
            ];
            query.params = {
                first: 100,
            };
            query.endpoint = 'marketing_campaign';
            query.relations = {};
            query.params = {uid: this.campaign_uid};
            query.order_by = [{field: 'CREATED_AT', order: 'ASC'}];

            let request = {
                endpoint: query.endpoint,
                fields: query.fields,
                relations: query.relations,

                params: query.params
            }
            this.$graph.getEndPointQuery(request)
                .then((response) => {
                    console.log('get Campaign Schedules:', response);

                    this.campaign_schedules = _.cloneDeep(response.marketingCampaignSchedules).sort((a, b) => {
                        if (a.meta.before_after_target === b.meta.before_after_target) {
                            if (a.meta.before_after_target === 'after')
                                return parseInt(a.meta.days_from_target, 10) < parseInt(b.meta.days_from_target, 10) ? -1 : 1;
                            else
                                return parseInt(a.meta.days_from_target, 10) > parseInt(b.meta.days_from_target, 10) ? -1 : 1;
                        }
                        const compare_a = a.meta.before_after_target === 'on' ? 'at' : a.meta.before_after_target;
                        const compare_b = b.meta.before_after_target === 'on' ? 'at' : b.meta.before_after_target;
                        return compare_a < compare_b ? 1 : -1;
                    });
                })
                .catch((error) => {
                    console.log('GET campaign schedules ERROR:', error);
                })
                .finally(() => {

                })
        },
        getTemplateForBrand(brand, meta_templates) {
            const found =  meta_templates.find(item => item.brand === brand);
            return found ? found.slug : "";
        }
    },
    computed: {
        ...mapState('email', ['brands']),

        columns() {
            return [
                'Days',
                '',
                'Date',
                'Action',
                'Subject',
                'SMS'
            ];
        },
    }
}
</script>

<style scoped>

</style>
