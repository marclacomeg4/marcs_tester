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
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </v-content>
            <Tester></Tester>
        </v-container>
    </v-app>
</template>


<script>
import MainHeader from "g4-components/Layout/MainHeader";
import Tester from "./Components/Tester";
import {mapState} from "vuex";

export default {
    components: {MainHeader, Tester},

    created() {
        this.$store.dispatch('users/getUsers');

        this.$store.dispatch('user/getUser');


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
