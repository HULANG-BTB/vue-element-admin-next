import { Plugin, nextTick, ComponentPublicInstance } from 'vue'

import store from '@/store'

import settings from '@/settings'

function checkNeed() {
  const needErrorLog: string | Array<string> = settings.errorLog
  const env = process.env.NODE_ENV
  if (needErrorLog instanceof String) {
    return env === needErrorLog
  }
  if (needErrorLog instanceof Array) {
    return needErrorLog.includes(env || '')
  }
  return false
}

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
    if (checkNeed()) {
      app.config.errorHandler = errorHandler
    }
  }
}

export default plugin
