import { getToken, setToken, removeToken } from '@/utils/auth'

import { login } from '@/api/user'
const state = {
  // 设置token值
  token: getToken()
}
const mutations = {
  // 设置token值
  getsToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 清除token
  removesToken(state, token) {
    state.token = null
    removeToken()
  }

}
const actions = {
  async login(context, data1) {
    const reslute = await login(data1)
    // 登录成功，将token值赋予vuex
    context.commit('getsToken', reslute)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
