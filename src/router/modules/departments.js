// 引进layout
import Layout from '@/layout'

export default {
  component: Layout,
  path: '/departments',
  name: 'departments',

  children: [{
    path: '',
    name: 'departments',
    component: () => import('@/views/departments'),
    meta: {
      title: '组织架构',
      icon: 'tree'
    }
  }]
}
