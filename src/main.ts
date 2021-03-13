import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css'

import ElementPlus from 'element-plus'
import '@/styles/element-variables.scss'

import '@/styles/index.scss'

import SvgIcon from '@/icons'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus)
app.use(SvgIcon)
app.mount('#app')
