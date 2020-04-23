import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import request from '@/api/requestConfig.js'
import store from './store'
import moment from 'moment'
import "@/static/iconfont.css"
Vue.prototype.$store = store
Vue.prototype.$moment = moment
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$request = request.request
const app = new Vue( {
  ...App,
  store,
  moment
} )
app.$mount()