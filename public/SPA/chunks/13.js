(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{Vane:function(t,e,a){"use strict";a.r(e);var s=a("0SPX"),n=a("+XYa"),i=a("Jv73"),r=a("+xue"),o=a("xrjI"),c=a("DAy3"),l=a("m2Vv"),d={name:"upsells-per-user-chart",template:"upsells-per-user-chart",components:{StatPanel:l.a,PageLoader:n.a},mixins:[c.a],props:{},data:function(){return{ready:!1,loading:!1,statistics:[]}},methods:{getStatistics:function(){var t=this;this.loading=!0;var e={endpoint:"stats_upsells_by_user",fields:["stats"],params:{ordered_between:this.$store.getters["date_range/date_range"]}};this.$graph.getEndPointQuery(e).then((function(e){console.log("CDR Upsells By User",e),t.statistics=_.toArray(e.stats)})).catch((function(t){console.log(t)})).finally((function(){t.loading=!1,t.ready=!0}))}},computed:{computedSeries:function(){return[{name:"Fast Track",data:this.statistics.map((function(t){return parseInt(t.fast_track_count)}))},{name:"Router Upgrade",data:this.statistics.map((function(t){return parseInt(t.upgrade_router_count)}))},{name:"Enhanced Care",data:this.statistics.map((function(t){return parseInt(t.enhance_care_count)}))},{name:"Weekly Mobile Call Package",data:this.statistics.map((function(t){return parseInt(t.weekly_call_package_mobile_count)}))},{name:"Weekly Landline Call Package",data:this.statistics.map((function(t){return parseInt(t.weekly_call_package_landline_count)}))}]},computedChartOptions:function(){return{colors:[COLOR_GREEN,COLOR_RED,COLOR_BLUE,COLOR_YELLOW,COLOR_ORANGE,COLOR_PURPLE],chart:{type:"bar"},plotOptions:{bar:{horizontal:!1}},dataLabels:{enabled:!1},legend:{position:"top"},tooltip:{enabled:!0,theme:"dark"},xaxis:{categories:this.statistics.map((function(t){return t.name})),labels:{show:!0,rotate:0}}}}},created:function(){this.getStatistics()}},p=a("KHd+"),u=Object(p.a)(d,(function(){var t=this.$createElement,e=this._self._c||t;return e("stat-panel",{attrs:{loading:this.loading}},[e("v-card-title",{staticClass:"pa-0"},[this._v("Upsells per User")]),this._v(" "),this.ready?e("apexchart",{attrs:{type:"bar",height:"300",options:this.computedChartOptions,series:this.computedSeries}}):this._e()],1)}),[],!1,null,null,null).exports,h={name:"upsells-chart",template:"upsells-chart",components:{StatPanel:l.a,PageLoader:n.a},mixins:[c.a],props:{},data:function(){return{ready:!1,loading:!1,statistics:[]}},methods:{getStatistics:function(){var t=this;this.loading=!0;var e={endpoint:"stats_upsells",fields:["stats"],params:{ordered_between:this.$store.getters["date_range/date_range"]}};this.$graph.getEndPointQuery(e).then((function(e){console.log("CDR Upsells",e.stats),t.statistics=e.stats})).catch((function(t){console.log(t)})).finally((function(){t.loading=!1,t.ready=!0}))}},computed:{computedSeries:function(){return[{data:[parseInt(this.statistics.fast_track_count),parseInt(this.statistics.upgrade_router_count),parseInt(this.statistics.enhance_care_count),parseInt(this.statistics.weekly_call_package_landline_count),parseInt(this.statistics.weekly_call_package_mobile_count)]}]},computedChartOptions:function(){return{colors:[COLOR_GREEN,COLOR_RED,COLOR_BLUE,COLOR_YELLOW,COLOR_ORANGE,COLOR_PURPLE],chart:{type:"bar"},plotOptions:{bar:{horizontal:!1,columnWidth:"55%",distributed:!0}},dataLabels:{enabled:!1},legend:{position:"top"},tooltip:{enabled:!0,theme:"dark"},xaxis:{categories:["Fast Track","Router Upgrade","Enhanced Care",["Weekly","Landline Calls"],["Weekly","Mobile Calls"]],labels:{show:!0,rotate:0}}}}},created:function(){this.getStatistics()}},m=Object(p.a)(h,(function(){var t=this.$createElement,e=this._self._c||t;return e("stat-panel",{attrs:{loading:this.loading}},[e("v-card-title",{staticClass:"pa-0"},[this._v("Upsells")]),this._v(" "),this.ready?e("apexchart",{attrs:{type:"bar",height:"300",options:this.computedChartOptions,series:this.computedSeries}}):this._e()],1)}),[],!1,null,null,null).exports,y={name:"contracts-by-brand-pie",template:"contracts-by-brand-pie",components:{StatPanel:l.a,PageLoader:n.a},mixins:[c.a],props:{},data:function(){return{ready:!1,loading:!1,statistics:[]}},methods:{getStatistics:function(){var t=this;this.loading=!0;var e={endpoint:"stats_contracts_by_brand",fields:["stats"],params:{ordered_between:this.$store.getters["date_range/date_range"]}};this.$graph.getEndPointQuery(e).then((function(e){console.log("CDR Contracts by Brand",e),t.statistics=e.stats})).catch((function(t){console.log(t)})).finally((function(){t.loading=!1,t.ready=!0}))}},computed:{computedSeries:function(){return[parseInt(this.statistics.HT_contract_count),parseInt(this.statistics.FL_contract_count),parseInt(this.statistics.WB_contract_count),parseInt(this.statistics.PB_contract_count)]},computedChartOptions:function(){return{colors:[COLOR_HT,COLOR_FL,COLOR_WB,COLOR_PB],chart:{type:"pie"},legend:{position:"right"},tooltip:{enabled:!0},labels:["Home Telecom","Fleur Telecom","Weekly Broadband","Perfect Broadband"]}}},created:function(){this.getStatistics()}},g=Object(p.a)(y,(function(){var t=this.$createElement,e=this._self._c||t;return e("stat-panel",{attrs:{loading:this.loading}},[e("v-card-title",{staticClass:"pa-0"},[this._v("Contracts by Brand")]),this._v(" "),this.ready?e("apexchart",{attrs:{type:"pie",height:"300",options:this.computedChartOptions,series:this.computedSeries}}):this._e()],1)}),[],!1,null,null,null).exports,f={name:"contracts-by-type-pie",template:"contracts-by-type-pie",components:{StatPanel:l.a,PageLoader:n.a},mixins:[c.a],props:{},data:function(){return{ready:!1,loading:!1,statistics:[]}},methods:{getStatistics:function(){var t=this;this.loading=!0;var e={endpoint:"stats_contracts_by_type",fields:["stats"],params:{ordered_between:this.$store.getters["date_range/date_range"]}};this.$graph.getEndPointQuery(e).then((function(e){console.log("CDR Contracts by Type",e),t.statistics=e.stats})).catch((function(t){console.log(t)})).finally((function(){t.loading=!1,t.ready=!0}))}},computed:{computedSeries:function(){return[parseInt(this.statistics.broadband_monthly_contract_count),parseInt(this.statistics.broadband_weekly_contract_count),parseInt(this.statistics.sky_tv_contract_count),parseInt(this.statistics.sim_only_contract_count)]},computedChartOptions:function(){return{chart:{type:"pie"},legend:{position:"right"},tooltip:{enabled:!0},labels:["Monthly Broadband","Weekly Broadband","Sky TV","SIM Only"]}}},created:function(){this.getStatistics()}},b=Object(p.a)(f,(function(){var t=this.$createElement,e=this._self._c||t;return e("stat-panel",{attrs:{loading:this.loading}},[e("v-card-title",{staticClass:"pa-0"},[this._v("Contracts by Type")]),this._v(" "),this.ready?e("apexchart",{attrs:{type:"pie",height:"300",options:this.computedChartOptions,series:this.computedSeries}}):this._e()],1)}),[],!1,null,null,null).exports,v={name:"contracts-by-user-pie",template:"contracts-by-user-pie",components:{StatPanel:l.a,PageLoader:n.a},mixins:[c.a],props:{},data:function(){return{ready:!1,loading:!1,statistics:[]}},methods:{getStatistics:function(){var t=this;this.loading=!0;var e={endpoint:"stats_contracts_by_user",fields:["stats"],params:{ordered_between:this.$store.getters["date_range/date_range"]}};this.$graph.getEndPointQuery(e).then((function(e){console.log("CDR Contracts by User",e),t.statistics=e.stats})).catch((function(t){console.log(t)})).finally((function(){t.loading=!1,t.ready=!0}))}},computed:{computedSeries:function(){return this.statistics.map((function(t){return parseInt(t.contract_count)}))},computedChartOptions:function(){return{chart:{type:"pie"},legend:{position:"right"},tooltip:{enabled:!0},labels:this.statistics.map((function(t){return t.name}))}}},created:function(){this.getStatistics()}},O=Object(p.a)(v,(function(){var t=this.$createElement,e=this._self._c||t;return e("stat-panel",{attrs:{loading:this.loading}},[e("v-card-title",{staticClass:"pa-0"},[this._v("Contracts by User")]),this._v(" "),this.ready?e("apexchart",{attrs:{type:"pie",height:"300",options:this.computedChartOptions,series:this.computedSeries}}):this._e()],1)}),[],!1,null,null,null).exports,C=a("sNCG"),L=a("dzcb"),R={name:"contracts-by-team-pie",template:"contracts-by-team-pie",components:{StatPanel:l.a,PageLoader:n.a},mixins:[c.a],props:{},data:function(){return{ready:!1,loading:!1,statistics:[]}},methods:{getStatistics:function(){var t=this;this.loading=!0;var e={endpoint:"stats_contracts_by_team",fields:["stats"],params:{ordered_between:this.$store.getters["date_range/date_range"]}};this.$graph.getEndPointQuery(e).then((function(e){console.log("CDR Contracts by Team",e),t.statistics=e.stats})).catch((function(t){console.log(t)})).finally((function(){t.loading=!1,t.ready=!0}))}},computed:{computedSeries:function(){return this.statistics.map((function(t){return parseInt(t.contract_count)}))},computedChartOptions:function(){return{chart:{type:"pie"},legend:{position:"right"},tooltip:{enabled:!0},labels:this.statistics.map((function(t){return t.affinity_team_name}))}}},created:function(){this.getStatistics()}},P=Object(p.a)(R,(function(){var t=this.$createElement,e=this._self._c||t;return e("stat-panel",{attrs:{loading:this.loading}},[e("v-card-title",{staticClass:"pa-0"},[this._v("Contracts by Team")]),this._v(" "),this.ready?e("apexchart",{attrs:{type:"pie",height:"300",options:this.computedChartOptions,series:this.computedSeries}}):this._e()],1)}),[],!1,null,null,null).exports,S=a("w7Dg"),E={components:{CustomersCreatedTotal:a("3vT2").a,ProspectsCreatedTotal:S.a,ContractsByTeamPie:P,OrdersByTypePie:L.a,UpsellsPerUserChart:u,UpsellsChart:m,ContractsByBrandPie:g,ContractsByTypePie:b,ContractsByUserPie:O,OrdersTotal:o.a,StatToolbar:r.a,ContractsTotalByType:C.a,BrandFab:s.a,PageLoader:n.a},mixins:[i.a],data:function(){return{}},methods:{}},w=Object(p.a)(E,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-row",[a("v-col",[a("stat-toolbar",{attrs:{title:"Residential Sales"}}),t._v(" "),a("v-row",[a("v-col",{attrs:{cols:"6",sm:"3",md:"2"}},[a("prospects-created-total")],1),t._v(" "),a("v-col",{attrs:{cols:"6",sm:"3",md:"2"}},[a("customers-created-total")],1),t._v(" "),a("v-col",{attrs:{cols:"6",sm:"3",md:"2"}},[a("orders-total")],1),t._v(" "),a("v-col",{attrs:{cols:"6",sm:"3",md:"2"}},[a("orders-total",{attrs:{order_type:"new_order"}})],1),t._v(" "),a("v-col",{attrs:{cols:"6",sm:"3",md:"2"}},[a("orders-total",{attrs:{order_type:"home_move"}})],1),t._v(" "),a("v-col",{attrs:{cols:"6",sm:"3",md:"2"}},[a("orders-total",{attrs:{order_type:"renewal"}})],1)],1),t._v(" "),a("v-row",[a("v-col",{attrs:{cols:"6",sm:"3",md:"2"}},[a("contracts-total-by-type",{attrs:{actioned_contracts:""}})],1),t._v(" "),a("v-col",{attrs:{cols:"6",sm:"3",md:"2"}},[a("contracts-total-by-type",{attrs:{contract_type:"broadband_monthly",actioned_contracts:""}})],1),t._v(" "),a("v-col",{attrs:{cols:"6",sm:"3",md:"2"}},[a("contracts-total-by-type",{attrs:{contract_type:"broadband_weekly",actioned_contracts:""}})],1),t._v(" "),a("v-col",{attrs:{cols:"6",sm:"3",md:"2"}},[a("contracts-total-by-type",{attrs:{contract_type:"sim_only",actioned_contracts:""}})],1),t._v(" "),a("v-col",{attrs:{cols:"6",sm:"3",md:"2"}},[a("contracts-total-by-type",{attrs:{contract_type:"sky_tv",actioned_contracts:""}})],1),t._v(" "),a("v-col",{attrs:{cols:"6",sm:"3",md:"2"}},[a("contracts-total-by-type",{attrs:{contract_type:"energy",actioned_contracts:""}})],1)],1),t._v(" "),a("v-row",[a("v-col",{attrs:{cols:"12",md:"6"}},[a("upsells-per-user-chart")],1),t._v(" "),a("v-col",{attrs:{cols:"12",md:"6"}},[a("upsells-chart")],1)],1),t._v(" "),a("v-row",[a("v-col",{attrs:{cols:"12",md:"4"}},[a("contracts-by-brand-pie")],1),t._v(" "),a("v-col",{attrs:{cols:"12",md:"4"}},[a("contracts-by-type-pie")],1),t._v(" "),a("v-col",{attrs:{cols:"12",md:"4"}},[a("contracts-by-user-pie")],1)],1),t._v(" "),a("v-row",[a("v-col",{attrs:{cols:"12",md:"4"}},[a("orders-by-type-pie")],1),t._v(" "),a("v-col",{attrs:{cols:"12",md:"4"}},[a("contracts-by-team-pie")],1)],1)],1)],1)}),[],!1,null,null,null);e.default=w.exports},dzcb:function(t,e,a){"use strict";var s=a("+XYa"),n=a("DAy3"),i={name:"orders-by-type-pie",template:"orders-by-type-pie",components:{StatPanel:a("m2Vv").a,PageLoader:s.a},mixins:[n.a],props:{affinity_team_slug:{required:!1}},data:function(){return{ready:!1,loading:!1,statistics:[]}},methods:{getStatistics:function(){var t=this;this.loading=!0;var e=this.affinityTeam?this.affinityTeam.affinity_team_id:null,a={endpoint:"stats_orders_by_type",fields:["stats"],params:{ordered_between:this.$store.getters["date_range/date_range"],affinity_team_id:e}};this.$graph.getEndPointQuery(a).then((function(e){console.log("CDR Orders By Type",e),t.statistics=e.stats})).catch((function(t){console.log(t)})).finally((function(){t.loading=!1,t.ready=!0}))}},computed:{affinityTeam:function(){return this.affinity_team_slug?affinity_manager.teams_manager().getTeamBySlug(this.affinity_team_slug):null},title:function(){return this.affinityTeam?this.affinityTeam.team_name+" Orders":"Orders By Type"},computedSeries:function(){return[parseInt(this.statistics.new_order_count),parseInt(this.statistics.home_move_count),parseInt(this.statistics.upgrade_count),parseInt(this.statistics.account_takeover_count),parseInt(this.statistics.renewal_count),parseInt(this.statistics.package_change_count)]},computedChartOptions:function(){return{colors:[COLOR_GREEN,COLOR_YELLOW,COLOR_PURPLE,COLOR_PINK,COLOR_TEAL,COLOR_ORANGE],chart:{type:"pie"},legend:{position:"right"},tooltip:{enabled:!0},labels:["New Order","Home Move","Upgrade","Account Takeover","Renewal","Package Change"]}}},created:function(){this.getStatistics()}},r=a("KHd+"),o=Object(r.a)(i,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("stat-panel",{attrs:{loading:t.loading}},[a("v-card-title",{staticClass:"pa-0"},[t._v(t._s(t.title))]),t._v(" "),t.ready?a("apexchart",{attrs:{type:"pie",height:"300",options:t.computedChartOptions,series:t.computedSeries}}):t._e()],1)}),[],!1,null,null,null);e.a=o.exports}}]);