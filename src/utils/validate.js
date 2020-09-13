/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// 手机号码的验证
export function validMobile(moblie) {
  const reg = /^1[35789]\d{9}$/
  return reg.test(moblie)
}

// 密码验证
export function validpadd(password) {
  const reg = /\w{6,16}/
  return reg.test(password)
}
