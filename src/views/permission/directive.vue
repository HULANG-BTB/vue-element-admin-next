<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />
    <div :key="key" style="margin-top:30px;">
      <div v-permission="['admin']">
        <span class="permission-alert"> <el-tag class="permission-tag" size="small">admin</el-tag> can see this </span>
        <el-tag class="permission-sourceCode" type="info">
          v-permission="['admin']"
        </el-tag>
      </div>

      <div v-permission="['editor']">
        <span class="permission-alert"> <el-tag class="permission-tag" size="small">editor</el-tag> can see this </span>
        <el-tag class="permission-sourceCode" type="info">
          v-permission="['editor']"
        </el-tag>
      </div>

      <div v-permission="['admin', 'editor']">
        <span class="permission-alert"> <el-tag class="permission-tag" size="small">admin</el-tag> and <el-tag class="permission-tag" size="small">editor</el-tag> can see this </span>
        <el-tag class="permission-sourceCode" type="info">
          v-permission="['admin','editor']"
        </el-tag>
      </div>

      <div v-permission:all="['admin', 'editor']">
        <span class="permission-alert"> Should <el-tag class="permission-tag" size="small">admin</el-tag> and <el-tag class="permission-tag" size="small">editor</el-tag> can see this </span>
        <el-tag class="permission-sourceCode" type="info">
          v-permission:all="['admin','editor']"
        </el-tag>
      </div>
    </div>

    <div :key="'hasPermission' + key" style="margin-top:60px;">
      <aside>
        In some cases, using v-permission will have no effect. For example: Element-UI's Tab component or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.
        <br />
        e.g.
      </aside>

      <el-tabs type="border-card" style="width:550px;">
        <el-tab-pane v-if="hasPermission(['admin'])" label="Admin">
          Admin can see this
          <el-tag class="permission-sourceCode" type="info">
            v-if="hasPermission(['admin'])"
          </el-tag>
        </el-tab-pane>

        <el-tab-pane v-if="hasPermission(['editor'])" label="Editor">
          Editor can see this
          <el-tag class="permission-sourceCode" type="info">
            v-if="hasPermission(['editor'])"
          </el-tag>
        </el-tab-pane>

        <el-tab-pane v-if="hasPermission(['admin', 'editor'])" label="Admin-OR-Editor">
          Both admin or editor can see this
          <el-tag class="permission-sourceCode" type="info">
            v-if="hasPermission(['admin','editor'])"
          </el-tag>
        </el-tab-pane>

        <el-tab-pane v-if="hasPermission(['admin', 'editor'], true)" label="Admin-And-Editor">
          Should admin and editor can see this
          <el-tag class="permission-sourceCode" type="info">
            v-if="hasPermission(['admin','editor'], true)"
          </el-tag>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import { hasPermission } from '@/utils/permission'
import SwitchRoles from './components/switch-roles.vue'

export default defineComponent({
  name: 'DirectivePermission',
  components: { SwitchRoles },
  setup() {
    const key = ref<number>(1)

    const handleRolesChange = () => {
      key.value++
    }

    return {
      key,
      handleRolesChange,
      hasPermission
    }
  }
})
</script>

<style lang="scss" scoped>
.app-container {
  /deep/ .permission-alert {
    width: 320px;
    margin-top: 15px;
    background-color: #f0f9eb;
    color: #67c23a;
    padding: 8px 16px;
    border-radius: 4px;
    display: inline-block;
  }
  /deep/ .permission-sourceCode {
    margin-left: 15px;
  }
  /deep/ .permission-tag {
    background-color: #ecf5ff;
  }
}
</style>
