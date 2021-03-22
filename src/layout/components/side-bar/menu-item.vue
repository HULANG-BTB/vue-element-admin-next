<template>
  <template v-if="hasOneShowingChild(item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !(item.meta && item.meta.alwaysShow)">
    <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
      <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
        <template v-if="onlyOneChild.meta.icon">
          <template v-if="isSvgIcon(onlyOneChild.meta.icon)">
            <svg-icon :icon-class="onlyOneChild.meta.icon" />
          </template>
          <template v-else>
            <i :class="[onlyOneChild.meta.icon || (item.meta && item.meta.icon), 'sub-el-icon']" />
          </template>
        </template>
        <template v-if="onlyOneChild.meta.title" #title>
          <span>{{ onlyOneChild.meta.title }}</span>
        </template>
      </el-menu-item>
    </app-link>
  </template>

  <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
    <template v-if="item.meta" #title>
      <template v-if="item.meta.icon">
        <template v-if="isSvgIcon(item.meta.icon)">
          <svg-icon :icon-class="item.meta.icon"></svg-icon>
        </template>
        <template v-else>
          <i :class="[item.meta.icon, 'sub-el-icon']" />
        </template>
      </template>
      <template v-if="item.meta.title">
        <span>{{ item.meta.title }}</span>
      </template>
    </template>
    <menu-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(child.path)" />
  </el-submenu>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { RouteRecordRaw } from 'vue-router'

import { isExternal } from '@/utils/validate'
import path from 'path'

import AppLink from './app-link.vue'

export default defineComponent({
  name: 'MenuItem',
  components: { AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const onlyOneChild: any = ref<any>({})

    // 是否只有一个显示的菜单
    const hasOneShowingChild = (menu: RouteRecordRaw) => {
      // 如果没有children字段 则没有可以显示的子菜单 显示当前菜单
      if (!menu.children) {
        onlyOneChild.value = { ...menu, path: '', noShowingChildren: true }
        return true
      }

      // 显示的子菜单列表
      const showingChildren = menu.children.filter((item: RouteRecordRaw) => {
        if (item.meta?.hidden) {
          return false
        } else {
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      // 如果只有一个子路由，这个路由默认被展示
      if (showingChildren.length === 1) {
        // Temp set(will be used if only has one showing child)
        // 临时设置（在只有一个子菜单的时候被使用）
        onlyOneChild.value = showingChildren[0]
        return true
      }

      // Show parent if there are no child router to display
      // 如果没有子路由，那么展示父路由
      if (showingChildren.length === 0) {
        onlyOneChild.value = { ...menu, path: '', noShowingChildren: true }
        return true
      }

      return false
    }

    const resolvePath = (routePath: string) => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      return path.resolve(props.basePath, routePath)
    }

    const isSvgIcon = (icon: string): boolean => {
      if (icon.includes('el-icon')) {
        return false
      } else {
        return true
      }
    }

    return {
      hasOneShowingChild,
      resolvePath,
      onlyOneChild,
      isSvgIcon
    }
  }
})
</script>

<style lang="scss">
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
