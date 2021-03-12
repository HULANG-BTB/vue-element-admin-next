import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import { IRootState } from '@/store'
import { ActionContext, ActionTree, Commit, MutationTree, Module } from 'vuex'

interface ISettingState {
  theme: string
  showSettings: boolean
  tagsView: boolean
  fixedHeader: boolean
  sidebarLogo: boolean
}

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state: ISettingState = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}

const mutations: MutationTree<ISettingState> = {
  CHANGE_SETTING: (state: ISettingState, payload: any) => {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      ;(state as any)[key] = value
    }
  }
}

const actions: ActionTree<ISettingState, IRootState> = {
  changeSetting(context: ActionContext<ISettingState, IRootState>, data) {
    const commit: Commit = context.commit
    commit('CHANGE_SETTING', data)
  }
}

const module: Module<ISettingState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default module
