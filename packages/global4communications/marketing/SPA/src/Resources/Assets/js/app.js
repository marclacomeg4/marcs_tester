window._ = require('lodash');
window.moment = require('moment');

import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import 'vuetify/dist/vuetify.min.css';
import App from "../../Vue/App";
import router from "./router";
import Axios from "axios";
import VuePresenter from "./plugins/presenters"
import modules from "./modules";
import graph from "js-graph/graph";
import VueGraph from "js-graph/vue-graph"
import VueBus from "vue-bus";
import Echo from "laravel-echo"
import brand_manager from "global-brand-manager"
import affinity_manager from "global-affinity-manager"
import BrandFab from "g4-components/Icons/BrandFab";
import BrandChip from "g4-components/Chips/BrandChip"
import DemoDisplay from "../../Vue/Components/DemoDisplay";


import VueApexCharts from 'vue-apexcharts'
import TickIcon from "g4-components/Icons/TickIcon";
import PageLoader from "g4-components/Layout/PageLoader";


Vue.config.productionTip = false;
Vue.config.devTools = true;

Vue.use(Vuex);
Vue.use(Vuetify);
Vue.use(VueBus);
Vue.use(VueApexCharts);
Vue.component('tick-icon', TickIcon);
Vue.component('page-loader', PageLoader);
Vue.component('brand-fab', BrandFab);
Vue.component('brand-chip', BrandChip);
Vue.component('DemoDisplay', DemoDisplay)




if (!Vue.prototype.hasOwnProperty('$presenter')) {
    Vue.use(VuePresenter);
}

Vue.use(VueGraph, {url: document.querySelector('meta[name="graph-url"]').getAttribute('content')});

window.axios = Axios;
window.axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

window.graph = graph;
window.graph.url = document.querySelector('meta[name="graph-url"]').getAttribute('content');
window.axios.defaults.headers.common['Temp-Auth'] = document.querySelector('meta[name="temp-auth"]').getAttribute('content');
window.axios.defaults.headers.common['Graph-Token'] = document.querySelector('meta[name="graph-token"]').getAttribute('content');

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: (process.env.NODE_ENV === 'production') ? process.env.MIX_PUSHER_APP_KEY_PRO : process.env.MIX_PUSHER_APP_KEY,
    cluster: 'eu',
    encrypted: false
});

const store = new Vuex.Store({
    modules
});

window.COLOR_HT = 'rgba(245, 124, 0, 0.87)';
window.COLOR_FL = 'rgba(37,137,67,0.87)';
window.COLOR_WB = 'rgba(233,30,90,0.87)';
window.COLOR_PB = 'rgba(0,188,212,0.87)';
window.COLOR_G4 = brand_manager.getColor('G4');
window.COLOR_GREEN = '#79db91';
window.COLOR_RED = 'rgba(255,74,76,0.87)';
window.COLOR_BLUE = 'rgba(38,146,255,0.87)';
window.COLOR_YELLOW = 'rgba(255,234,10,0.87)';
window.COLOR_PURPLE = 'rgba(214,58,255,0.87)';
window.COLOR_ORANGE = 'rgba(255,153,49,0.87)';
window.COLOR_DARK_BLUE = 'rgba(13,9,255,0.87)';
window.COLOR_DARK_GREEN = 'rgba(3,255,3,0.87)';
window.COLOR_TEAL = 'rgba(84,165,255,0.87)';
window.COLOR_PINK = 'rgba(255,32,153,0.87)';

window.affinity_manager = affinity_manager;

var app = new Vue({
    vuetify: new Vuetify(),
    store,
    router,
    el: '#app',
    components: {App},
    template: '<App/>',
})


