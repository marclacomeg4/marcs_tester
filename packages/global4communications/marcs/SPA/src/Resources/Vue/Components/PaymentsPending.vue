<template>
    <v-row>
        <v-col cols="3">
            <v-btn @click="seventh_all">7/3/2021 Before Code Fix</v-btn>
        </v-col>
            <v-col cols="3">
            <v-btn @click="seventh_monthly">7/3/2021 After Code Fix</v-btn>
            </v-col>
        <v-col cols="3">
            <v-btn @click="twenty_fourth_all">24/3/2021 Before Code Fix</v-btn>
        </v-col>
        <v-col cols="3">
            <v-btn @click="twenty_fourth_monthly">24/3/2021 After Code Fix</v-btn>
        </v-col>
        <v-col cols="12">
            <v-data-table
                :headers="headers"
                :items="payments"
                :loading="loading_payments"
                :disable-sort="true"
                item-key="id"
            >

            </v-data-table>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "PaymentsPending",
    data() {
        return {
            headers: [
                {text: 'Date', value: 'payment_date'},
                {text: 'Payment Attempts', value: 'payment_attempts'},
                {text: 'Status', value: 'status'},
                {text: 'Site Id', value: 'site_id'},
                {text: 'Number of Payments', value: 'number_of_payments'},
                {text: 'Amount', value: 'amount_pence'},
                {text: 'Initial Amount', value: 'initial_amount_pence'},
                {text: 'Recurring Amount', value: 'recurring_amount_pence'},
                {text: 'Frequency', value: 'frequency'},
                {text: 'Start Date', value: 'start_date'}
            ],
            payments: [],
            loading_payments: false
        }
    },
    methods:{
seventh_all(){
  this.get_pending({date:'2021-03-07', 'monthly':false});
},
seventh_monthly(){
    this.get_pending({date:'2021-03-07', 'monthly':true});
},
twenty_fourth_all(){
    this.get_pending({date:'2021-03-24', 'monthly':false});
},
twenty_fourth_monthly() {
    this.get_pending({date:'2021-03-24', 'monthly':true});
},
        get_pending(params){
            this.loading_payments = true;
            axios.post('marcs-api/testing/payments-pending', params).then(response => {
                this.loading_payments = false;
                this.payments = response.data;
                console.log('payments pending ' + JSON.stringify(response.data));
            }).catch(e => {
                console.log('status ' + e.response.status)
            });

        }
},
    mounted: function () {
        /*
        this.loading_payments = true;
        axios.post('marcs-api/testing/payments-pending',).then(response => {
            this.loading_payments = false;
            this.payments = response.data;
            console.log('payments pending ' + JSON.stringify(response.data));
        }).catch(e => {
            console.log('status ' + e.response.status)
        });

         */
    }
}
</script>

<style scoped>

</style>
