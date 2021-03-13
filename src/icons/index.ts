import SvgIcon from '@/components/svg-icon/index.vue'
import { App } from 'vue'

export default {
  install: (app: App) => {
    app.component(SvgIcon.name, SvgIcon)
    const svgFiles = require.context('./svg', false, /\.svg$/)
    const requireAll = (requireContext: any) => requireContext.keys().map(requireContext)
    requireAll(svgFiles)
  }
}
