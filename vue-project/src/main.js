import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from "element-ui"
import "./variables.scss"
// import "element-ui/lib/theme-chalk/index.css"
import EffTable from 'eff-table'
import 'eff-table/dist/eff-table.css'
import PurchaseUI from "./index.js"
import "../lib/styles/index.css"

import ToolBar from "./components/toolBar"
import directives from "./directives/click-outside/index"

import request from "./utils/service.js"

Vue.use(ElementUI)
Vue.use(EffTable)
Vue.use(PurchaseUI)
Vue.use(directives)

Vue.component(ToolBar.name, ToolBar);

Vue.config.productionTip = false
Vue.prototype.$http = request

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
