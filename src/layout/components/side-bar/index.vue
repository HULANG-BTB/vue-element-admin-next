<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <menu-list :collapse="isCollapse" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Logo from './logo.vue'
import MenuList from './menu-list.vue'
import variables from '@/styles/variables.scss'

export default defineComponent({
  name: 'SideBar',
  components: { MenuList, Logo },
  setup() {
    const store = useStore()

    const route = useRoute()

    // 是否显示侧边栏 Logo
    const showLogo = computed(() => {
      return store.state.settings.sidebarLogo
    })

    // 菜单收起状态
    const isCollapse = computed(() => {
      return !store.getters.sidebar.opened
    })

    // 当前激活的菜单
    const activeMenu = computed(() => {
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })

    const permissionRoutes = computed(() => {
      return store.getters.permissionRoutes
    })

    return {
      showLogo,
      isCollapse,
      activeMenu,
      variables,
      permissionRoutes
    }
  }
})
</script>
