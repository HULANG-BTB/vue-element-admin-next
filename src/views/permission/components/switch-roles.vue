<template>
  <div>
    <div style="margin-bottom:15px;">Your roles: {{ roles }}</div>
    Switch roles:
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="editor" />
      <el-radio-button label="admin" />
      <el-radio-button label="admin,editor" />
    </el-radio-group>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, SetupContext } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'SwitchRoles',
  setup(props, context: SetupContext) {
    const store = useStore()

    const roles = computed(() => {
      return store.getters.roles
    })

    const switchRoles = computed({
      get: () => {
        return roles.value.join(',')
      },
      set: (val) => {
        store.dispatch('user/changeRoles', val).then(() => {
          context.emit('change')
        })
      }
    })

    return {
      roles,
      switchRoles
    }
  }
})
</script>

<style lang=""></style>
