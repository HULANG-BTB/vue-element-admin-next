import { Module, MutationTree, ActionTree, ActionContext, Commit, Dispatch } from 'vuex'
import { RouteRecord, RouteRecordName } from 'vue-router'
import { IRootState } from '@/store'

export interface ITagView extends RouteRecord {
  title?: string
}
interface ITagViewState {
  visitedViews: ITagView[]
  cachedViews: RouteRecordName[]
}

const state: ITagViewState = {
  visitedViews: [],
  cachedViews: []
}

const mutations: MutationTree<ITagViewState> = {
  ADD_VISITED_VIEW: (state: ITagViewState, view: ITagView) => {
    if (state.visitedViews.some((v) => v.path === view.path)) return
    state.visitedViews.push({
      ...view,
      title: (view.meta.title as string) || 'no-name'
    })
  },
  ADD_CACHED_VIEW: (state: ITagViewState, view: ITagView) => {
    if (state.cachedViews.includes(view.name || 'no-name')) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name || 'no-name')
    }
  },

  DEL_VISITED_VIEW: (state: ITagViewState, view: ITagView) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: (state: ITagViewState, view: ITagView) => {
    const index = state.cachedViews.indexOf(view.name || 'no-name')
    index > -1 && state.cachedViews.splice(index, 1)
  },

  DEL_OTHERS_VISITED_VIEWS: (state: ITagViewState, view: ITagView) => {
    state.visitedViews = state.visitedViews.filter((v) => {
      return v.meta.affix || v.path === view.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS: (state: ITagViewState, view: ITagView) => {
    const index = state.cachedViews.indexOf(view.name || 'no-name')
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = []
    }
  },
  DEL_ALL_VISITED_VIEWS: (state: ITagViewState) => {
    // keep affix tags
    const affixTags = state.visitedViews.filter((tag) => tag.meta.affix)
    state.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: (state: ITagViewState) => {
    state.cachedViews = []
  },
  UPDATE_VISITED_VIEW: (state: ITagViewState, view: ITagView) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions: ActionTree<ITagViewState, IRootState> = {
  addView(context: ActionContext<ITagViewState, IRootState>, view: ITagView) {
    const dispatch: Dispatch = context.dispatch
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addVisitedView(context: ActionContext<ITagViewState, IRootState>, view: ITagView) {
    const commit: Commit = context.commit
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView(context: ActionContext<ITagViewState, IRootState>, view: ITagView) {
    const commit: Commit = context.commit
    commit('ADD_CACHED_VIEW', view)
  },

  delView(context: ActionContext<ITagViewState, IRootState>, view: ITagView) {
    const dispatch: Dispatch = context.dispatch
    const state: ITagViewState = context.state
    return new Promise((resolve) => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView(context: ActionContext<ITagViewState, IRootState>, view: ITagView) {
    const commit: Commit = context.commit
    const state: ITagViewState = context.state
    return new Promise((resolve) => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delCachedView(context: ActionContext<ITagViewState, IRootState>, view: ITagView) {
    const commit: Commit = context.commit
    const state: ITagViewState = context.state
    return new Promise((resolve) => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },
  delOthersViews(context: ActionContext<ITagViewState, IRootState>, view: ITagView) {
    const dispatch: Dispatch = context.dispatch
    const state: ITagViewState = context.state
    return new Promise((resolve) => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOthersVisitedViews(context: ActionContext<ITagViewState, IRootState>, view: ITagView) {
    const commit: Commit = context.commit
    const state: ITagViewState = context.state
    return new Promise((resolve) => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersCachedViews(context: ActionContext<ITagViewState, IRootState>, view: ITagView) {
    const commit: Commit = context.commit
    const state: ITagViewState = context.state
    return new Promise((resolve) => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },
  delAllViews(context: ActionContext<ITagViewState, IRootState>, view: ITagView) {
    const dispatch: Dispatch = context.dispatch
    const state: ITagViewState = context.state
    return new Promise((resolve) => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delAllVisitedViews(context: ActionContext<ITagViewState, IRootState>) {
    const commit: Commit = context.commit
    const state: ITagViewState = context.state
    return new Promise((resolve) => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  delAllCachedViews(context: ActionContext<ITagViewState, IRootState>) {
    const commit: Commit = context.commit
    const state: ITagViewState = context.state
    return new Promise((resolve) => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },
  updateVisitedView(context: ActionContext<ITagViewState, IRootState>, view: ITagView) {
    const commit: Commit = context.commit
    commit('UPDATE_VISITED_VIEW', view)
  }
}

const module: Module<ITagViewState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default module
