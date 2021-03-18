<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import SwitchRoles from './components/switch-roles.vue'

export default defineComponent({
  name: 'PagePermission',
  components: { SwitchRoles },
  setup() {
    const router = useRouter()

    const handleRolesChange = () => {
      router.push({ path: '/permission/index?' + +new Date() })
    }

    return {
      handleRolesChange
    }
  }
})
</script>

<style lang="scss"></style>
