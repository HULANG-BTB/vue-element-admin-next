import request from '@/utils/request'

export default [
  {
    name: '获取上传token',
    method: 'getQiniuToken',
    url: '/qiniu/upload/token',
    type: 'get'
  }
]

export function getToken() {
  return request({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}
