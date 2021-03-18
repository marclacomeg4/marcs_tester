import Vue from 'vue'
import Router from 'vue-router'

const Developer = () => import('./../../Vue/Pages/Developer');
//Email
const AddCampaignSchedules = () => import('../../Vue/Pages/AddCampaignSchedules.vue');
const CampaignList = () => import('../../Vue/Pages/CampaignList.vue');
const CampaignSchedules = () => import('../../Vue/Pages/CampaignSchedules.vue');
const CampaignLeads = () => import('../../Vue/Pages/CampaignLeads.vue');

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/developer',
            name: 'Developer',
            component: Developer
        },
        {
            path: '/add-schedules/:campaign_uid?',
            name: 'AddCampaignSchedules',
            component: AddCampaignSchedules,

        },
        {
            path: '/campaign-list',
            name: 'CampaignList',
            component: CampaignList
        },
        {
            path: '/campaign-schedules',
            name: 'CampaignSchedules',
            component: CampaignSchedules
        },
        {
            path: '/campaign-leads',
            name: 'CampaignLeads',
            component: CampaignLeads
        }
    ],

    scrollBehavior(to, from, savedPosition) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (savedPosition) {
                    resolve(savedPosition)
                } else {
                    resolve({x: 0, y: 0})
                }
            }, 500)
        })
    }
});

router.beforeEach((to, from, next) => {
    if (router.app.$store)
        router.app.$store.commit('inform_user/hide_inform_message');
    next();
});

export default router;
