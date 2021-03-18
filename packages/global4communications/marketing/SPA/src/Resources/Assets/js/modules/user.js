export default {
    namespaced:true,
    state: {
        user: null
    },

    getters: {
        user: state => state.user
    },

    mutations: {
        insert_user(state, user){
            state.user = user;
        }
    },

    actions:{
        /**
         * This sets the company users to be used in dropdowns etc
         * @param context
         */
        getUser(context){
            console.log('getting user');
            let request = {
                endpoint: 'user_auth',
                fields: ['name', 'id', 'email']
            }

            graph.getEndPointQuery(request)
                .then((response) => {
                    console.log(response);

                    context.commit('insert_user', response)
                    if(response.email.indexOf('marc.lacome') !== -1)
                        context.commit('menu/add_developer', null, {root:true});
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {

                })
        }
    }
}
