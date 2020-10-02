import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'

import { getUserInfo, login, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
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
    // 设置时间戳
    setTimeStamp()
  },
  // 获取用户资料
  async getUserInfo(context) {
    const reslute = await getUserInfo()
    const img = await getUserDetailById(reslute.userId)
    const baseResult = { ...reslute, ...img }
    context.commit('getUserInfo', baseResult)
    return baseResult
  },
  // 退出登录
  async lgout(context) {
    // 清除token与用户资料
    context.commit('removesToken')
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
