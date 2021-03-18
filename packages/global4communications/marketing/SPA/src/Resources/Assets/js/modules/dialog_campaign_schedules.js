export default {
    namespaced: true,
    state: {
        display: false,
        campaign_schedules: null,
        server_total_rows: 0,
        options: {
            itemsPerPage: 25,
            page: 1
        },
        endpoint: 'campaign_schedules',

        params: {}
    },

    getters: {
        display: state => state.display,

        campaign_schedules: state => state.campaign_schedules,

        server_total_rows: state => state.server_total_rows,

        options: state => state.options,

        endpoint: state => state.endpoint,

        params: state => state.params,
    },

    mutations: {
        campaign_schedules(state, payload) {
            state.display = payload.display;
            state.campaign_schedules = payload.campaign_schedules;
            state.server_total_rows = payload.server_total_rows;
        },

        options(state, payload) {
            state.options = payload.options;
        },

        endpoint(state, endpoint) {
            state.endpoint = endpoint;
        },

        params(state, params) {
            state.params = params;
        }
    },

    actions: {
        openCampaignSchedules(context, payload) {
            context.commit('campaign_schedules', {display: true, campaign_schedules: null});

            (_.isUndefined(payload.params)) ? context.commit('params', {}) : context.commit('params', payload.params);

            (_.isUndefined(payload.endpoint)) ? context.commit('endpoint', 'campaign_schedules') : context.commit('endpoint', payload.endpoint);

            context.dispatch('getCampaignSchedules', payload);
        },

        closeCampaignSchedules(context, payload) {
            context.commit('campaign_schedules', {display: false, campaign_schedules: null});
        },

        changeOptions(context, options) {
            context.commit('options', {options: options});

            context.dispatch('getCampaignSchedules');
        },

        getCampaignSchedules(context, payload) {
/*
            let request = {
                endpoint: context.getters.endpoint,
                fields: [
                   'meta, action_type',

                ],
                relations: {
                },
                paginate: {first: context.getters.options.itemsPerPage, page: context.getters.options.page},
                params: context.getters.params
            }
*/


            graph.getEndPointQuery(payload)
                .then((response) => {
                    console.log('Get campaign_schedules:', response);

                    context.commit('campaign_schedules', {
                        display: true,
                        campaign_schedules: response.marketingCampaignSchedules.data,
                        server_total_rows: response.marketingCampaignSchedules.paginatorInfo.total
                    });
                })
                .catch((error) => {
                    console.log('GET campaign schedules ERROR:', error);
                })
        }
    }
}


