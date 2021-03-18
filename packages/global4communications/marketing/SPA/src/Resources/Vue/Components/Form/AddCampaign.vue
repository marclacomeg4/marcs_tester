<template>
    <v-dialog v-model="show" width="500">
        <v-card v-if="!loading">
            <v-card-title>
            <v-text-field
                outlined
                v-model="new_campaign_name"
                label="Campaign Name"
            ></v-text-field>
            </v-card-title>
            <v-card-actions>
            <v-btn @click="add_campaign">Enter</v-btn>
            <v-btn @click.stop="show=false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
        <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
    </v-dialog>

</template>

<script>
export default {
name: "AddCampaign",
    props: {
        value:{type:Boolean, required:true},
        onAddedCampaign: {type: String, required: true},
    },
    data(){
    return {
        new_campaign_name:'',
        campaigns:[],
        loading:false,
    }
    },
    methods:{
        add_campaign()
        {
            this.$store.commit('inform_user/hide_inform_message', this.new_campaign_name);
            if(!this.new_campaign_name.trim().length)
            {
                this.$store.commit('inform_user/show_inform_message', "The campaign must have a name");
                return;
            }
            if(this.campaigns.find(item=>item.name === this.new_campaign_name))
            {
                this.$store.commit('inform_user/show_inform_message', "That name is already in use");
                return;
            }

            axios.post('/marketing-api/create-campaign', {campaign_name:this.new_campaign_name}).then(response => {
                this.$bus.emit(this.onAddedCampaign, response.data.campaign_uid);

                this.show = false;
            }).catch(e => {
                console.log('status '  + e.response.status)
            });
            this.name_input = "";
        }

    },
    computed: {
        show: {
            get () {
                return this.value
            },
            set (value) {
                this.new_campaign_name = '';
                this.$emit('input', value)
            }
        }
    },
    created(){
            this.loading = true;
            this.new_campaign_name = '';

        let query = {};
        query.fields = [
            'uid', 'name'
        ];
        query.endpoint = 'marketing_campaign_names';

        graph.getEndPointQuery(query)
            .then((response) => {
                console.log(response)
                this.campaigns = [...response];
                this.loading = false;
            })
            .catch((error) => {
                console.log('GET campaigns ERROR:', error);
            })
            .finally(() => {
            })
        }

}
</script>

<style scoped>

</style>
