import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css'

import ElementPlus from 'element-plus'
import '@/styles/element-variables.scss'

import '@/styles/index.scss'

import SvgIcon from '@/icons'

// v-permission
import permission from '@/directive/permission'
import ErrorLogPlugin from '@/plugins/error-log'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus, { size: 'mini' })
app.use(SvgIcon)
app.use(permission)
app.use(ErrorLogPlugin)
app.mount('#app')

export default app
