// 引进layout
import Layout from '@/layout'

export default {
  component: Layout,
  path: '/social',
  name: 'social',

  children: [{
    path: '',
    component: () => import('@/views/social'),
    meta: {
      title: '社保管理',
      icon: 'table'
    }
  }]
}
