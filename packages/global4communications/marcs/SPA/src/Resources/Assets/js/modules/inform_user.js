export default {
    namespaced: true,
    state: {
    message_visible: false,
        message:"nonesuch"
    },

    getters: {
    },

    mutations: {
        show_inform_message(state, payload)
        {
            state.message_visible = true;
            state.message = payload;
        },
        show_validation_message(state, payload)
        {
            let message='';
            state.message = payload.response.data.message;
            let obj_keys = Object.keys(payload.response.data.errors);
            obj_keys.forEach(key=>message += payload.response.data.errors[key] + ' ');
            state.message = message;
            state.message_visible = true;
        },
        hide_inform_message(state){
            state.message = '';
            state.message_visible = false;
        }
    },

    actions: {
    }
}
