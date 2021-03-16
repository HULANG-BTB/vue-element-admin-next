import { ObjectDirective, DirectiveBinding } from 'vue'

import store from '@/store'

function checkPermission(el: any, binding: DirectiveBinding) {
  const { value } = binding
  const roles: string[] = store.getters && store.getters.roles
  if (!value) {
    throw new Error(`need roles! Like v-permission="['admin','editor']" or v-permission="'admin'" or v-permission="'admin|editor'"`)
  }
  if (value instanceof Array) {
    // 数组参数
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.every((role: string) => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  } else if (value instanceof String) {
    const permissionRoles = value.split('|')

    if (permissionRoles.length > 0) {
      const hasPermission = roles.some((role: string) => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="'admin'" or v-permission="'admin|editor'"`)
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']" or v-permission="'admin'" or v-permission="'admin|editor'"`)
  }
}

const permission: ObjectDirective = {
  beforeMount(el: any, binding: DirectiveBinding) {
    checkPermission(el, binding)
  },
  updated(el: any, binding: DirectiveBinding) {
    checkPermission(el, binding)
  }
}

export default permission
