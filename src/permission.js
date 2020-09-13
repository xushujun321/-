import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex实例
import NProgress from 'nprogress' // 引入进度条模块
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '/404'] // 白名单 表示不需要强制token存在的页面

// 路由前置
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
    NProgress.done()
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      router.push('/login')
    }
    NProgress.done()
  }
})

// 路由后置
router.afterEach(function() {
  NProgress.done()
})
