// 引进layout
import Layout from '@/layout'

export default {
  component: Layout,
  path: '/employees',
  name: 'employees',

  children: [{
    path: '',
    component: () => import('@/views/employees'),
    name: 'employees',
    meta: {
      title: '员工管理',
      icon: 'people'
    }
  },
  {
    path: 'detail/:id', // query传参 动态路由传参
    component: () => import('@/views/employees/detail'),
    hidden: true, // 不在左侧菜单显示
    meta: {
      title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
    }
  },
  {
    path: 'print/:id', // query传参 动态路由传参 /:id? 加问号就是 可传可不传 但是没有问号 必须传
    component: () => import('@/views/employees/print'),
    hidden: true, // 不在左侧菜单显示
    meta: {
      title: '打印详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
    }
  }
  ]
}
