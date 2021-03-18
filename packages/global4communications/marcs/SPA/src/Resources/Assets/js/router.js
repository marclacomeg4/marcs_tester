import Vue from 'vue'
import Router from 'vue-router'

const Developer = () => import('./../../Vue/Pages/Developer');

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/developer',
            name: 'Developer',
            component: Developer
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


export default router;
