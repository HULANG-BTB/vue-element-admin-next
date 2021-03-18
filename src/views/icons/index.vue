<template>
  <div class="icons-container">
    <aside>
      <aside href="https://panjiachen.github.io/vue-element-admin-site/guide/advanced/icon.html" target="_blank">Add and use</aside>
    </aside>
    <el-tabs type="border-card">
      <el-tab-pane label="Icons">
        <div class="grid">
          <div v-for="item of svgIcons" :key="item" @click="handleClipboard(generateIconCode(item), $event)">
            <el-tooltip placement="top">
              <template #content>
                {{ generateIconCode(item) }}
              </template>
              <div class="icon-item">
                <svg-icon :icon-class="item" class-name="disabled" />
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons">
        <div class="grid">
          <div v-for="item of elementIcons" :key="item" @click="handleClipboard(generateElementIconCode(item), $event)">
            <el-tooltip placement="top">
              <template #content>
                {{ generateElementIconCode(item) }}
              </template>
              <div class="icon-item">
                <i :class="'el-icon-' + item" />
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import clipboard from '@/utils/clipboard'
import svgIcons from './svg-icons'
import elementIcons from './element-icons'

export default defineComponent({
  name: 'Icons',
  setup() {
    const generateIconCode = (symbol: string) => {
      return `<svg-icon icon-class="${symbol}" />`
    }
    const generateElementIconCode = (symbol: string) => {
      return `<i class="el-icon-${symbol}" />`
    }
    const handleClipboard = (text: string, event: any) => {
      clipboard(text, event)
    }

    return {
      svgIcons,
      elementIcons,
      generateIconCode,
      generateElementIconCode,
      handleClipboard
    }
  }
})
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
