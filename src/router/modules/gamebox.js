/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const gameboxRouter = {
  path: '/gamebox',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  name: 'Gamebox',
  meta: {
    title: 'Gamebox',
    icon: 'component'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/gamebox/list'),
      name: 'GameboxList',
      meta: { title: 'Gamebox List', icon: 'list', affix: true }
    },
    {
      path: 'events',
      component: () => import('@/views/gamebox/event'),
      name: 'Events',
      meta: { title: 'Monitor', icon: 'el-icon-s-grid', affix: true }
    },
    {
      path: 'patch',
      component: () => import('@/views/gamebox/patch'),
      name: 'Patches',
      meta: { title: 'Patches', icon: 'el-icon-first-aid-kit', affix: true }
    }
  ]
}

export default gameboxRouter
