<template>
  <div ref="tagsViewRef" id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        :ref="addTagRefs"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <ul v-show="menu.visible" :style="{ left: menu.left + 'px', top: menu.top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag">Refresh</li>
      <li v-if="!isAffix(menu.selectedTag)" @click="closeSelectedTag()">Close</li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags">Close All</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import ScrollPane from './scroll-pane.vue'

import path from 'path'

export default defineComponent({
  name: 'TagsView',
  components: { ScrollPane },
  setup() {
    const tagsViewRef = ref<any>(null)

    const scrollPaneRef = ref<any>(null)

    const store = useStore()

    const route = useRoute()

    const router = useRouter()

    const tagRefs = ref<any[]>([])

    const addTagRefs = (val: any) => {
      console.log('add tag', val)

      tagRefs.value.push(val)
    }

    const visitedViews = computed(() => {
      return store.state.tagsView.visitedViews
    })

    const menu = reactive<any>({
      visible: false,
      selectedTag: {},
      affixTags: null,
      left: 0,
      top: 0
    })

    // 打开右键菜单
    const openMenu = (tag: any, e: any) => {
      const menuMinWidth = 105
      const offsetLeft = tagsViewRef.value.getBoundingClientRect().left // container margin left
      const offsetWidth = tagsViewRef.value.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        menu.left = maxLeft
      } else {
        menu.left = left
      }

      menu.top = e.clientY
      menu.visible = true
      menu.selectedTag = tag
    }

    // 移动到当前菜单
    const moveToCurrentTag = () => {
      nextTick(() => {
        for (const tag of tagRefs.value) {
          if (tag.to.path === route.path) {
            scrollPaneRef.value.moveToTarget(tag, tagRefs.value)
            // when query is different then update
            if (tag.to.fullPath !== route.fullPath) {
              store.dispatch('tagsView/updateVisitedView', route)
            }
            break
          }
        }
      })
    }

    // 关闭右键菜单
    const closeMenu = () => {
      menu.visible = false
    }

    // 右键菜单 刷新
    const refreshSelectedTag = () => {
      store.dispatch('tagsView/delCachedView', menu.selectedTag).then(() => {
        const { fullPath } = menu.selectedTag
        nextTick(() => {
          router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    }

    // 关闭其他菜单
    const closeOthersTags = () => {
      router.push(menu.selectedTag)
      store.dispatch('tagsView/delOthersViews', menu.selectedTag).then(() => {
        moveToCurrentTag()
      })
    }

    const handleScroll = () => {
      // 滚动事件
      closeMenu()
    }

    // 是否固定
    const isAffix = (tag: RouteRecordRaw) => {
      return tag.meta?.affix
    }

    // 是否激活的
    const isActive = (currentRoute: RouteRecordRaw) => {
      return currentRoute.path === route.path
    }

    // 滑动到最后一个 tag
    const toLastView = (visitedViews: any[], view: any) => {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          router.replace({ path: '/redirect' + view.fullPath })
        } else {
          router.push('/')
        }
      }
    }

    // 关闭所有 tag
    const closeAllTags = () => {
      store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (menu.affixTags.some((tag: any) => tag.path === menu.selectedTag.path)) {
          return
        }
        toLastView(visitedViews, menu.selectedTag)
      })
    }

    // 关闭选择的 tag
    const closeSelectedTag = (view: any) => {
      const closeTarget = view || menu.selectedTag
      store.dispatch('tagsView/delView', closeTarget).then(({ visitedViews }) => {
        if (isActive(closeTarget)) {
          toLastView(visitedViews, closeTarget)
        }
      })
    }

    // 筛选固定tags
    const filterAffixTags = (routes: RouteRecordRaw[], basePath = '/') => {
      let tags: any = []
      routes.forEach((route: RouteRecordRaw) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    }

    // 初始化标签列表
    const initTags = () => {
      const affixTags = (menu.affixTags = filterAffixTags(router.getRoutes()))
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    }

    // 添加当前路由到标签
    const addTags = () => {
      const { name } = route
      if (name) {
        store.dispatch('tagsView/addView', route)
      }
      return false
    }

    onMounted(() => {
      initTags()
      addTags()
    })

    watch(route, () => {
      addTags()
      moveToCurrentTag()
    })

    watch(menu, (newVal) => {
      if (newVal.visible) {
        document.body.addEventListener('click', closeMenu)
      } else {
        document.body.removeEventListener('click', closeMenu)
      }
    })

    return {
      visitedViews,
      handleScroll,
      menu,
      openMenu,
      isAffix,
      refreshSelectedTag,
      closeSelectedTag,
      closeOthersTags,
      closeAllTags,
      isActive,
      addTagRefs,
      tagRefs,
      tagsViewRef,
      scrollPaneRef
    }
  }
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
