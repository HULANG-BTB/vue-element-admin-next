import Cookies from 'js-cookie'
import { Module, MutationTree, ActionTree, ActionContext, Commit } from 'vuex'
import { IRootState } from '@/store'

import app from '@/main'

interface IAppState {
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  device: string
  size: string
}

const state: IAppState = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+(Cookies.get('sidebarStatus') || 0) : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium'
}

const mutations: MutationTree<IAppState> = {
  TOGGLE_SIDEBAR: (state: IAppState) => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', '1')
    } else {
      Cookies.set('sidebarStatus', '0')
    }
  },
  CLOSE_SIDEBAR: (state: IAppState, withoutAnimation: boolean) => {
    Cookies.set('sidebarStatus', '0')
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state: IAppState, device: string) => {
    state.device = device
  },
  SET_SIZE: (state: IAppState, size: string) => {
    state.size = size
    app.config.globalProperties.$ELEMENT.size = size
    Cookies.set('size', size)
  }
}

const actions: ActionTree<IAppState, IRootState> = {
  toggleSideBar(context: ActionContext<IAppState, IRootState>) {
    const commit: Commit = context.commit
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar(context: ActionContext<IAppState, IRootState>, { withoutAnimation }) {
    const commit: Commit = context.commit
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice(context: ActionContext<IAppState, IRootState>, device: string) {
    const commit: Commit = context.commit
    commit('TOGGLE_DEVICE', device)
  },
  setSize(context: ActionContext<IAppState, IRootState>, size: string) {
    const commit: Commit = context.commit
    commit('SET_SIZE', size)
  }
}

const module: Module<IAppState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default module
