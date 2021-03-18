import router from "../router";

export default {
    namespaced: true,
    state: {
        brands: [],
        contract_types: [],
        live_mode: {live_mode: true, test_email: '', test_sms: ''},
        local_schedules: [],
        server_schedules: [],
        loading_schedules: false,
        user_confirms_delete_edits: false,
        local_schedules_edited:false
    },

    mutations: {
        loading_schedules(state, value) {
            state.loading_schedules = value;
        },
        insert_local_schedules(state, schedules) {
            state.local_schedules = _.cloneDeep(schedules);
            state.local_schedules_edited = false;
        },
        insert_server_schedules(state, schedules) {
            state.server_schedules = _.cloneDeep(schedules);
        },
        insert_local_schedule(state, schedule) {
            state.local_schedules.push(_.cloneDeep(schedule));
            state.local_schedules.sort((a, b) => {
                return a.meta.days_from_target - b.meta.days_from_target;
            });
            state.local_schedules_edited = true;
        },
        set_user_confirms_delete_edits(state, value) {
            state.user_confirms_delete_edits = value;
        },
        set_brands(state, brands) {
            state.brands = [...brands];
        },
        set_contract_types(state, contract_types) {
            state.contract_types = [...contract_types];
        },
        set_live_mode(state, live_mode) {
            state.live_mode = {...live_mode}
        },
        delete_local_schedule(state, uid) {
            state.local_schedules = state.local_schedules.filter(item => item.uid != uid);
            state.local_schedules_edited = true;
        },
        delete_all_local_schedules(state) {
            state.local_schedules = [];
            state.local_schedules_edited = false;
        },
    },

    actions: {
        get_api_initialisation(context) {
            axios.post('/marketing-api/get-api-initialisation').then(response => {
                console.log('get-api-initialisation response ' + JSON.stringify(response.data));
                context.commit('set_brands', response.data.brands)
                context.commit('set_contract_types', response.data.contract_types)
                context.commit('set_live_mode', response.data.live_mode)
            }).catch(e => {
                console.log(e);
            });
        },
        get_template_info(context, template_name) {
            const data = {name: template_name}
            axios.post('/marketing-api/get-template-info', data).then(response => {
                console.log('get-template-info response ' + JSON.stringify(response.data));
                context.commit('template_info', response.data.template_info)
            }).catch(e => {
                console.log(e);
            });
        },
        create_email_campaign(context, payload) {
            const data = payload;
            axios.post('/marketing-api/create-campaign', data).then(response => {
                console.log('create-campaign response ' + JSON.stringify(response.data));
                context.commit('inform_user/show_inform_message', 'Created campaign ' + response.data.campaign_name, {root: true});
            }).catch(e => {
                if (e.response.status === 422) {
                    context.commit('inform_user/show_validation_message', e, {root: true});
                }
                console.log('status ' + e.response.status)
            });
        },

        delete_edited_schedules(context) {
            context.commit('delete_all_local_schedules');
        },

        get_schedules_for_campaign(context, payload) {
            context.commit('delete_all_local_schedules');
            if (!payload)
                return;
            context.commit('loading_schedules', true);
            let query = {};
            query.fields = [
                'uid', 'action_type', 'meta'
            ];
            query.params = {
                first: 1000,
            };
            query.endpoint = 'schedules_for_campaign';
            query.relations = {};
            query.params = {uid: payload};

            let request = {
                endpoint: query.endpoint,
                fields: query.fields,
                relations: query.relations,

                params: query.params
            }
            graph.getEndPointQuery(query)
                .then((response) => {
                    console.log('get Campaign Schedules:', response);
                    context.commit('insert_local_schedules', response);
                    context.commit('insert_server_schedules', response);
                })
                .catch((error) => {
                    console.log('GET campaign schedules:', error);
                })
                .finally(() => {
                    context.commit('loading_schedules', false);
                })
        },

        add_scheduled_actions_to_campaign(context, payload) {
            const data = payload;
            axios.post('/marketing-api/add-scheduled-actions-to-campaign', data,
            ).then(response => {
                console.log('add-scheduled-actions-to-campaign response ' + JSON.stringify(response.data))
            }).catch(e => {
                console.log(e);
            });
        },
        transmit_campaign_emails(context, payload) {
            const data = {
                campaign_uid: payload.campaign_uid,
                execution_date: payload.date
            }

            axios.post('/marketing-api/transmit-campaign-emails', data).then(response => {
                console.log('transmit-campaign-emails response ' + JSON.stringify(response.data))
            }).catch(e => {
                console.log(e);
            });
        },

        transmit_all_by_day(context, execution_date) {
            const data = {
                execution_date: execution_date
            }

            axios.post('/marketing-api/transmit-all-by-day', data).then(response => {
                console.log('transmit-all-by-day response ' + JSON.stringify(response.data))
            }).catch(e => {
                console.log(e);
            });
        },

        transmit_campaign_sms(context, payload) {
            const data = {
                campaign_uid: payload.campaign_uid,
                execution_date: payload.date
            }

            axios.post('/marketing-api/transmit-campaign-sms', data).then(response => {
                console.log('transmit-campaign-sms response ' + JSON.stringify(response.data))
            }).catch(e => {
                console.log(e);
            });
        },


    }
}
