import { Plugin, App } from 'vue'

import clipboard from './clipboard'

const vClipboard: Plugin = {
  install: (app: App) => {
    app.directive('clipboard', clipboard)
  }
}

export default vClipboard
export { clipboard }
