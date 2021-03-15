import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 60 * 1000
})

service.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    // 请求发送前执行的操作

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  (error): any => {
    // 请求错误执行操作
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse): any => {
    // 请求响应后 数据返回前 执行的操作
    const data = response.data
    if (data.code !== 20000) {
      ElMessage({
        message: data.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (data.code === 50008 || data.code === 50012 || data.code === 50014) {
        // to re-login
        ElMessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(data.message || 'Error'))
    } else {
      return data
    }
  },
  (error): any => {
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
