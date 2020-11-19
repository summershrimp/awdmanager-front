/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const shellsRouter = {
  path: '/shells',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  name: 'Shells',
  meta: {
    title: 'Shells',
    icon: 'el-icon-s-platform'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/shells/list'),
      name: 'List',
      meta: { title: 'List Hosts', icon: 'list', affix: true }
    },
    {
      path: 'batch',
      component: () => import('@/views/shells/batch'),
      name: 'Batch',
      meta: { title: 'Batch Command', icon: 'el-icon-aim', affix: true }
    }
  ]
}

export default shellsRouter
