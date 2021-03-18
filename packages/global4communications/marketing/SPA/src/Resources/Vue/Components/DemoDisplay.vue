<template>
    <span class="pl-12" >
<v-row v-if="live_mode.live_mode">
    <v-col>
        Live mode - emails and SMS will be sent to leads
    </v-col>
</v-row>
    <v-row v-if="! live_mode.live_mode">
        <v-col>
            Test mode - email and SMS will not be sent to leads. Test email = {{this.live_mode.test_email}} test sms = {{this.live_mode.test_sms}}
        </v-col>
    </v-row>
        </span>
</template>

<script>
import {mapState} from "vuex";



    export default {
name: "DemoDisplay",
    computed: {
    ...mapState('email', ['live_mode'])
}

}
</script>

<style scoped>

</style>
