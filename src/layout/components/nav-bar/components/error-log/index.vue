<template>
  <div v-if="errorLogs.length > 0">
    <el-badge :is-dot="true" style="line-height: 25px;margin-top: -5px;" @click="() => ((dialogTableVisible = true), (type = 'warning'))">
      <el-button style="padding: 8px 10px;" size="small" :type="type">
        <svg-icon icon-class="bug" />
      </el-button>
    </el-badge>

    <el-dialog v-model="dialogTableVisible" width="80%" append-to-body>
      <template #title>
        <span style="padding-right: 10px;">Error Log</span>
        <el-button size="mini" type="primary" icon="el-icon-delete" @click="clearAll">Clear All</el-button>
      </template>
      <el-table :data="errorLogs" border max-height="70vh" height="70vh">
        <el-table-column label="Message">
          <template #default="{ row }">
            <div>
              <span class="message-title">Msg:</span>
              <el-tag type="danger">
                {{ row.error.message }}
              </el-tag>
            </div>
            <br />
            <div>
              <span class="message-title" style="padding-right: 10px;">Info: </span>
              <el-tag type="warning"> {{ row.instance?.$vnode?.tag }} error in {{ row.info }} </el-tag>
            </div>
            <br />
            <div>
              <span class="message-title" style="padding-right: 16px;">Url: </span>
              <el-tag type="success">
                {{ row.url }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Stack">
          <template #default="{row}">
            {{ row.error.stack }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ErrorLog',
  setup() {
    const store = useStore()

    const type = ref<string>('warning')

    const dialogTableVisible = ref<boolean>(false)

    const errorLogs = computed(() => {
      return store.getters.errorLogs
    })

    watch(errorLogs.value, () => {
      type.value = 'danger'
    })

    const clearAll = () => {
      dialogTableVisible.value = false
      store.dispatch('errorLog/clearErrorLog')
    }

    return {
      dialogTableVisible,
      errorLogs,
      clearAll,
      type
    }
  }
})
</script>

<style scoped>
.message-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  padding-right: 8px;
}
</style>
