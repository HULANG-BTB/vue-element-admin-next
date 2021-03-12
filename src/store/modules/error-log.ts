import { Module, MutationTree, ActionTree, ActionContext, Commit } from 'vuex'
import { IRootState } from '@/store'

interface IErrorLogState {
  logs: any[]
}

const state: IErrorLogState = {
  logs: []
}

const mutations: MutationTree<IErrorLogState> = {
  ADD_ERROR_LOG: (state: IErrorLogState, log: any) => {
    state.logs.push(log)
  },
  CLEAR_ERROR_LOG: (state: IErrorLogState) => {
    state.logs.splice(0)
  }
}

const actions: ActionTree<IErrorLogState, IRootState> = {
  addErrorLog(context: ActionContext<IErrorLogState, IRootState>, log: any) {
    const commit: Commit = context.commit
    commit('ADD_ERROR_LOG', log)
  },
  clearErrorLog(context: ActionContext<IErrorLogState, IRootState>) {
    const commit: Commit = context.commit
    commit('CLEAR_ERROR_LOG')
  }
}

const module: Module<IErrorLogState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default module
