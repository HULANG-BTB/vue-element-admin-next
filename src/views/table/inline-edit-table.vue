<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
        <template #default="{ row }">
          <span>{{ parseTime(row.timestamp, 'YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Author">
        <template #default="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="Importance">
        <template #default="{ row }">
          <svg-icon v-for="n in +row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110">
        <template #default="{ row }">
          <el-tag :type="statusMap[row.status]">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Title">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
            <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(row)">
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template #default="{ row }">
          <el-button v-if="row.edit" type="success" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">
            Ok
          </el-button>
          <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="row.edit = !row.edit">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue'

import dayjs from 'dayjs'

import { ElMessage } from 'element-plus'

import { fetchList } from '@/api/article'

const statusMap = {
  published: 'success',
  draft: 'info',
  deleted: 'danger'
}

export default defineComponent({
  name: 'InlineEditTable',
  setup() {
    const loading = ref<boolean>(false)

    const parseTime = (time: any, format: string) => {
      return dayjs(time).format(format)
    }

    const list = ref<any[]>([])

    const getList = async () => {
      loading.value = true
      const { data } = await fetchList({
        page: 1,
        limit: 10
      })
      const items = data.items
      list.value = items.map((v: any) => {
        v.edit = false
        v.originalTitle = v.title
        return v
      })
      loading.value = false
    }

    onBeforeMount(getList)

    const cancelEdit = (row: any) => {
      row.title = row.originalTitle
      row.edit = false
      ElMessage({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    }

    const confirmEdit = (row: any) => {
      row.edit = false
      row.originalTitle = row.title
      ElMessage({
        message: 'The title has been edited',
        type: 'success'
      })
    }

    return {
      statusMap,
      parseTime,
      list,
      cancelEdit,
      confirmEdit
    }
  }
})
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
