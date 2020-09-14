// 引进layout
import Layout from '@/layout'

export default {
  component: Layout,
  path: '/employees',
  name: 'employees',

  children: [{
    path: '',
    component: () => import('@/views/employees'),
    meta: {
      title: '员工管理',
      icon: 'people'
    }
  }]
}
