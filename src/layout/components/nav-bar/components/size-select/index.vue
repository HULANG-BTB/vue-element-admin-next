<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetSize">
      <div>
        <svg-icon class-name="size-icon" icon-class="size" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size === item.value" :command="item.value">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { ElMessage } from 'element-plus'

const sizeOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Medium', value: 'medium' },
  { label: 'Small', value: 'small' },
  { label: 'Mini', value: 'mini' }
]

export default defineComponent({
  name: 'SizeSelect',
  setup() {
    const store = useStore()

    const route = useRoute()

    const router = useRouter()

    const size = computed(() => {
      return store.getters.size
    })

    const refreshView = () => {
      store.dispatch('tagsView/delAllCachedViews', route)
      const { fullPath } = route
      nextTick(() => {
        router.replace({
          path: '/redirect' + fullPath
        })
      })
    }

    const handleSetSize = (size: string) => {
      // this.$ELEMENT.size = size
      store.dispatch('app/setSize', size)
      refreshView()
      ElMessage({
        message: 'Switch Size Success',
        type: 'success'
      })
    }

    return {
      sizeOptions,
      size,
      handleSetSize
    }
  }
})
</script>

<style lang="scss"></style>
