<template>
    <v-autocomplete
        :search-input.sync="search"
        v-model="model"
        :loading="loading"
        class="ma-2"
        :items="items"
        item-text="full_name"
        item-value="uid"
        :no-filter="true"
        autocomplete="new-passwords"
        :label="label"
        outlined
        return-object
        clearable
        clear-icon="close"
        @keyup="searchResidentialLeads"
        :disabled="parentDisable"
    >

        <template v-slot:item="{ item, index }">

            <v-list-item @click="model=item">
                <v-list-item-icon class="ma-1 mt-3">
                    <brand-fab :brand_prefix="item.status.intended_brand"></brand-fab>
                </v-list-item-icon>

                <v-list-item-content class="pa-0">
                    <v-list-item-title>{{ item.full_name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.one_line_address }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ item.email }}</v-list-item-subtitle>
                    <v-list-item-subtitle>Mobile: {{ item.mobile }} landline: {{ item.landline }}</v-list-item-subtitle>
                </v-list-item-content>

            </v-list-item>


        </template>


    </v-autocomplete>
</template>

<script>
export default {
    name: 'auto-complete-residential-leads',
    template: 'auto-complete-residential-leads',
    props: {
        label: {default: 'Residential Leads'},
        parentDisable: true
    },

    data: function(){
        return {
            search: null,
            model: null,
            items: [],
            loading: false,

        }},

    methods: {
        searchResidentialLeads() {
            if (this.search.length > 2) {
                this.loading = true;

                let request = {
                    endpoint: 'residential_leads',
                    fields: [
                        'full_name',
                        'uid',
                        'email',
                        'one_line_address',
                        'mobile',
                        'status{intended_brand}'
                    ],
                    relations: {
                        telesalesOpportunitiesIncomplete: {
                            fields: [
                                'id',
                                'status'
                            ]
                        }
                    },
                    paginate: {first: 15, page: 1},
                    params: {
                        search: this.search
                    }
                }

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Get Auto Residential Leads:', response);

                        this.items = response.data;
                    })
                    .catch((error) => {
                        console.log('GET Auto Residential Leads ERROR:', error);
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            }
        }
    },

    watch: {
    model(new_val, old_val) {
        this.$emit('onLeadSelected', new_val ? new_val.uid : null);
        }
    }
}
</script>
