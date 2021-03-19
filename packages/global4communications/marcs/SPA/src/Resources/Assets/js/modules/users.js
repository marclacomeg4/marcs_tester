export default {
    namespaced:true,
    state: {
        users: []
    },

    getters: {
        users: state => state.users,
    },

    mutations: {
        insert_users(state, users){
            state.users = users;
        }
    },

    actions:{
        /**
         * This sets the company users to be used in dropdowns etc
         * @param context
         */
        getUsers(context){
            let request = {
                endpoint: 'users_search',
                fields: ['name', 'id', 'role', 'affinity_team_id'],
                order_by: [{field: 'NAME', order: 'ASC'}],
                paginate: {first: 100, page: 0},
                params: {
                    suspended: false
                }
            }

            graph.getEndPointQuery(request)
                .then((response) => {
                    console.log(response);

                    context.commit('insert_users', response.data)
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {

                })
        }
    }
}
