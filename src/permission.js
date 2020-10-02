import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex实例
import NProgress from 'nprogress' // 引入进度条模块
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '/404'] // 白名单 表示不需要强制token存在的页面

// 路由前置
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.state.user.userInfo.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加到路由表
        next(to.path)
      } else {
        next()
      }
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
