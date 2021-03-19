<template>
  <div class="app-container">
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table ref="dragTable" v-loading="loading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
        <template #default="{ row }">
          <span>{{ parseTime(row.timestamp, 'YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Title">
        <template #default="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="Author">
        <template #default="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="Importance">
        <template #default="{ row }">
          <svg-icon v-for="n in +row.importance" :key="n" icon-class="star" class="icon-star" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="Readings" width="95">
        <template #default="{ row }">
          <span>{{ row.pageviews }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110">
        <template #default="{ row }">
          <el-tag :type="statusMap[row.status]">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Drag" width="80">
        <template #default="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column>
    </el-table>
    <div class="show-d"><el-tag>The default order :</el-tag> {{ oldList }}</div>
    <div class="show-d"><el-tag>The after dragging order :</el-tag> {{ newList }}</div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { defineComponent, nextTick, onBeforeMount, ref } from 'vue'
import { fetchList } from '@/api/article'
import Sortable from 'sortablejs'

const statusMap = {
  published: 'success',
  draft: 'info',
  deleted: 'danger'
}

export default defineComponent({
  name: 'DragTable',
  setup() {
    const parseTime = (time: any, format: string) => {
      return dayjs(time).format(format)
    }

    const oldList = ref<any[]>([])

    const newList = ref<any[]>([])

    const list = ref<any[]>([])

    const loading = ref<boolean>(false)

    const total = ref<number>(0)

    const dragTable = ref<any>(null)

    const setSort = () => {
      const el = dragTable.value.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer: any) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: (evt: any) => {
          const targetRow = list.value.splice(evt.oldIndex, 1)[0]
          list.value.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = newList.value.splice(evt.oldIndex, 1)[0]
          newList.value.splice(evt.newIndex, 0, tempIndex)
        }
      })
    }

    const getList = async () => {
      loading.value = true
      const { data } = await fetchList({
        page: 1,
        limit: 10
      })
      list.value = data.items
      total.value = data.total
      loading.value = false
      oldList.value = list.value.map((v) => v.id)
      newList.value = oldList.value.slice()
      nextTick(() => {
        setSort()
      })
    }

    onBeforeMount(getList)

    return {
      statusMap,
      parseTime,
      oldList,
      newList,
      loading,
      list
    }
  }
})
</script>

<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>

<style scoped>
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
</style>
