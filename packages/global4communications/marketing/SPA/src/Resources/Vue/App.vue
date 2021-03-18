<template>
    <v-app light>
        <v-snackbar
            v-model="$store.getters['refresh/requiresRefresh']"
            color="error"
            :top="true"
            :timeout="600000"
        >
            This app has been open too long, please refresh the page to load the updates.
        </v-snackbar>

       <main-header></main-header>

        <v-container fluid>
            <v-content>
                <InformUser :message="message" :visible="message_visible"></InformUser>
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </v-content>
        </v-container>
    </v-app>
</template>


<script>
    import MainHeader from "g4-components/Layout/MainHeader";
    import {mapState} from "vuex";
    import InformUser from "./Components/InformUser";

    export default {
        components: {MainHeader, InformUser},

        created() {
            this.$store.dispatch('users/getUsers');

            this.$store.dispatch('user/getUser');

            this.$store.dispatch('email/get_api_initialisation');

        },

        computed:{
            ...mapState('inform_user', ['message', 'message_visible']),
        },

        mounted() {
            window.Echo.channel("payment-spa").listen("CodeUpdate", (e) => {
                console.log('WS - Code Update', e);

                this.$store.dispatch('refresh/setNeedRefresh');
            })
        }
    }
</script>

/*
TODO - ml 18/1/2021
adding scheduled events to a campaign. you can add events from playground even if the campaign is suspended
(but emails wont be sent on scheduled transmit).
But on the real front end - only allow to add events to a live campaign?
*/

