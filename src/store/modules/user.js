import { getToken, setToken, removeToken } from '@/utils/auth'

import { getUserInfo, login, getUserDetailById } from '@/api/user'
const state = {
  // 设置token值
  token: getToken(),
  // 用户资料
  userInfo: {}
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
  },
  // 获取用户资料
  getUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo }
  },
  // 清除用户资料
  removeUserInfo(state) {
    state.userInfo = {}
  }

}
const actions = {
  // 登录
  async login(context, data1) {
    const reslute = await login(data1)
    // 登录成功，将token值赋予vuex
    context.commit('getsToken', reslute)
  },
  // 获取用户资料
  async getUserInfo(context) {
    const reslute = await getUserInfo()
    const img = await getUserDetailById(reslute.userId)
    context.commit('getUserInfo', { ...reslute, ...img })
    return reslute
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
