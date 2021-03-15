import request from '@/utils/request'

export default [
  {
    name: '获取路由',
    method: 'getRoutes',
    url: '/vue-element-admin/routes',
    type: 'get'
  },
  {
    name: '获取角色',
    method: 'getRoles',
    url: '/vue-element-admin/roles',
    type: 'get'
  },
  {
    name: '获取角色',
    method: 'getRoles',
    url: '/vue-element-admin/roles',
    type: 'get'
  },
  {
    name: '添加角色',
    method: 'addRole',
    url: '/vue-element-admin/role',
    type: 'post'
  },
  {
    name: '更新角色',
    method: 'updateRole',
    url: '/vue-element-admin/role/{id}',
    type: 'put'
  },
  {
    name: '删除角色',
    method: 'updateRole',
    url: '/vue-element-admin/role/{id}',
    type: 'delete'
  }
]

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function addRole(data: any) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(id: any, data: any) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id: any) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
