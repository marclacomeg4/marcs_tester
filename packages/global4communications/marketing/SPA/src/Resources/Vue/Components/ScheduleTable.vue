<template>
    <v-container>

        <v-dialog max-width="50%" v-model="show_confirm_delete_item">
            <v-card>
                <v-text-field
                    outlined
                    :label="confirm_delete_text"
                ></v-text-field>
                <v-btn @click="delete_local_schedule">Confirm</v-btn>
                <v-btn @click.stop="show_confirm_delete_item=false">Cancel</v-btn>
            </v-card>
        </v-dialog>

        <v-data-table
            :headers="headers"
            :items="local_schedules_sorted"
            :loading="loading_schedules"
            :disable-pagination="true"
            :hide-default-footer="true"
            :disable-sort="true"
            show-expand
            :single-expand="singleExpand"
            item-key="uid"
            :expanded.sync="expanded"
            expand-icon=""
        >

            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="px-0">
                    <v-card outlined elevation="14">
                        <v-row>
                            <v-col cols="11">
                                <v-simple-table v-if="item.action_type === 'Email'">
                                    <template v-slot:default>
                                        <thead>
                                        <tr>
                                            <th>Brand</th>
                                            <th>Template</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(template, index) in item.meta.template" :key="index">
                                            <td>
                                                <brand-fab :brand_prefix="template.brand"></brand-fab>
                                            </td>
                                            <td>{{ template.slug }}s</td>
                                        </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                                <v-simple-table v-if="item.action_type === 'SMS'">
                                    <template v-slot:default>
                                        <tr>
                                            <td class="px-10" v-if="item.action_type === 'SMS'">
                                                {{ item.meta.sms }}
                                            </td>
                                        </tr>
                                    </template>
                                </v-simple-table>
                            </v-col>
                            <v-col cols="1">
                                <v-toolbar-title class="text-right title pl-0">
                                    <v-icon @click="expanded=[]">mdi-close-box</v-icon>
                                </v-toolbar-title>
                            </v-col>
                        </v-row>
                    </v-card>
                </td>

            </template>

            <template v-slot:item.show_action="{ item }">
                <p>{{ get_item_action_type(item) }}</p>
            </template>
            <template v-slot:item.uid="{ item }">
                <v-menu offset-x>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs"
                                v-on="on">more_vert
                        </v-icon>

                    </template>
                    <v-list>
                        <v-list-item
                            @click="show_details_popup(item)">
                            <v-list-item-title>Inspect</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                            @click="$emit('update:edit_schedule_uid', item)">
                            <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                            @click="request_delete_local_schedule(item)">
                            <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>


            </template>
        </v-data-table>
    </v-container>
</template>
<script>

import {mapState} from 'vuex';

export default {
    name: "ScheduleTable",
    props: ['can_edit', 'items', 'edit_schedule_uid'],
    data() {
        return {
            headers: [
                {text: 'name', value: 'action_type'},
                {text: 'days', value: 'meta.days_from_target'},
                {text: '', value: 'meta.before_after_target'},
                {text: '', value: 'meta.target_date'},
                {text: 'template/sms', value: 'show_action'},
                {text: '', value: 'uid', 'sortable': false}],
            show_details_item: null,
            expanded: [],
            singleExpand: false,
            confirm_delete_item: null,
            confirm_delete_text: "",
            show_confirm_delete_item: false
        }
    },
    methods: {
        get_item_action_type: function (item) {
            switch (item.action_type) {
                case 'SMS':
                    return item.meta.sms.length > 50 ? item.meta.sms.substring(0, 50) + '...' : item.meta.sms;
                    break;
                case 'Email':
                    return item.meta.email_subject;
                    break;
            }
        },
        show_details_popup: function (item) {
            this.show_details_item = item;
            this.expanded = [item];
        },
        get_template(index, brand) {
            if (this.local_schedules[index].meta.template.find(item => item.brand === brand))
                return this.local_schedules[index].meta.template.find(item => item.brand === brand).slug;
            return "";
        },
        request_delete_local_schedule(item) {
            this.confirm_delete_text = "Delete " + item.action_type + " ";
            this.confirm_delete_text += (item.meta.before_after_target === "on") ? "" : item.meta.days_from_target + " days ";
            this.confirm_delete_text += item.meta.before_after_target + " " + item.meta.target_date + "?";
            this.confirm_delete_item = item;
            this.show_confirm_delete_item = true;
        },
        delete_local_schedule() {
            this.$store.commit('email/delete_local_schedule', this.confirm_delete_item.uid);
            this.confirm_delete_item = null;
            this.show_confirm_delete_item = false;
        }

    },
    computed: {
        ...mapState('email', ['local_schedules', 'brands', 'loading_schedules']),

        show_edit: function () {
            return this.can_edit === "true";
        },

        local_schedules_sorted: function () {
            return _.cloneDeep(this.local_schedules).sort((a, b) => {
                if (a.meta.before_after_target === b.meta.before_after_target) {
                    if (a.meta.before_after_target === 'after')
                        return parseInt(a.meta.days_from_target, 10) < parseInt(b.meta.days_from_target, 10) ? -1 : 1;
                    else
                        return parseInt(a.meta.days_from_target, 10) > parseInt(b.meta.days_from_target, 10) ? -1 : 1;
                }
                const compare_a = a.meta.before_after_target === 'on' ? 'at' : a.meta.before_after_target;
                const compare_b = b.meta.before_after_target === 'on' ? 'at' : b.meta.before_after_target;
                return compare_a < compare_b ? 1 : -1;
            });
        },
        get_popup_details: function () {
            if (!this.show_details_item)
                return [];
            if (this.show_details_item.action_type === "Email")
                return this.show_details_item.meta.template;
            return {brand: 'all', sms: this.show_details_item.meta.sms};
        },
        details_visible: function () {
            return this.show_details_item;
            if (!this.show_details_item)
                return false;
            console.log(this.show_details_item.uid + ", " + item.uid);
            return this.show_details_item.uid === item.uid;
        },
    }
}

</script>

<style scoped>

</style>


