<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="use clipboard  directly" name="directly">
        <el-input v-model="inputData" placeholder="Please input" style="width:400px;max-width:100%;" />
        <el-button type="primary" icon="el-icon-document" @click="handleCopy(inputData, $event)">
          copy
        </el-button>
      </el-tab-pane>
      <el-tab-pane label="use clipboard by v-directive" name="v-directive">
        <el-input v-model="inputData" placeholder="Please input" style="width:400px;max-width:100%;" />
        <el-button v-clipboard:copy="inputData" v-clipboard:success="clipboardSuccess" type="primary" icon="el-icon-document">
          copy
        </el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import clip from '@/utils/clipboard'
import { ElMessage } from 'element-plus'
import { clipboard } from '@/directive/clipboard'

export default defineComponent({
  name: 'Clipboard',
  directives: { clipboard },
  setup() {
    const activeName = ref<string>('directly')

    const handleCopy = (text: string, event: any) => {
      clip(text, event)
    }
    const clipboardSuccess = () => {
      ElMessage({
        message: 'Copy successfully',
        type: 'success',
        duration: 1500
      })
    }

    return {
      activeName,
      inputData: 'https://github.com/HULANG-BTB/vue-element-admin-next.git',
      handleCopy,
      clipboardSuccess
    }
  }
})
</script>

<style lang="scss"></style>
