export default {
    namespaced:true,
    state: {
        menu: [
            {
                text: 'Campaign Manager',
                router: {name: 'AddCampaignSchedules'}
            }
            ,
            {
                text: 'Campaign List',
                router: {name: 'CampaignList'}
            },
            {
                text: 'Campaign Schedules',
                router: {name: 'CampaignSchedules'}
            },
            {
                text: 'Leads',
                router: {name: 'CampaignLeads'}
            },
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
