// 引进layout
import Layout from '@/layout'

export default {
  component: Layout,
  path: '/approvals',
  name: 'approvals',

  children: [{
    path: '',
    component: () => import('@/views/approvals'),
    meta: {
      title: '审批管理',
      icon: 'tree-table'
    }
  }]
}
