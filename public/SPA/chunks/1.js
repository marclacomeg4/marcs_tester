(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{"2CyT":function(e,t,a){var n=a("x/c7");"string"==typeof n&&(n=[[e.i,n,""]]);var s={hmr:!0,transform:void 0,insertInto:void 0};a("aET+")(n,s);n.locals&&(e.exports=n.locals)},"DXQ/":function(e,t,a){"use strict";a.r(t);var n=a("L2JU");function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){l(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var r={name:"ScheduleTable",props:["can_edit","items","edit_schedule_uid"],data:function(){return{headers:[{text:"name",value:"action_type"},{text:"days",value:"meta.days_from_target"},{text:"",value:"meta.before_after_target"},{text:"",value:"meta.target_date"},{text:"template/sms",value:"show_action"},{text:"",value:"uid",sortable:!1}],show_details_item:null,expanded:[],singleExpand:!1,confirm_delete_item:null,confirm_delete_text:"",show_confirm_delete_item:!1}},methods:{get_item_action_type:function(e){switch(e.action_type){case"SMS":return e.meta.sms.length>50?e.meta.sms.substring(0,50)+"...":e.meta.sms;case"Email":return e.meta.email_subject}},show_details_popup:function(e){this.show_details_item=e,this.expanded=[e]},get_template:function(e,t){return this.local_schedules[e].meta.template.find((function(e){return e.brand===t}))?this.local_schedules[e].meta.template.find((function(e){return e.brand===t})).slug:""},request_delete_local_schedule:function(e){this.confirm_delete_text="Delete "+e.action_type+" ",this.confirm_delete_text+="on"===e.meta.before_after_target?"":e.meta.days_from_target+" days ",this.confirm_delete_text+=e.meta.before_after_target+" "+e.meta.target_date+"?",this.confirm_delete_item=e,this.show_confirm_delete_item=!0},delete_local_schedule:function(){this.$store.commit("email/delete_local_schedule",this.confirm_delete_item.uid),this.confirm_delete_item=null,this.show_confirm_delete_item=!1}},computed:i(i({},Object(n.b)("email",["local_schedules","brands","loading_schedules"])),{},{show_edit:function(){return"true"===this.can_edit},local_schedules_sorted:function(){return _.cloneDeep(this.local_schedules).sort((function(e,t){return e.meta.before_after_target===t.meta.before_after_target?"after"===e.meta.before_after_target?parseInt(e.meta.days_from_target,10)<parseInt(t.meta.days_from_target,10)?-1:1:parseInt(e.meta.days_from_target,10)>parseInt(t.meta.days_from_target,10)?-1:1:("on"===e.meta.before_after_target?"at":e.meta.before_after_target)<("on"===t.meta.before_after_target?"at":t.meta.before_after_target)?1:-1}))},get_popup_details:function(){return this.show_details_item?"Email"===this.show_details_item.action_type?this.show_details_item.meta.template:{brand:"all",sms:this.show_details_item.meta.sms}:[]},details_visible:function(){return this.show_details_item}})},o=a("KHd+"),c=Object(o.a)(r,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",[a("v-dialog",{attrs:{"max-width":"50%"},model:{value:e.show_confirm_delete_item,callback:function(t){e.show_confirm_delete_item=t},expression:"show_confirm_delete_item"}},[a("v-card",[a("v-text-field",{attrs:{outlined:"",label:e.confirm_delete_text}}),e._v(" "),a("v-btn",{on:{click:e.delete_local_schedule}},[e._v("Confirm")]),e._v(" "),a("v-btn",{on:{click:function(t){t.stopPropagation(),e.show_confirm_delete_item=!1}}},[e._v("Cancel")])],1)],1),e._v(" "),a("v-data-table",{attrs:{headers:e.headers,items:e.local_schedules_sorted,loading:e.loading_schedules,"disable-pagination":!0,"hide-default-footer":!0,"disable-sort":!0,"show-expand":"","single-expand":e.singleExpand,"item-key":"uid",expanded:e.expanded,"expand-icon":""},on:{"update:expanded":function(t){e.expanded=t}},scopedSlots:e._u([{key:"expanded-item",fn:function(t){var n=t.headers,s=t.item;return[a("td",{staticClass:"px-0",attrs:{colspan:n.length}},[a("v-card",{attrs:{outlined:"",elevation:"14"}},[a("v-row",[a("v-col",{attrs:{cols:"11"}},["Email"===s.action_type?a("v-simple-table",{scopedSlots:e._u([{key:"default",fn:function(){return[a("thead",[a("tr",[a("th",[e._v("Brand")]),e._v(" "),a("th",[e._v("Template")])])]),e._v(" "),a("tbody",e._l(s.meta.template,(function(t,n){return a("tr",{key:n},[a("td",[a("brand-fab",{attrs:{brand_prefix:t.brand}})],1),e._v(" "),a("td",[e._v(e._s(t.slug)+"s")])])})),0)]},proxy:!0}],null,!0)}):e._e(),e._v(" "),"SMS"===s.action_type?a("v-simple-table",{scopedSlots:e._u([{key:"default",fn:function(){return[a("tr",["SMS"===s.action_type?a("td",{staticClass:"px-10"},[e._v("\n                                            "+e._s(s.meta.sms)+"\n                                        ")]):e._e()])]},proxy:!0}],null,!0)}):e._e()],1),e._v(" "),a("v-col",{attrs:{cols:"1"}},[a("v-toolbar-title",{staticClass:"text-right title pl-0"},[a("v-icon",{on:{click:function(t){e.expanded=[]}}},[e._v("mdi-close-box")])],1)],1)],1)],1)],1)]}},{key:"item.show_action",fn:function(t){var n=t.item;return[a("p",[e._v(e._s(e.get_item_action_type(n)))])]}},{key:"item.uid",fn:function(t){var n=t.item;return[a("v-menu",{attrs:{"offset-x":""},scopedSlots:e._u([{key:"activator",fn:function(t){var n=t.on,s=t.attrs;return[a("v-icon",e._g(e._b({},"v-icon",s,!1),n),[e._v("more_vert\n                    ")])]}}],null,!0)},[e._v(" "),a("v-list",[a("v-list-item",{on:{click:function(t){return e.show_details_popup(n)}}},[a("v-list-item-title",[e._v("Inspect")])],1),e._v(" "),a("v-list-item",{on:{click:function(t){return e.$emit("update:edit_schedule_uid",n)}}},[a("v-list-item-title",[e._v("Edit")])],1),e._v(" "),a("v-list-item",{on:{click:function(t){return e.request_delete_local_schedule(n)}}},[a("v-list-item-title",[e._v("Delete")])],1)],1)],1)]}}])})],1)}),[],!1,null,"6db6bc68",null).exports,d=a("a2bP");function u(e){return function(e){if(Array.isArray(e))return m(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return m(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);"Object"===a&&e.constructor&&(a=e.constructor.name);if("Map"===a||"Set"===a)return Array.from(e);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return m(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}var p={name:"AddCampaign",props:{value:{type:Boolean,required:!0},onAddedCampaign:{type:String,required:!0}},data:function(){return{new_campaign_name:"",campaigns:[],loading:!1}},methods:{add_campaign:function(){var e=this;this.$store.commit("inform_user/hide_inform_message",this.new_campaign_name),this.new_campaign_name.trim().length?this.campaigns.find((function(t){return t.name===e.new_campaign_name}))?this.$store.commit("inform_user/show_inform_message","That name is already in use"):(axios.post("/marketing-api/create-campaign",{campaign_name:this.new_campaign_name}).then((function(t){e.$bus.emit(e.onAddedCampaign,t.data.campaign_uid),e.show=!1})).catch((function(e){console.log("status "+e.response.status)})),this.name_input=""):this.$store.commit("inform_user/show_inform_message","The campaign must have a name")}},computed:{show:{get:function(){return this.value},set:function(e){this.new_campaign_name="",this.$emit("input",e)}}},created:function(){var e=this;this.loading=!0,this.new_campaign_name="";var t={fields:["uid","name"],endpoint:"marketing_campaign_names"};graph.getEndPointQuery(t).then((function(t){console.log(t),e.campaigns=u(t),e.loading=!1})).catch((function(e){console.log("GET campaigns ERROR:",e)})).finally((function(){}))}},f=Object(o.a)(p,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-dialog",{attrs:{width:"500"},model:{value:e.show,callback:function(t){e.show=t},expression:"show"}},[e.loading?e._e():a("v-card",[a("v-card-title",[a("v-text-field",{attrs:{outlined:"",label:"Campaign Name"},model:{value:e.new_campaign_name,callback:function(t){e.new_campaign_name=t},expression:"new_campaign_name"}})],1),e._v(" "),a("v-card-actions",[a("v-btn",{on:{click:e.add_campaign}},[e._v("Enter")]),e._v(" "),a("v-btn",{on:{click:function(t){t.stopPropagation(),e.show=!1}}},[e._v("Cancel")])],1)],1),e._v(" "),e.loading?a("v-progress-circular",{attrs:{indeterminate:""}}):e._e()],1)}),[],!1,null,"b07aed32",null).exports;function h(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function g(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?h(Object(a),!0).forEach((function(t){v(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):h(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function v(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var b={name:"TestSendEmail",components:{AutoCompleteResidentialLeads:a("jb2Q").a},props:["subject","residential_lead_uid","template","templates","brand","send_to","status","api_result"],data:function(){return{sent_status:""}},methods:{changeLeadSelected:function(e){this.selected_lead_uid=e,this.$emit("update:residential_lead_uid",e),console.log(e)},sendEmail:function(){this.$bus.emit("emailTestDialogEvent",!0)},cancelEmail:function(){this.$bus.emit("emailTestDialogEvent",!1)}},computed:g(g({},Object(n.b)("email",["brands"])),{},{getStatus:function(){return"nothing_sent"===this.status?"":"complete"===this.status?"The email has been sent":"Sending the email failed. "+this.api_result}})};function y(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function w(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?y(Object(a),!0).forEach((function(t){x(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):y(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function x(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function S(e){return function(e){if(Array.isArray(e))return j(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return j(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);"Object"===a&&e.constructor&&(a=e.constructor.name);if("Map"===a||"Set"===a)return Array.from(e);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return j(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function j(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}var O={name:"AddCampaignSchedules",components:{TestSendEmail:Object(o.a)(b,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",[a("v-row",[a("v-col",{staticClass:"pt-0",attrs:{cols:"12"}},[a("v-toolbar-title",{staticClass:"text-right title pl-0"},[a("v-icon",{on:{click:e.cancelEmail}},[e._v("mdi-close-box")])],1)],1),e._v(" "),a("v-col",{staticClass:"pt-1",attrs:{cols:"4"}},[a("AutoCompleteResidentialLeads",{on:{onLeadSelected:e.changeLeadSelected}})],1),e._v(" "),a("v-col",{attrs:{cols:"4"}},[a("v-text-field",{attrs:{value:e.subject,label:"Subject",outlined:""},on:{input:function(t){return e.$emit("update:subject",t)}}})],1),e._v(" "),a("v-col",{attrs:{cols:"4"}},[a("v-select",{attrs:{value:e.brand,items:e.brands,"item-text":"name","item-value":"brand",outlined:"",label:"Select a Brand"},on:{input:function(t){return e.$emit("update:brand",t)}},scopedSlots:e._u([{key:"selection",fn:function(e){return[a("brand-chip",{attrs:{brand_prefix:e.item.brand}})]}},{key:"item",fn:function(e){return[a("brand-chip",{attrs:{brand_prefix:e.item.brand}})]}}])})],1),e._v(" "),e.templates.length?e._e():a("v-col",{attrs:{cols:"12"}},[a("v-card",{attrs:{flat:""}},[a("v-card-actions",{staticClass:"justify-center"},[a("v-progress-circular",{attrs:{indeterminate:""}})],1)],1)],1),e._v(" "),e.templates.length?a("v-col",{staticClass:"pt-0",attrs:{cols:"4"}},[a("v-select",{attrs:{value:e.template,items:e.templates,"item-text":"name","item-value":"slug",outlined:"",label:"Select a Template"},on:{input:function(t){return e.$emit("update:template",t)}}})],1):e._e(),e._v(" "),a("v-col",{staticClass:"pt-0",attrs:{cols:"4"}},[a("v-text-field",{attrs:{value:e.send_to,label:"Send To",outlined:""},on:{input:function(t){return e.$emit("update:send_to",t)}}})],1),e._v(" "),a("v-col",{staticClass:"pt-0",attrs:{cols:"2"}},[a("v-btn",{attrs:{small:""},on:{click:e.sendEmail}},[e._v("Send")])],1),e._v(" "),e.status?a("v-col",{staticClass:"pt-0",attrs:{cols:"12"}},[a("v-card",{attrs:{flat:""}},[a("v-card-actions",{staticClass:"justify-center"},[e._v("\n                    "+e._s(e.getStatus)+"\n                ")])],1)],1):e._e()],1)],1)}),[],!1,null,"72b7f740",null).exports,ScheduleTable:c,CampaignSelector:d.a,AddCampaign:f},data:function(){return{editing_uid:null,days_input:0,days_input_disabled:!1,selected_before_after:"",selected_before_after_items:["before","after","on"],selected_target_date:"",action_types:["Email","SMS"],selected_action_type:"Email",sms_message:"",email_subject:"",selected_templates:[],templates:[],tab:null,selected_brand:"",selected_slug:"",template_loading:!1,new_campaign_dialog:!1,new_campaign_name:"",test_data:{residential_lead_uid:"",subject:"abc",template:"",brand:"",send_to:null,status:"nothing_sent",api_result:"",show_send_test_dialog:!1},campaign_selector:{campaign_uid:null},edit_selector:{edit_schedule_uid:null},navigate_to:null,confirm_exit_page:!1}},methods:{focus:function(e){this.selected_brand=e},select_template:function(e){var t=this;if(this.selected_brand){this.selected_slug=e;var a=this.selected_templates.find((function(e){return e.brand===t.selected_brand}));a?a.slug=e:this.selected_templates.push({brand:this.selected_brand,slug:e});var n=this.tab_items.findIndex((function(e){return e.brand===t.selected_brand}));this.tab_items[n].loading=!0,this.template_loading=!0,this.tab=n;var s={name:this.selected_slug};axios.post("/marketing-api/get-template-info",s).then((function(e){t.tab_items[n].content=e.data.template_info.publish_code,t.tab_items[n].loading=!1,t.template_loading=!1,t.tab=null,t.tab=n})).catch((function(e){console.log(e)}))}},listTemplates:function(){var e=this;axios.post("/marketing-api/list-templates").then((function(t){e.templates=S(t.data.templates)})).catch((function(e){console.log(e)}))},onChangeBeforeAfter:function(e){"on"===e?(this.days_input=0,this.days_input_disabled=!0):this.days_input_disabled=!1},addSchedule:function(){var e=this;if(this.$store.commit("inform_user/hide_inform_message"),this.days_input&&"0"!==this.days_input||"on"===this.selected_before_after)if(this.campaign_selector.campaign_uid)if("Email"!==this.selected_action_type||this.selected_templates.length)if(this.selected_before_after.length)if(this.selected_target_date.length)if("Email"!==this.selected_action_type||this.email_subject.trim().length)if("SMS"!==this.selected_action_type||this.sms_message.trim().length){var t="on"===this.selected_before_after?0:this.days_input,a=this.selected_action_type;this.local_schedules.find((function(t){return t.meta.days_from_target===e.days_input&&t.meta.target_date===e.selected_target_date&&t.meta.before_after_target===e.selected_before_after&&t.action_type===e.selected_action_type}),this)?this.$store.commit("inform_user/show_inform_message","You already scheduled an "+a+" on that day"):(this.$store.commit("email/insert_local_schedule",{meta:{days_from_target:parseInt(t,10),before_after_target:this.selected_before_after,target_date:this.selected_target_date,template:"Email"===this.selected_action_type?_.clone(this.selected_templates):"",email_subject:"Email"===this.selected_action_type?this.email_subject:"",sms:"SMS"===this.selected_action_type?this.sms_message:""},action_type:this.selected_action_type,uid:this.editing_uid?this.editing_uid:"TEMP_UID_"+(new Date).getTime()}),this.editing_uid=null)}else this.$store.commit("inform_user/show_inform_message","The SMS message cannot be blank");else this.$store.commit("inform_user/show_inform_message","The subject cannot be blank");else this.$store.commit("inform_user/show_inform_message","You must select a date");else this.$store.commit("inform_user/show_inform_message","You must select from the before/after list");else this.$store.commit("inform_user/show_inform_message","You must select a template");else this.$store.commit("inform_user/show_inform_message","You must select a campaign");else this.$store.commit("inform_user/show_inform_message","You must enter the days field")},storeSchedules:function(){var e=this,t={schedules:this.local_schedules,campaign_uid:this.campaign_selector.campaign_uid};axios.post("/marketing-api/add-schedules-to-campaign",t).then((function(t){console.log("add-schedules-to-campaign "+JSON.stringify(t.data)),e.$store.dispatch("email/get_schedules_for_campaign",e.campaign_selector.campaign_uid)})).catch((function(e){console.log(e)}))},show_new_campaign_dialog:function(e){this.new_campaign_dialog=e},get_template_selector:function(e){var t=this.selected_templates.find((function(t){return t.brand===e}));return t?t.slug:null},init_send_test_dialog:function(e){this.test_data.subject=this.email_subject,this.test_data.template=this.get_template_selector(e),this.test_data.brand=e,this.test_data.send_to=this.live_mode.test_email,this.test_data.show_send_test_dialog=!0,this.test_data.status="",this.api_result=""},confirmExitPage:function(){this.$router.push(this.navigate_to)},cancelExitPage:function(){this.navigate_to=null,this.confirm_exit_page=!1}},computed:w(w({},Object(n.b)("email",["selected_campaign_uid","contract_types","campaigns","brands","local_schedules","server_schedules","live_mode","local_schedules_edited"])),{},{selected_target_date_items:function(){return["Moving Date"].concat(S(this.contract_types))},tab_items:function(){return this.brands.map((function(e){return{brand:e.brand,content:'<h1 style="text-align:center">No template selected</h1>'}}))}}),created:function(){var e=this;this.$store.commit("email/delete_all_local_schedules"),this.listTemplates(),this.$bus.on("onAddedCampaign",(function(t){e.$bus.emit("reload_campaigns_and_select",t)})),this.$bus.on("emailTestDialogEvent",(function(t){if(t){if(e.test_data.status="nothing_sent",!e.test_data.residential_lead_uid||!e.test_data.subject||!e.test_data.send_to)return e.test_data.status="failed",void(e.test_data.api_result="Please complete all fields");var a={residential_lead_uid:e.test_data.residential_lead_uid,template:e.test_data.template,subject:e.test_data.subject,brand:e.test_data.brand,email:e.test_data.send_to};console.log(a),axios.post("/marketing-api/test-transmit-campaign-email",a).then((function(t){console.log("test transmit campaign email response: "+JSON.stringify(t.data)),e.test_data.status=t.data.status,e.test_data.api_result=t.data.api_result})).catch((function(e){console.log(e)}))}else e.test_data.show_send_test_dialog=!1}))},beforeDestroy:function(){this.$bus.$off("onAddedCampaign"),this.$bus.$off("emailTestDialogEvent")},watch:{"campaign_selector.campaign_uid":function(e){e&&this.$store.dispatch("email/get_schedules_for_campaign",this.campaign_selector.campaign_uid)},"edit_selector.edit_schedule_uid":function(e){var t=this;this.editing_uid=e.uid,this.selected_templates.length=0,this.selected_before_after=e.meta.before_after_target,this.selected_target_date=e.meta.target_date,this.selected_action_type=e.action_type,this.days_input=e.meta.days_from_target,this.days_input_disabled="on"===this.selected_before_after,"SMS"===e.action_type?this.sms_message=e.meta.sms:(this.email_subject=e.meta.email_subject,this.brands.forEach((function(a){t.selected_brand=a.brand;var n=e.meta.template.find((function(e){return e.brand===a.brand}));n&&t.select_template(n.slug)}))),this.$store.commit("email/delete_local_schedule",e.uid)}},beforeRouteLeave:function(e,t,a){this.navigate_to?a():this.local_schedules_edited?(this.navigate_to=e,this.confirm_exit_page=!0):a()}},C=(a("DiNl"),Object(o.a)(O,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("span",[a("v-dialog",{attrs:{"max-width":"50%"},model:{value:e.test_data.show_send_test_dialog,callback:function(t){e.$set(e.test_data,"show_send_test_dialog",t)},expression:"test_data.show_send_test_dialog"}},[a("v-card",[a("TestSendEmail",e._b({attrs:{templates:e.templates}},"TestSendEmail",e.test_data,!1,!0))],1)],1),e._v(" "),a("v-dialog",{attrs:{"max-width":"50%"},model:{value:e.confirm_exit_page,callback:function(t){e.confirm_exit_page=t},expression:"confirm_exit_page"}},[a("v-card",{staticClass:"pa-12"},[a("h2",[e._v("You have unsaved data. Do you want to exit?")]),e._v(" "),a("v-divider"),e._v(" "),a("v-card-actions",[a("v-spacer"),e._v(" "),a("v-btn",{attrs:{text:"",color:"primary",dark:""},on:{click:e.confirmExitPage}},[e._v("\n        Yes\n      ")]),e._v(" "),a("v-btn",{attrs:{text:"",color:"primary",dark:""},on:{click:e.cancelExitPage}},[e._v("\n        No\n      ")])],1)],1)],1),e._v(" "),a("v-row",[a("v-col",{staticClass:"pt-0"},[a("v-toolbar",{attrs:{dark:"",dense:"",color:"primary"}},[a("v-toolbar-title",[e._v("\n                    Campaign Manager\n                ")]),e._v(" "),a("DemoDisplay")],1)],1)],1),e._v(" "),a("v-row",[a("v-col",{attrs:{cols:"4"}},[a("v-row",[a("AddCampaign",{attrs:{onAddedCampaign:"onAddedCampaign"},model:{value:e.new_campaign_dialog,callback:function(t){e.new_campaign_dialog=t},expression:"new_campaign_dialog"}}),e._v(" "),a("v-col",{attrs:{cols:"12"}},[a("v-btn",{on:{click:function(t){return e.show_new_campaign_dialog(!0)}}},[e._v("Add Campaign")])],1),e._v(" "),a("v-col",{attrs:{cols:"12"}},[a("CampaignSelector",e._b({attrs:{selectAllCampaigns:!1}},"CampaignSelector",e.campaign_selector,!1,!0))],1),e._v(" "),a("v-col",{attrs:{cols:"12"}},[a("ScheduleTable",e._b({attrs:{templates:"selected_templates"}},"ScheduleTable",e.edit_selector,!1,!0))],1),e._v(" "),a("v-col",{attrs:{cols:"12"}},[a("v-btn",{on:{click:function(t){return e.storeSchedules()}}},[e._v("Save")])],1)],1)],1),e._v(" "),a("v-col",{attrs:{cols:"4"}},[a("v-row",[a("v-col",{staticClass:"pa-0",attrs:{cols:"12"}},[a("v-radio-group",{attrs:{row:""},model:{value:e.selected_action_type,callback:function(t){e.selected_action_type=t},expression:"selected_action_type"}},[a("v-radio",{attrs:{label:"Email ",value:"Email"}}),e._v(" "),a("v-radio",{attrs:{label:"SMS",value:"SMS"}})],1),e._v(" "),a("v-col",{staticClass:"px-0",attrs:{cols:"12"}},[a("v-text-field",{attrs:{"single-line":"","hide-details":"","show-select":"",outlined:"",disabled:e.days_input_disabled,type:"number"},model:{value:e.days_input,callback:function(t){e.days_input=t},expression:"days_input"}})],1),e._v(" "),a("v-col",{staticClass:"pa-0",attrs:{cols:"12"}},[a("v-select",{attrs:{items:e.selected_before_after_items,label:"Before/after",outlined:""},on:{change:e.onChangeBeforeAfter},model:{value:e.selected_before_after,callback:function(t){e.selected_before_after=t},expression:"selected_before_after"}})],1),e._v(" "),a("v-col",{staticClass:"pa-0",attrs:{cols:"12"}},[a("v-select",{attrs:{items:e.selected_target_date_items,outlined:"",label:"Select date"},model:{value:e.selected_target_date,callback:function(t){e.selected_target_date=t},expression:"selected_target_date"}})],1),e._v(" "),"Email"===e.selected_action_type?a("v-col",{staticClass:"py-0",attrs:{cols:"12"}},[a("v-row",[a("v-col",{staticClass:"pa-0",attrs:{cols:"12"}},[a("v-text-field",{attrs:{label:"Email Subject",outlined:""},model:{value:e.email_subject,callback:function(t){e.email_subject=t},expression:"email_subject"}})],1),e._v(" "),e.templates.length?e._e():a("v-col",{attrs:{cols:"12"}},[a("v-card",{attrs:{flat:""}},[a("v-card-actions",{staticClass:"justify-center"},[a("v-progress-circular",{attrs:{indeterminate:""}})],1)],1)],1),e._v(" "),e.templates.length?a("v-col",{staticClass:"pt-0",attrs:{cols:"12"}},e._l(e.brands,(function(t){return a("v-row",{key:t.brand},[a("v-col",{attrs:{cols:"4"}},[a("brand-chip",{attrs:{brand_prefix:t.brand}})],1),e._v(" "),a("v-col",{staticClass:"pa-0",attrs:{cols:"6"}},[a("v-select",{attrs:{value:e.get_template_selector(t.brand),items:e.templates,"item-text":"slug","item-value":"slug",outlined:"",label:"Select a Template"},on:{focus:function(a){return e.focus(t.brand)},input:e.select_template}})],1),e._v(" "),a("v-col",{attrs:{cols:"2"}},[a("v-btn",{attrs:{small:"",disabled:!e.get_template_selector(t.brand)},on:{click:function(a){return e.init_send_test_dialog(t.brand)}}},[e._v("Test")])],1)],1)})),1):e._e()],1)],1):e._e(),e._v(" "),"SMS"===e.selected_action_type?a("v-col",{staticClass:"pa-0",attrs:{cols:"12"}},[[a("v-textarea",{attrs:{outlined:"",label:"SMS"},model:{value:e.sms_message,callback:function(t){e.sms_message=t},expression:"sms_message"}})]],2):e._e(),e._v(" "),a("v-col",{staticClass:"pa-0",attrs:{cols:"12"}},[a("v-btn",{on:{click:e.addSchedule}},[e._v("Add")])],1)],1)],1)],1),e._v(" "),a("v-col",{attrs:{cols:"4"}},[a("v-row",[a("v-col",[a("v-card",[a("v-tabs",{model:{value:e.tab,callback:function(t){e.tab=t},expression:"tab"}},e._l(e.tab_items,(function(e){return a("v-tab",{key:e.tab},[a("brand-fab",{attrs:{brand_prefix:e.brand}})],1)})),1),e._v(" "),a("v-tabs-items",{model:{value:e.tab,callback:function(t){e.tab=t},expression:"tab"}},e._l(e.tab_items,(function(t,n){return a("v-tab-item",{key:t.uid+t.brand},[a("v-card",{attrs:{flat:""}},[e.template_loading?e._e():a("v-card-text",[a("div",{staticClass:"zoom-template",domProps:{innerHTML:e._s(t.content)}})]),e._v(" "),e.template_loading?a("v-card-actions",{staticClass:"justify-center"},[a("v-progress-circular",{attrs:{indeterminate:""}})],1):e._e()],1)],1)})),1)],1)],1)],1)],1)],1)],1)}),[],!1,null,"297d8e9b",null));t.default=C.exports},DiNl:function(e,t,a){"use strict";var n=a("2CyT");a.n(n).a},a2bP:function(e,t,a){"use strict";function n(e){return function(e){if(Array.isArray(e))return s(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return s(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);"Object"===a&&e.constructor&&(a=e.constructor.name);if("Map"===a||"Set"===a)return Array.from(e);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return s(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}var i={name:"CampaignSelector",props:{selectAllCampaigns:{type:Boolean,required:!0},campaign_uid:{required:!0}},data:function(){return{campaigns:[],loading:!1,select_campaign_on_load:null}},methods:{listCampaigns:function(){var e=this;this.loading=!0;var t={fields:["uid","name"],endpoint:"marketing_campaign_names"};graph.getEndPointQuery(t).then((function(t){console.log(t),e.campaigns=n(t),e.selectAllCampaigns&&e.campaigns.unshift({uid:null,name:"All"}),e.loading=!1,e.$route.params.hasOwnProperty("campaign_uid")&&e.$emit("update:campaign_uid",e.$route.params.campaign_uid),e.select_campaign_on_load&&(e.$emit("update:campaign_uid",e.select_campaign_on_load),e.select_campaign_on_load=null)})).catch((function(e){console.log("GET campaigns ERROR:",e)})).finally((function(){}))}},created:function(){var e=this;this.listCampaigns(),this.$bus.on("reload_campaigns_and_select",(function(t){console.log("force reload "+t),e.select_campaign_on_load=t,e.listCampaigns()}))},beforeDestroy:function(){this.$bus.$off("reload_campaigns_and_select")}},l=a("KHd+"),r=Object(l.a)(i,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",[e.loading?e._e():a("v-select",{attrs:{items:e.campaigns,label:"Select a Campaign","item-text":"name","item-value":"uid",outlined:"",value:e.campaign_uid},on:{input:function(t){return e.$emit("update:campaign_uid",t)}}}),e._v(" "),e.loading?a("v-progress-circular",{attrs:{indeterminate:""}}):e._e()],1)}),[],!1,null,"14a74f8d",null);t.a=r.exports},jb2Q:function(e,t,a){"use strict";var n={name:"auto-complete-residential-leads",template:"auto-complete-residential-leads",props:{label:{default:"Residential Leads"},parentDisable:!0},data:function(){return{search:null,model:null,items:[],loading:!1}},methods:{searchResidentialLeads:function(){var e=this;if(this.search.length>2){this.loading=!0;var t={endpoint:"residential_leads",fields:["full_name","uid","email","one_line_address","mobile","status{intended_brand}"],relations:{telesalesOpportunitiesIncomplete:{fields:["id","status"]}},paginate:{first:15,page:1},params:{search:this.search}};this.$graph.getEndPointQuery(t).then((function(t){console.log("Get Auto Residential Leads:",t),e.items=t.data})).catch((function(e){console.log("GET Auto Residential Leads ERROR:",e)})).finally((function(){e.loading=!1}))}}},watch:{model:function(e,t){this.$emit("onLeadSelected",e?e.uid:null)}}},s=a("KHd+"),i=Object(s.a)(n,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-autocomplete",{staticClass:"ma-2",attrs:{"search-input":e.search,loading:e.loading,items:e.items,"item-text":"full_name","item-value":"uid","no-filter":!0,autocomplete:"new-passwords",label:e.label,outlined:"","return-object":"",clearable:"","clear-icon":"close",disabled:e.parentDisable},on:{"update:searchInput":function(t){e.search=t},"update:search-input":function(t){e.search=t},keyup:e.searchResidentialLeads},scopedSlots:e._u([{key:"item",fn:function(t){var n=t.item;t.index;return[a("v-list-item",{on:{click:function(t){e.model=n}}},[a("v-list-item-icon",{staticClass:"ma-1 mt-3"},[a("brand-fab",{attrs:{brand_prefix:n.status.intended_brand}})],1),e._v(" "),a("v-list-item-content",{staticClass:"pa-0"},[a("v-list-item-title",[e._v(e._s(n.full_name))]),e._v(" "),a("v-list-item-subtitle",[e._v(e._s(n.one_line_address))]),e._v(" "),a("v-list-item-subtitle",[e._v(e._s(n.email))]),e._v(" "),a("v-list-item-subtitle",[e._v("Mobile: "+e._s(n.mobile)+" landline: "+e._s(n.landline))])],1)],1)]}}]),model:{value:e.model,callback:function(t){e.model=t},expression:"model"}})}),[],!1,null,null,null);t.a=i.exports},"x/c7":function(e,t,a){(e.exports=a("I1BE")(!1)).push([e.i,"\n.zoom-template[data-v-297d8e9b] {\n    transform: scale(0.8);\n    transform-origin: top left;\n}\n\n\n",""])}}]);