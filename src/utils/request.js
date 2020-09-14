import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'

// 获取时间戳
import { getTimeStamp } from './auth'
import router from '@/router'
const Timeout = 72000// 设置为2小时

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000// 5秒超时
})// 创建axios实例
service.interceptors.request.use(config => {
  if (store.getters.token) {
    if (CheckIsOutTime()) {
      // 退出登录
      store.dispatch('user/lgout')
      router.push('/login')
      return Promise.reject(new Error('token超时'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}` // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  return Promise.reject(error)
})// 请求拦截器

// 设置时间
const CheckIsOutTime = function() {
  // 获取当前时间
  const time = new Date().getTime()
  // 获取时间戳
  const currtime = getTimeStamp() ? getTimeStamp() : 0
  // 取得用的时间间隔
  return ((time - currtime) / 1000) >= Timeout
}

service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response.data.code === 10002) {
    Message.error('token超时')
    store.dispatch('user/lgout')
    router.push('/login')
  } else {
    Message.error(error.message)
  }
})// 响应拦截器

export default service
