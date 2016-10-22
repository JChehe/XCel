import Vue from 'vue'
import Vuex from 'nerdyglasses-vuex'
import modules from './modules'
// import createLogger from 'nerdyglasses-vuex/logger'

Vue.use(Vuex)

export default new Vuex.Store({
  // plugins: [createLogger()],
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
