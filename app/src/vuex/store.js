import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import createLogger from 'vuex/logger'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createLogger()],
  modules,
  strict: true
})
