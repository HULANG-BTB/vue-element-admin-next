import { Plugin, App } from 'vue'

import permission from './permission'

const vPermission: Plugin = {
  install: (app: App) => {
    app.directive('permission', permission)
  }
}

export default vPermission
export { permission }
