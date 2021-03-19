<template>
    <v-row>
        <v-col>
            <PaymentsPending></PaymentsPending>

        </v-col>
    </v-row>
</template>

<script>

import PaymentsPending from "./PaymentsPending";

export default {
    name: "Tester",
    components:{PaymentsPending}
}
</script>

<style scoped>

</style>
