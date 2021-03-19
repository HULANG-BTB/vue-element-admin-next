<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column v-loading="loading" align="center" label="ID" width="65" element-loading-text="请给我点时间！">
      <template #default="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="Date">
      <template #default="scope">
        <span>{{ parseTime(scope.row.timestamp, 'YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="300px" label="Title">
      <template #default="{ row }">
        <span>{{ row.title }}</span>
        <el-tag>{{ row.type }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="Author">
      <template #default="scope">
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="Importance">
      <template #default="scope">
        <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" />
      </template>
    </el-table-column>

    <el-table-column align="center" label="Readings" width="95">
      <template #default="scope">
        <span>{{ scope.row.pageviews }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="Status" width="110">
      <template #default="{ row }">
        <el-tag :type="statusMap[row.status]">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, SetupContext } from 'vue'
import dayjs from 'dayjs'
import { fetchList } from '@/api/article'

const statusMap = {
  published: 'success',
  draft: 'info',
  deleted: 'danger'
}

export default defineComponent({
  name: 'TabPane',
  props: {
    type: {
      type: String,
      default: 'CN'
    }
  },
  setup(props, context: SetupContext) {
    const parseTime = (time: any, format: string | undefined) => {
      return dayjs(time).format(format)
    }

    const loading = ref<boolean>(false)

    const list = ref<Array<any>>([])

    const listQuery = {
      page: 1,
      limit: 5,
      type: props.type,
      sort: '+id'
    }

    const getList = () => {
      loading.value = true
      context.emit('create') // for test
      fetchList(listQuery).then((response: any) => {
        list.value = response.data.items
        loading.value = false
      })
    }

    onBeforeMount(() => {
      getList()
    })

    return {
      statusMap,
      parseTime,
      getList,
      loading,
      list
    }
  }
})
</script>

<style lang="scss"></style>
