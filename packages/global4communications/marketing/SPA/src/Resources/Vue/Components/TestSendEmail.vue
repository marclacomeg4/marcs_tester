<template>
<v-container>
    <v-row>
        <v-col cols="12" class="pt-0">
            <v-toolbar-title class="text-right title pl-0">
                <v-icon @click="cancelEmail">mdi-close-box</v-icon>
            </v-toolbar-title>
        </v-col>
    <v-col cols="4" class="pt-1">
        <AutoCompleteResidentialLeads
            @onLeadSelected="changeLeadSelected"></AutoCompleteResidentialLeads>
    </v-col>
        <v-col cols="4" >
            <v-text-field :value="subject" label = "Subject" @input="$emit('update:subject', $event)" outlined></v-text-field>
        </v-col>
        <v-col cols="4" >
            <v-select
                :value="brand"
                :items='brands'
                item-text='name'
                item-value='brand'
                outlined
                label='Select a Brand'
                @input="$emit('update:brand', $event)"
            >
                <template slot="selection" slot-scope="data">
                    <brand-chip :brand_prefix="data.item.brand"></brand-chip>
                </template>
                <template slot="item" slot-scope="data">
                    <brand-chip :brand_prefix="data.item.brand"></brand-chip>
                </template>
            </v-select>
        </v-col>
        <v-col cols="12" v-if="! templates.length" >
            <v-card flat>
                <v-card-actions class="justify-center">
                    <v-progress-circular indeterminate></v-progress-circular>
                </v-card-actions>
            </v-card>
        </v-col>

        <v-col cols="4" class="pt-0" v-if="templates.length">
            <v-select
                :value="template"
                :items='templates'
                item-text='name'
                item-value='slug'
                outlined
                label='Select a Template'
                @input="$emit('update:template', $event)"
            >
            </v-select>
        </v-col>
        <v-col cols="4" class="pt-0">
            <v-text-field @input="$emit('update:send_to', $event)" :value="send_to" label = "Send To" outlined></v-text-field>
        </v-col>
        <v-col cols="2" class="pt-0">
            <v-btn small @click="sendEmail">Send</v-btn>
        </v-col>
        <v-col cols="12" v-if="status" class="pt-0">
            <v-card flat>
                <v-card-actions class="justify-center">
                    {{getStatus}}
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import AutoCompleteResidentialLeads from "./Form/AutoCompleteResidentialLeads";
import {mapState} from "vuex";

export default {
    name: "TestSendEmail",
    components:{AutoCompleteResidentialLeads},
    props:['subject', 'residential_lead_uid', 'template', 'templates', 'brand', 'send_to', 'status', 'api_result'],
    data() {
        return {
            sent_status: ""
        }
        },
    methods:{
        changeLeadSelected(uid){
            this.selected_lead_uid = uid ;
            this.$emit('update:residential_lead_uid', uid);
            console.log(uid)
        },
        sendEmail(){
            this.$bus.emit('emailTestDialogEvent', true);
        },
        cancelEmail(){
            this.$bus.emit('emailTestDialogEvent', false);
        },
    },
    computed: {
        ...mapState('email', ['brands']),
        getStatus()
        {
            if(this.status === "nothing_sent")
                return "";
            else if(this.status === "complete")
                return "The email has been sent";
            else {
                return "Sending the email failed. " + this.api_result;
            }
        }
    },
}
</script>

<style scoped>

</style>
