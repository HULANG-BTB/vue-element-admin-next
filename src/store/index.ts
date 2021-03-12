import { createStore, Store, ModuleTree } from 'vuex'
import getters from './getters'

const moduleFiles = require.context('./modules', false, /\.ts$/)

export type IRootState = Record<string, any>

const state: IRootState = {}

const modules: ModuleTree<IRootState> = moduleFiles.keys().reduce((modules: any, module: string): any => {
  const moduleName = module.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = moduleFiles(module)
  modules[moduleName] = value.default
  return modules
}, {})

const store: Store<IRootState> = createStore<IRootState>({
  state,
  getters,
  modules
})

export default store
