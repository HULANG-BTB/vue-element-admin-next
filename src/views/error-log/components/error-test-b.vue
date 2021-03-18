<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorTestB',
  setup() {
    const c = ((this as any).b = (this as any).b)
    return c
  }
})
</script>

<style lang=""></style>
