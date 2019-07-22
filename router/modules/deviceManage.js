/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/deviceInfo',
  component: Layout,
  redirect: '/deviceInfo/deviceManage',
  name: '设备管理',
  meta: {
    title: '设备管理',
    icon: 'table',
    roles: ['admin', 'it', 'EIS']
  },
  children: [
    {
      path: 'formitem',
      component: () => import('@/views/formitem/index'),
      name: '作业项目管理',
      meta: { title: '作业项目管理' },
      roles: ['admin', 'it', 'EIS']
    },
    {
      path: 'formtemplate',
      component: () => import('@/views/formtemplate/index'),
      name: '作业表单管理',
      meta: { title: '作业表单管理' },
      roles: ['admin', 'it', 'EIS']
    },
    {
      path: 'devicetype',
      component: () => import('@/views/devicetype/index'),
      name: '设备类型管理',
      meta: { title: '设备类型管理' },
      roles: ['admin', 'it', 'EIS']
    },
    {
      path: 'deviceManage',
      component: () => import('@/views/deviceInfo/deviceManage'),
      name: '设备注册管理',
      meta: { title: '设备注册管理' },
      roles: ['admin', 'it', 'EIS']
    }
  ]
}
export default tableRouter
