export default {
    namespaced:true,
    state: {
        needs_refresh: false,
    },

    getters: {
        requiresRefresh: (state) => {
           return state.needs_refresh;
        }
    },

    mutations: {
        change_needs_refresh(state) {
            state.needs_refresh = true;
        },
    },

    actions: {
        setNeedRefresh(context, payload){
            context.commit('change_needs_refresh');
        }
    }
}
