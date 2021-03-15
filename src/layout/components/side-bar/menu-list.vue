<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      :collapse="collapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :unique-opened="false"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      mode="vertical"
    >
      <template v-for="route in permissionRoutes">
        <menu-item v-if="!(route.meta && route.meta.hidden)" :key="route.path" :item="route" :base-path="route.path" />
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import variables from '@/styles/variables.scss'
import MenuItem from './menu-item.vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'MenuList',
  components: { MenuItem },
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    // vuex
    const store = useStore()

    // 路由
    const route = useRoute()

    // 当前激活菜单
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
      activeMenu,
      variables,
      permissionRoutes
    }
  }
})
</script>

<style lang=""></style>
