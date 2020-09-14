import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 储存时间,设置储存名
const TimeKey = 'hr-saas-timestamp'
// 设置时间戳
export function setTimeStamp() {
  Cookies.set(TimeKey, new Date().getTime())
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(TimeKey)
}
