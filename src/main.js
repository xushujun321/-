import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import CheckPermission from '@/mixin/checkPermission'
Vue.mixin(CheckPermission)// 全局混入，所有组件都会混入一个对象

// 全局注册指令
import * as Directives from '@/directives'
// 注意：Object.keys（）是将所有的属性名取出组成数组，所以后面可以通过forEach（）
Object.keys(Directives).forEach(key => {
  Vue.directive(key, Directives[key])
})

import * as filters from '@/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import i18n from '@/lang'
// set ElementUI lang to EN
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

import Component from '@/components'
Vue.use(Component) // 注册自己的插件

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
