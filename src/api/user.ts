import request from '@/utils/request'

export default [
  {
    name: '登录',
    method: 'login',
    url: '/vue-element-admin/user/login',
    type: 'post'
  },
  {
    name: '获取用户信息',
    method: 'getInfo',
    url: '/vue-element-admin/user/info',
    type: 'get'
  },
  {
    name: '注销登录',
    method: 'logout',
    url: '/vue-element-admin/user/logout',
    type: 'post'
  }
]

export function login(data: any) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token: any) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
