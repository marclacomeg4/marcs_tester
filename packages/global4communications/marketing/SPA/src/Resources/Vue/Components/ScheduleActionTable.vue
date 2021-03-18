<template>
    <div>
        <v-dialog v-model="show_dialog" width="50%">
            <v-card >
                <v-toolbar-title class="text-right title pl-0">
                    <v-icon @click="show_dialog=false">mdi-close-box</v-icon>
                </v-toolbar-title>
<div v-html="email_content"></div>
            </v-card>
        </v-dialog>

        <v-simple-table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Campaign</th>
                <th>SMS/Subject</th>
                <th>Template</th>
                <th>Status</th>
                <th>Receipt</th>
                <th>Criteria</th>
                </ht></tr>
            </thead>
            <tbody>
            <tr v-for="action in actions" :key="action.uid">
                <td>{{ action.action_date }}</td>
                <td>{{ action.action_type }}</td>
                <td>{{ action.marketingCampaign.meta.campaign_name }}</td>
                <td v-if="action.action_type=='Email'">{{ action.meta.email_subject }}</td>
                <td v-if="action.action_type=='SMS'">{{ action.meta.sms }}</td>
                <td v-if="action.action_type=='Email'">
                    {{ action.meta.template }}
                </td>
                <td v-if="action.action_type=='SMS'">
                </td>
                <td>{{ action.status }}</td>
                <td v-if="action.meta_api_result">{{ action.meta_api_result }}</td>
                <td v-if="! action.meta_api_result"></td>
                <td>{{ action.telesalesOpportunityCriteria.name }}</td>
                <td v-if="show_inspect_menu(action.meta)">
                    <v-menu offset-x>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs"
                                    v-on="on">more_vert
                            </v-icon>
                        </template>
                        <v-list>
                            <v-list-item
                                @click="show_email_popup(action.meta.message)">
                                <v-list-item-title>View</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </td>
            </tr>
            </tbody>

        </v-simple-table>
    </div>
</template>

<script>
export default {
    name: "ScheduleActionTable.vue",
    props: ['actions', 'hide_inspect'],
    data() {
        return {
            show_dialog: false,
            email_content: null,
        }
    },

    methods: {
        show_email_popup(message) {
            this.email_content = message.html.replace(/\n/g, "");
            this.show_dialog = true;
        },
        show_inspect_menu(action) {

            if (this.hide_inspect) {
                return false;
            }
            console.log(action);
            if(!action.hasOwnProperty('api_result'))
                return false;
            return action.api_result !== null;
        },
    }

}
</script>

<style scoped>

</style>
