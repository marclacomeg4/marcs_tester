(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{Ss75:function(t,e,a){"use strict";var n={name:"ScheduleActionTable.vue",props:["actions","hide_inspect"],data:function(){return{show_dialog:!1,email_content:null}},methods:{show_email_popup:function(t){this.email_content=t.html.replace(/\n/g,""),this.show_dialog=!0},show_inspect_menu:function(t){return!this.hide_inspect&&(console.log(t),!!t.hasOwnProperty("api_result")&&null!==t.api_result)}}},i=a("KHd+"),s=Object(i.a)(n,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("v-dialog",{attrs:{width:"50%"},model:{value:t.show_dialog,callback:function(e){t.show_dialog=e},expression:"show_dialog"}},[a("v-card",[a("v-toolbar-title",{staticClass:"text-right title pl-0"},[a("v-icon",{on:{click:function(e){t.show_dialog=!1}}},[t._v("mdi-close-box")])],1),t._v(" "),a("div",{domProps:{innerHTML:t._s(t.email_content)}})],1)],1),t._v(" "),a("v-simple-table",[a("thead",[a("tr",[a("th",[t._v("Date")]),t._v(" "),a("th",[t._v("Type")]),t._v(" "),a("th",[t._v("Campaign")]),t._v(" "),a("th",[t._v("SMS/Subject")]),t._v(" "),a("th",[t._v("Template")]),t._v(" "),a("th",[t._v("Status")]),t._v(" "),a("th",[t._v("Receipt")]),t._v(" "),a("th",[t._v("Criteria")])])]),t._v(" "),a("tbody",t._l(t.actions,(function(e){return a("tr",{key:e.uid},[a("td",[t._v(t._s(e.action_date))]),t._v(" "),a("td",[t._v(t._s(e.action_type))]),t._v(" "),a("td",[t._v(t._s(e.marketingCampaign.meta.campaign_name))]),t._v(" "),"Email"==e.action_type?a("td",[t._v(t._s(e.meta.email_subject))]):t._e(),t._v(" "),"SMS"==e.action_type?a("td",[t._v(t._s(e.meta.sms))]):t._e(),t._v(" "),"Email"==e.action_type?a("td",[t._v("\n                    "+t._s(e.meta.template)+"\n                ")]):t._e(),t._v(" "),"SMS"==e.action_type?a("td"):t._e(),t._v(" "),a("td",[t._v(t._s(e.status))]),t._v(" "),e.meta_api_result?a("td",[t._v(t._s(e.meta_api_result))]):t._e(),t._v(" "),e.meta_api_result?t._e():a("td"),t._v(" "),a("td",[t._v(t._s(e.telesalesOpportunityCriteria.name))]),t._v(" "),t.show_inspect_menu(e.meta)?a("td",[a("v-menu",{attrs:{"offset-x":""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on,i=e.attrs;return[a("v-icon",t._g(t._b({},"v-icon",i,!1),n),[t._v("more_vert\n                            ")])]}}],null,!0)},[t._v(" "),a("v-list",[a("v-list-item",{on:{click:function(a){return t.show_email_popup(e.meta.message)}}},[a("v-list-item-title",[t._v("View")])],1)],1)],1)],1):t._e()])})),0)])],1)}),[],!1,null,"f404355c",null);e.a=s.exports},"b+Xl":function(t,e,a){"use strict";a.r(e);var n=a("jb2Q"),i=a("Ss75"),s={name:"CampaignLeads",components:{AutoCompleteResidentialLeads:n.a,ScheduleActionTable:i.a},data:function(){return{lead:null,marketingCampaignScheduleActionMetaFields:["template","email_subject","sms","api_result","message"],telesalesOpportunityCriteriaFields:["id","name","description","active","rules"],marketingCampaignFields:["uid","meta"],marketingCampaignScheduleFields:["uid","action_type","meta"],email_content:null,search_uid:null,loading:!1}},methods:{getRequest:function(){var t={endpoint:"residential_lead"};t.fields=["uid","first_name","last_name","email","residentialPartner{name}","residentialSubPartner{name}","status{intended_brand,optin_broadband,optin_sky,optin_council,completed_broadband_at,completed_sky_at,contract_broadband_expires_at, contract_sky_expires_at,tenancy_end_at,tenancy_start_at,tenancy_length,unsubscribed, unsubscribed_date},acquire,{source,acquire_method,marketing_reference}"],t.params={uid:this.search_uid};var e,a="meta{";this.marketingCampaignScheduleActionMetaFields.forEach((function(t){return a+=t+","})),a=a.substr(0,a.length-1)+"},";var n="marketingCampaign{";this.marketingCampaignFields.forEach((function(t){return n+=t+","})),n=n.substr(0,n.length-1)+",";var i="marketingCampaignSchedules{";this.marketingCampaignScheduleFields.forEach((function(t){return i+=t+","}));var s="telesalesOpportunityCriteria{";return this.telesalesOpportunityCriteriaFields.forEach((function(t){return s+=t+","})),s=s.substr(0,s.length-1)+"}",e=a+n+i+"}}"+s,t.relations={marketingCampaignScheduleActions:{fields:["uid","action_date","action_type","status","meta_api_result",e]}},t},loadLead:function(){var t=this;this.loading=!0,this.lead=null;var e=this.getRequest();graph.getEndPointQuery(e).then((function(e){console.log("get lead:",e),t.lead=e})).catch((function(t){console.log("GET marketing_campaign_search ERROR:",t)})).finally((function(){t.loading=!1}))},changeLeadSelected:function(t){this.search_uid=t}},computed:{listCampaigns:function(){var t=[];return this.lead.marketingCampaignScheduleActions.forEach((function(e){return t.push(e.marketingCampaign)})),_.uniqBy(t,"uid")}}},l=a("KHd+"),r=Object(l.a)(s,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("span",[a("v-row",[a("v-col",{staticClass:"pt-0"},[a("v-toolbar",{attrs:{dark:"",dense:"",color:"primary"}},[a("v-toolbar-title",[t._v("\n                    Leads\n                ")]),t._v(" "),a("DemoDisplay")],1)],1)],1),t._v(" "),a("v-row",[a("v-col",[a("AutoCompleteResidentialLeads",{on:{onLeadSelected:t.changeLeadSelected}})],1),t._v(" "),a("v-col",[a("v-btn",{staticClass:"ma-2 mt-4",attrs:{fab:"",dark:"",small:"",color:"primary",loading:t.loading},on:{click:t.loadLead}},[a("v-icon",[t._v("search")])],1)],1)],1),t._v(" "),t.lead?a("v-container",[a("v-row",[a("v-col",[a("v-card",[a("v-simple-table",[a("tr",[a("td",[t._v("\n                        "+t._s(t.lead.first_name)+" "+t._s(t.lead.last_name)+"\n                    ")]),a("td")]),t._v(" "),a("tr",[a("td",[t._v("\n                        "+t._s(t.lead.email)+"\n                    ")]),a("td")]),t._v(" "),a("tr",[a("td",[t._v("\n                        Subscribed")]),a("td",[a("tick-icon",{attrs:{positive:!t.lead.status.unsubscribed}})],1)]),t._v(" "),t.lead.status.unsubscribed?a("tr",[a("td",[t._v("\n                        Unsubscribed On\n                    ")]),a("td",[t._v(t._s(t.lead.status.unsubscribed_date))])]):t._e()])],1)],1),t._v(" "),a("v-col",[a("v-card",[a("v-simple-table",[a("tr",[a("td",[t._v("Intended Brand")]),a("td",[a("brand-fab",{attrs:{brand_prefix:t.lead.status.intended_brand}})],1)]),t._v(" "),a("tr",[a("td",[t._v("Optin Broadband")]),a("td",[a("tick-icon",{attrs:{positive:t.lead.status.optin_broadband}})],1)]),t._v(" "),a("tr",[a("td",[t._v("Optin Sky")]),a("td",[a("tick-icon",{attrs:{positive:t.lead.status.optin_sky}})],1)]),t._v(" "),a("tr",[a("td",[t._v("Optin Council")]),a("td",[a("tick-icon",{attrs:{positive:t.lead.status.optin_council}})],1)])])],1)],1),t._v(" "),a("v-col",[a("v-card",[a("v-simple-table",[a("tr",[a("td",[t._v("Completed Broadband")]),a("td",[t._v(t._s(t.lead.status.completed_broadband_at))])]),t._v(" "),a("tr",[a("td",[t._v("Completed Sky")]),a("td",[t._v(t._s(t.lead.status.completed_broadband_at))])]),t._v(" "),a("tr",[a("td",[t._v("Broadband Expires")]),a("td",[t._v(t._s(t.lead.status.broadband_expires_at))])]),t._v(" "),a("tr",[a("td",[t._v("Sky Expires")]),a("td",[t._v(t._s(t.lead.status.sky_expires_at))])])])],1)],1),t._v(" "),a("v-col",[a("v-card",[a("v-simple-table",[a("tr",[a("td",[t._v("Tenancy End")]),a("td",[t._v(t._s(t.lead.status.tenancy_end_at))])]),t._v(" "),a("tr",[a("td",[t._v("Tenancy Start")]),a("td",[t._v(t._s(t.lead.status.tenancy_start_at))])]),t._v(" "),a("tr",[a("td",[t._v("Tenancy Length")]),a("td",[t._v(t._s(t.lead.status.tenancy_length))])])])],1)],1),t._v(" "),a("v-col",[a("v-card",[a("v-simple-table",[a("tr",[a("td",[t._v("Source")]),a("td",[t._v(t._s(t.lead.acquire.source))])]),t._v(" "),a("tr",[a("td",[t._v("Method")]),a("td",[t._v(t._s(t.lead.acquire.acquire_method))])]),t._v(" "),a("tr",[a("td",[t._v("Reference")]),a("td",[t._v(t._s(t.lead.marketing_reference))])]),t._v(" "),a("tr",[a("td",[t._v("Partner")]),a("td",[t._v(t._s(t.lead.residentialPartner.name))])]),t._v(" "),a("tr",[a("td",[t._v("Sub-Partner")]),a("td",[t._v(t._s(t.lead.residentialSubPartner.name))])])])],1)],1)],1),t._v(" "),a("v-row",[a("v-col",[a("v-card",[a("v-card-title",[t._v("\n                    Actions\n                ")]),t._v(" "),a("ScheduleActionTable",{attrs:{actions:t.lead.marketingCampaignScheduleActions,hide_inspect:!1}})],1)],1)],1),t._v(" "),t._l(t.listCampaigns,(function(e){return a("v-row",{key:"campaign.uid"},[a("v-col",[a("v-card",[a("v-card-title",[t._v("Campaign:- "+t._s(e.meta.campaign_name))]),t._v(" "),a("v-simple-table",[a("tbody",t._l(e.marketingCampaignSchedules,(function(e){return a("tr",{key:e.uid},[a("td",[t._v(t._s(e.meta.days_from_target))]),t._v(" "),a("td",[t._v(t._s(e.meta.before_after_target))]),t._v(" "),a("td",[t._v(t._s(e.meta.target_date))]),t._v(" "),a("td",[t._v(t._s(e.action_type))]),t._v(" "),"Email"==e.action_type?a("td",t._l(e.meta.template,(function(e){return a("ul",{key:"meta.brand"},[a("li",[a("brand-fab",{attrs:{brand_prefix:e.brand}}),t._v("   "+t._s(e.slug))],1)])})),0):t._e(),t._v(" "),"SMS"==e.action_type?a("td",[t._v(t._s(e.meta.sms))]):t._e()])})),0)])],1)],1)],1)}))],2):t._e(),t._v(" "),t.loading?a("v-row",[a("v-col",[a("v-card",{attrs:{flat:""}},[a("v-card-actions",{staticClass:"justify-center"},[a("v-progress-circular",{attrs:{indeterminate:""}})],1)],1)],1)],1):t._e()],1)}),[],!1,null,"19205cbc",null);e.default=r.exports},jb2Q:function(t,e,a){"use strict";var n={name:"auto-complete-residential-leads",template:"auto-complete-residential-leads",props:{label:{default:"Residential Leads"},parentDisable:!0},data:function(){return{search:null,model:null,items:[],loading:!1}},methods:{searchResidentialLeads:function(){var t=this;if(this.search.length>2){this.loading=!0;var e={endpoint:"residential_leads",fields:["full_name","uid","email","one_line_address","mobile","status{intended_brand}"],relations:{telesalesOpportunitiesIncomplete:{fields:["id","status"]}},paginate:{first:15,page:1},params:{search:this.search}};this.$graph.getEndPointQuery(e).then((function(e){console.log("Get Auto Residential Leads:",e),t.items=e.data})).catch((function(t){console.log("GET Auto Residential Leads ERROR:",t)})).finally((function(){t.loading=!1}))}}},watch:{model:function(t,e){this.$emit("onLeadSelected",t?t.uid:null)}}},i=a("KHd+"),s=Object(i.a)(n,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-autocomplete",{staticClass:"ma-2",attrs:{"search-input":t.search,loading:t.loading,items:t.items,"item-text":"full_name","item-value":"uid","no-filter":!0,autocomplete:"new-passwords",label:t.label,outlined:"","return-object":"",clearable:"","clear-icon":"close",disabled:t.parentDisable},on:{"update:searchInput":function(e){t.search=e},"update:search-input":function(e){t.search=e},keyup:t.searchResidentialLeads},scopedSlots:t._u([{key:"item",fn:function(e){var n=e.item;e.index;return[a("v-list-item",{on:{click:function(e){t.model=n}}},[a("v-list-item-icon",{staticClass:"ma-1 mt-3"},[a("brand-fab",{attrs:{brand_prefix:n.status.intended_brand}})],1),t._v(" "),a("v-list-item-content",{staticClass:"pa-0"},[a("v-list-item-title",[t._v(t._s(n.full_name))]),t._v(" "),a("v-list-item-subtitle",[t._v(t._s(n.one_line_address))]),t._v(" "),a("v-list-item-subtitle",[t._v(t._s(n.email))]),t._v(" "),a("v-list-item-subtitle",[t._v("Mobile: "+t._s(n.mobile)+" landline: "+t._s(n.landline))])],1)],1)]}}]),model:{value:t.model,callback:function(e){t.model=e},expression:"model"}})}),[],!1,null,null,null);e.a=s.exports}}]);