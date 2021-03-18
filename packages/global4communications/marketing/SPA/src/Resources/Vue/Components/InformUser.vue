<template>
    <div class="stick" v-if="visible">
        <v-btn class="right-button" small  @click="hideInform"><v-icon>mdi-close</v-icon></v-btn>
        <h2>{{ message }}</h2>
    </div>
</template>

<script>
export default {
    name: "InformUser",
    props: ['message', 'visible'],
    methods: {
        hideInform: function(){
            this.$store.commit('inform_user/hide_inform_message');
        }
    }
}
</script>

<style scoped>

.stick {
    position: fixed;
    top: 100px;
    z-index: 10000;
    background-color: #f5f5f5;
    padding: 10px;
    border: solid 1px;
}

.right-button
{
    float:right;
}

</style>
