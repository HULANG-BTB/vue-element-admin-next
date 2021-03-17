import request from '@/utils/request'

export default [
  {
    name: '搜索用户',
    method: 'searchUser',
    url: '/vue-element-admin/search/user',
    type: 'get'
  },
  {
    name: '交易列表',
    method: 'transactionList',
    url: '/vue-element-admin/transaction/list',
    type: 'get'
  }
]

export function searchUser(name: any) {
  return request({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query: any = {}) {
  return request({
    url: '/vue-element-admin/transaction/list',
    method: 'get',
    params: query
  })
}
