import store from '@/store'

/**
 *
 * @param {Array<String> | String} value
 * @returns {Boolean}
 */
export function hasPermission(value: string[] | string, all = false) {
  const roles: string[] = store.getters && store.getters.roles

  if (!value) {
    throw new Error(`need roles! Like v-permission="['admin','editor']" or v-permission="'admin'" or v-permission="'admin|editor'"`)
  }
  if (value instanceof Array) {
    // 数组参数
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = permissionRoles[all ? 'every' : 'some']((role: string) => {
        return roles.includes(role)
      })

      if (!hasPermission) {
        return false
      }
    } else {
      console.error(`need roles! Like v-permission="['admin','editor']"`)
      return false
    }
  } else {
    const hasPermission = roles.some((role: string) => {
      return value === role
    })
    if (!hasPermission) {
      return false
    }
  }
  return true
}
