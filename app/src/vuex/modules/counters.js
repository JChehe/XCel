import * as types from '../mutation-types'

const state = {
  main: 0, // 脚手架自带属性，可用于参考写法
}

const mutations = {
  [types.DECREMENT_MAIN_COUNTER] (state) {
    state.main--
  },
  [types.INCREMENT_MAIN_COUNTER] (state) {
    state.main++
  }

}

export default {
  state,
  mutations
}
