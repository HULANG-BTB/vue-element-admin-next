import { Plugin, nextTick, ComponentPublicInstance } from 'vue'

import store from '@/store'

const errorHandler = (error: any, instance: ComponentPublicInstance | null, info: string) => {
  nextTick(() => {
    store.dispatch('errorLog/addErrorLog', {
      error: error || {},
      instance,
      info,
      url: window.location.href
    })
    console.error(error, info)
  })
}

const plugin: Plugin = {
  install: (app) => {
    app.config.errorHandler = errorHandler
  }
}

export default plugin
