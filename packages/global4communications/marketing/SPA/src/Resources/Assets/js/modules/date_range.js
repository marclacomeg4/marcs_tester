import moment from "moment";

export default {
    namespaced: true,
    state: {
        date_range: {
            to: moment().format('YYYY-MM-DD'),
            from: moment().format('YYYY-MM-DD')
        }
    },

    getters: {
        date_range: (state) => {
            return state.date_range;
        }
    },

    mutations: {
        dateRange(state, payload) {
            state.date_range = payload;
        }
    },

    actions: {
        dateRange(context, payload) {
            context.commit('dateRange', payload);
        }
    }
}
