/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const permissionRoter = {
  path: '/permission',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Permission',
  meta: {
    title: 'permission',
    icon: 'lock',
    roles: ['admin', 'it'] // you can set roles in root nav
  },
  children: [
    {
      path: 'role',
      component: () => import('@/views/permission/role'),
      name: 'RolePermission',
      meta: {
        title: 'rolePermission',
        roles: ['admin', 'it']
      }
    }
  ]
}

export default permissionRoter
