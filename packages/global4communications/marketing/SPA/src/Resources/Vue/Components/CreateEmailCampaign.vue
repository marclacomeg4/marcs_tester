<template>
    <div>
        <v-row>
            <v-col cols="4">
                <v-text-field
                    v-model="name_input"
                    label="Campaign Name"
                    outlined
                ></v-text-field>
            </v-col>
            <v-col cols="4">
                <v-btn @click="create_campaign">Create Campaign</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import {mapState} from 'vuex';


export default {
    name: "CreateEmailCampaign",
    data: function () {
        return {
            name_input: ''
        }
    },
    methods: {
        create_campaign() {
            this.$store.commit('inform_user/hide_inform_message');
            axios.post('/marketing-api/create-campaign', {campaign_name:this.name_input}).then(response => {
                console.log('create-campaign response ' + JSON.stringify(response.data));
            }).catch(e => {
                if(e.response.status === 422)
                {
                    context.commit('inform_user/show_validation_message', e, {root:true});
                }
                console.log('status '  + e.response.status)
            });
            this.name_input = "";
        }
    },

    computed: {
        ...mapState('email', ['brands']),
    }
}
</script>

<style scoped>

</style>
