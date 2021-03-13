import { IRootState } from './index'
import { GetterTree } from 'vuex'

const getters: GetterTree<IRootState, IRootState> = {
  sidebar: (state: IRootState) => state.app.sidebar,
  size: (state: IRootState) => state.app.size,
  device: (state: IRootState) => state.app.device,
  visitedViews: (state: IRootState) => state.tagsView.visitedViews,
  cachedViews: (state: IRootState) => state.tagsView.cachedViews,
  token: (state: IRootState) => state.user.token,
  avatar: (state: IRootState) => state.user.avatar,
  name: (state: IRootState) => state.user.name,
  introduction: (state: IRootState) => state.user.introduction,
  roles: (state: IRootState) => state.user.roles,
  permissionRoutes: (state: IRootState) => state.permission.routes,
  errorLogs: (state: IRootState) => state.errorLog.logs
}

export default getters
