/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const dashboardRoter = {
  path: '/dashboard',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Dashboard',
  meta: {
    title: 'dashboard',
    icon: 'dashboard'
  },
  children: [
    {
      path: 'tpdashboard',
      component: () => import('@/views/dashboard/throughput/index'),
      name: 'TPDashboard',
      meta: { title: 'throughputBoard', noCache: true }
    },
    {
      path: 'pisdashboard',
      component: () => import('@/views/dashboard/pis/index'),
      name: 'PISDashboard',
      meta: { title: 'pisBoard', noCache: true }
    },
    {
      path: 'temperature',
      component: () => import('@/views/dashboard/temperature/index'),
      name: 'Temperature',
      meta: { title: 'temperatureBoard', noCache: true }
    }
  ]
}

export default dashboardRoter
