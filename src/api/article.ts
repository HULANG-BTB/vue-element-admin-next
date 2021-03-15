import request from '@/utils/request'

export default [
  {
    name: '文章列表',
    method: 'listArticle',
    url: '/vue-element-admin/article/list',
    type: 'get'
  },
  {
    name: '文章详情',
    method: 'detailArticle',
    url: '/vue-element-admin/article/detail',
    type: 'get'
  },
  {
    name: '文章阅读数',
    method: 'readArticleCount',
    url: '/vue-element-admin/article/pv',
    type: 'get'
  },
  {
    name: '插入文章',
    method: 'createArticle',
    url: '/vue-element-admin/article/create',
    type: 'post'
  },
  {
    name: '更新',
    method: 'updateArticle',
    url: '/vue-element-admin/article/update',
    type: 'post'
  }
]

export function fetchList(query: any) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id: any) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv: any) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data: any) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data: any) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
