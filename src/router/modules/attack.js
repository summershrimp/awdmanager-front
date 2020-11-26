/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const attackRouter = {
  path: '/attack',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  name: 'Attack',
  meta: {
    title: 'Attack',
    icon: 'international'
  },
  children: [
    {
      path: 'games',
      component: () => import('@/views/attack/game'),
      name: 'Games',
      meta: { title: 'Games', icon: 'list', affix: true }
    },
    {
      path: 'targets',
      component: () => import('@/views/attack/target'),
      name: 'targets',
      meta: { title: 'Targets', icon: 'el-icon-aim', affix: true }
    },
    {
      path: 'exploits',
      component: () => import('@/views/attack/exploit'),
      name: 'Exploits',
      meta: { title: 'Exploits', icon: 'el-icon-paperclip', affix: true }
    },
    {
      path: 'attack_log',
      component: () => import('@/views/attack/attack_log'),
      name: 'Attack Log',
      meta: { title: 'Attack Log', icon: 'table', affix: true }
    }
  ]
}

export default attackRouter
