import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const service: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 60 * 1000
})

service.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    // 请求发送前执行的操作

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }
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
    return data
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
