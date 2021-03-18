<template>
    <v-row>
        <v-col cols="12">
        <InformUser :message="message" :visible="message_visible"></InformUser>
        </v-col>
        <v-col cols="12">
        <CreateEmailCampaign></CreateEmailCampaign>
        </v-col>
        <v-col cols="12">
        <SelectEmailCampaigns></SelectEmailCampaigns>
        </v-col>
        <v-col cols="12">
            <AddEmailSchedules></AddEmailSchedules>
            <TemplatePreview></TemplatePreview>
        </v-col>
        <v-col cols="12">
            <CampaignMasterList></CampaignMasterList>
        </v-col>
    </v-row>
</template>

<script>

import InformUser from "../../Components/InformUser";
import SelectEmailCampaigns from "../../Components/SelectEmailCampaigns";
import CreateEmailCampaign from "../../Components/CreateEmailCampaign";
import AddEmailSchedules from "../../Components/AddEmailSchedules";
import TemplatePreview from "../../Components/TemplatePreview";
import {mapState} from 'vuex';

export default {
    name: "CampaignManagers",
    components:{TemplatePreview, InformUser, SelectEmailCampaigns,CreateEmailCampaign, AddEmailSchedules, CampaignMasterList},
    computed:{
        ...mapState('inform_user', ['message', 'message_visible']),
    },
}
</script>

<style scoped>

</style>
