import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import router, { resetRouter } from '@/router'
import router from '@/router'
import { IRootState } from '../index'
import { ActionTree, MutationTree, Module, ActionContext, Commit, Dispatch } from 'vuex'

interface IUSerState {
  token: string | undefined
  name: string
  avatar: string
  introduction: string
  roles: any[]
}

const state: IUSerState = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations: MutationTree<IUSerState> = {
  SET_TOKEN: (state: IUSerState, token: string) => {
    state.token = token
  },
  SET_INTRODUCTION: (state: IUSerState, introduction: string) => {
    state.introduction = introduction
  },
  SET_NAME: (state: IUSerState, name: string) => {
    state.name = name
  },
  SET_AVATAR: (state: IUSerState, avatar: string) => {
    state.avatar = avatar
  },
  SET_ROLES: (state: IUSerState, roles: any[]) => {
    state.roles = roles
  }
}

const actions: ActionTree<IUSerState, IRootState> = {
  // user login
  login(context: ActionContext<IUSerState, IRootState>, userInfo: any) {
    const commit: Commit = context.commit
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // login
      login({ username: username.trim(), password: password })
        .then((response) => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo(context: ActionContext<IUSerState, IRootState>) {
    const commit: Commit = context.commit
    const state: IUSerState = context.state
    return new Promise((resolve, reject) => {
      // getUserInfo
      getInfo(state.token)
        .then((response) => {
          const { data } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          const { roles, name, avatar, introduction } = data
          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }
          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', introduction)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout(context: ActionContext<IUSerState, IRootState>) {
    const commit: Commit = context.commit
    const dispatch: Dispatch = context.dispatch
    return new Promise((resolve, reject) => {
      // logout
      logout()
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          // resetRouter()
          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken(context: ActionContext<IUSerState, IRootState>) {
    const commit: Commit = context.commit
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles(context: ActionContext<IUSerState, IRootState>, role) {
    const commit: Commit = context.commit
    const dispatch: Dispatch = context.dispatch
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    // resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    // router.addRoutes(accessRoutes)
    router.addRoute(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

const module: Module<IUSerState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default module
