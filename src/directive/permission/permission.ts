import { ObjectDirective, DirectiveBinding } from 'vue'

import { hasPermission } from '@/utils/permission'

const permission: ObjectDirective = {
  mounted(el: any, binding: DirectiveBinding) {
    if (!hasPermission(binding.value, binding.arg === 'all')) {
      el.parentNode?.removeChild(el)
    }
  },
  updated(el: any, binding: DirectiveBinding) {
    if (!hasPermission(binding.value, binding.arg === 'all')) {
      el.parentNode?.removeChild(el)
    }
  }
}

export default permission
