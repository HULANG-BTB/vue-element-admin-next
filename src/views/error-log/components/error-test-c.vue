<template>
  <el-button type="danger" @click="click">Click To Generate An Error</el-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorTestC',
  setup() {
    const click = () => {
      const c = ((this as any).c = (this as any).c)
      return c
    }
    return { click }
  }
})
</script>
