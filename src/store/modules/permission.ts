import { ActionContext, ActionTree, Commit, MutationTree, Module } from 'vuex'
import { IRootState } from '../index'
import { asyncRoutes, routes as constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles: any[], route: any) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes: any[], roles: any[]) {
  const res: any[] = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

export interface IPermissionState {
  routes: any[]
  addRoutes: any[]
}

const state: IPermissionState = {
  routes: [],
  addRoutes: []
}

const mutations: MutationTree<IPermissionState> = {
  SET_ROUTES: (state: IPermissionState, routes: any[]) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions: ActionTree<IPermissionState, IRootState> = {
  generateRoutes(context: ActionContext<IPermissionState, IRootState>, roles) {
    const commit: Commit = context.commit
    return new Promise((resolve) => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

const module: Module<IPermissionState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default module
