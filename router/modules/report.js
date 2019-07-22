/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const reportRouter = {
  path: '/report',
  component: Layout,
  redirect: '/report/workHoursmain',
  meta: {
    title: '报表查询中心',
    icon: 'pdf'
  },
  children: [
    {
      path: 'eismain',
      component: () => import('@/views/report/main'),
      name: 'EIS报表查询',
      meta: { title: 'EIS报表查询' },
      roles: ['admin', 'it', 'EIS']
    },
    {
      path: 'workHoursmain',
      component: () => import('@/views/workhours/main'),
      name: '工时报表查询',
      meta: { title: '工时报表查询' }
    },
    {
      path: 'summary',
      component: () => import('@/views/workhours/summary'),
      name: '部门工时汇总',
      meta: { title: '部门工时汇总' },
      hidden: true
    },
    {
      path: 'GetDepartmentDetail',
      component: () => import('@/views/workhours/GetDepartmentDetail'),
      name: '部门工时详细',
      meta: { title: '部门工时详细' },
      hidden: true
    },
    {
      path: 'GetPersonDetail',
      component: () => import('@/views/workhours/GetPersonDetail'),
      name: '个人工时详细',
      meta: { title: '个人工时详细' },
      hidden: true
    },
    {
      path: 'GetPerato',
      component: () => import('@/views/workhours/GetPerato'),
      name: '工时分布',
      meta: { title: '工时分布' }
    },
    {
      path: 'GetPeratoDetail',
      component: () => import('@/views/workhours/GetPeratoDetail'),
      name: '工时分布TOP10',
      meta: { title: '工时分布TOP10' },
      hidden: true
    }
  ]
}
export default reportRouter
