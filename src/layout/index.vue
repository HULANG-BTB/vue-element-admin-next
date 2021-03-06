<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <side-bar class="sidebar-container" />
    <el-scrollbar class="scrollbar-wrapper">
      <div :class="{ hasTagsView: needTagsView }" class="main-container">
        <div :class="{ 'fixed-header': fixedHeader }">
          <nav-bar />
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
        <right-panel v-if="showSettings">
          <settings-view />
        </right-panel>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import SideBar from './components/side-bar/index.vue'
import NavBar from './components/nav-bar/index.vue'
import TagsView from './components/tags-view/index.vue'
import AppMain from './components/app-main/index.vue'
import SettingsView from './components/settings-view/index.vue'
import RightPanel from './components/right-panel/index.vue'
import { useStore } from 'vuex'

import useResize from '@/mixins/resize'

const WIDTH = 992

export default defineComponent({
  name: 'Layout',
  components: { SideBar, NavBar, TagsView, AppMain, SettingsView, RightPanel },
  setup() {
    const store = useStore()

    const device = computed(() => {
      return store.getters.device
    })

    const sidebar = computed(() => {
      return store.getters.sidebar
    })

    const needTagsView = computed(() => {
      return store.state.settings.tagsView
    })

    const fixedHeader = computed(() => {
      return store.state.settings.fixedHeader
    })

    const showSettings = computed(() => {
      return store.state.settings.showSettings
    })

    const classObj = computed(() => {
      return {
        hideSidebar: !sidebar.value.opened,
        openSidebar: sidebar.value.opened,
        withoutAnimation: sidebar.value.withoutAnimation,
        mobile: device.value === 'mobile'
      }
    })

    const { onResize } = useResize()

    onResize(() => {
      if (!document.hidden) {
        const rect: DOMRect = document.body.getBoundingClientRect()
        const isMobile = rect.width - 1 < WIDTH

        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
      }
    })

    onMounted(() => {
      const rect: DOMRect = document.body.getBoundingClientRect()
      const isMobile = rect.width - 1 < WIDTH

      if (isMobile) {
        store.dispatch('app/toggleDevice', 'mobile')
        store.dispatch('app/closeSideBar', { withoutAnimation: true })
      }
    })

    const handleClickOutside = () => {
      store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }

    return {
      device,
      sidebar,
      needTagsView,
      fixedHeader,
      showSettings,
      classObj,
      handleClickOutside
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
