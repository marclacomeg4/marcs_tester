<template>
    <v-container>
        <v-select v-if="!loading"
                  :items='campaigns'
                  label='Select a Campaign'
                  item-text='name'
                  item-value='uid'
                  outlined
                  :value="campaign_uid"
                  @input="$emit('update:campaign_uid', $event)"
        >
        </v-select>
        <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
    </v-container>

</template>

<script>
export default {
    name: "CampaignSelector",
    props: {
        selectAllCampaigns: {type: Boolean, required: true},
        campaign_uid: {required:true}
    },
    data() {
        return {
            campaigns: [],
            loading: false,
            select_campaign_on_load:null
        }
    },
    methods: {
        listCampaigns: function () {
            this.loading = true;

            let query = {};
            query.fields = [
                'uid', 'name'
            ];
            query.endpoint = 'marketing_campaign_names';

            graph.getEndPointQuery(query)
                .then((response) => {
                    console.log(response)

                    this.campaigns = [...response];
                    if (this.selectAllCampaigns)
                        this.campaigns.unshift({uid: null, name: 'All'});
                    this.loading = false;
                    if (this.$route.params.hasOwnProperty('campaign_uid')) {
                        this.$emit('update:campaign_uid',this.$route.params.campaign_uid);
                    }
                    if(this.select_campaign_on_load) {
                        this.$emit('update:campaign_uid', this.select_campaign_on_load);
                        this.select_campaign_on_load = null;
                    }
                })
                .catch((error) => {
                    console.log('GET campaigns ERROR:', error);
                })
                .finally(() => {
                })
        },
    },

    created() {
        this.listCampaigns();
        this.$bus.on('reload_campaigns_and_select', val=>{
            console.log('force reload ' + val);
            this.select_campaign_on_load = val;
            this.listCampaigns();
        })
    },
    beforeDestroy() {
        this.$bus.$off('reload_campaigns_and_select');
    }

}
</script>

<style scoped>

</style>
