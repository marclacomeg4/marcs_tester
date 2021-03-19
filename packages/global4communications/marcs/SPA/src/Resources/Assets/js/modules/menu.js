export default {
    namespaced:true,
    state: {
        menu: [
            /*
            {
                text: 'Campaign Manager',
                router: {name: 'AddCampaignSchedules'}
            }
            */
        ]
    },

    mutations:{
        add_developer:(state)=>{
            state.menu.push({text:'Developer', router:{name:'Developer'}})
}
    },

    getters: {
        menu: (state) => {
            return state.menu;
        }
    }
}
