<template>
  <div class="tab-container">
    <el-tag>mounted times ：{{ createdTimes }}</el-tag>
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" />
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName == item.key" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import TabPane from './components/tab-pane.vue'

const tabMapOptions = [
  { label: 'China', key: 'CN' },
  { label: 'USA', key: 'US' },
  { label: 'Japan', key: 'JP' },
  { label: 'Eurozone', key: 'EU' }
]

export default defineComponent({
  name: 'TabPage',
  components: { TabPane },
  setup() {
    const router = useRouter()

    const route = useRoute()

    const createdTimes = ref<number>(0)

    const activeName = ref<string>('CN')

    const showCreatedTimes = () => {
      createdTimes.value++
    }

    watch(
      () => activeName.value,
      (val) => {
        router.push(`${route.path}?tab=${val}`)
      }
    )

    return {
      createdTimes,
      showCreatedTimes,
      tabMapOptions,
      activeName
    }
  }
})
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
