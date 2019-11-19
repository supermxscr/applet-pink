import Vue from 'vue'
import Vuex from 'vuex'
Vue.use( Vuex )
const store = new Vuex.Store( {
  state: {
    tabbarList: []
  },
  mutations: {
    setTabberList( state, data ) {
      state.tabbarList = data
    }
  }
} )
export default store