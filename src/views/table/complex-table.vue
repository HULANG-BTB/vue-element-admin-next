<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name + '(' + item.key + ')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey = tableKey + 1">
        reviewer
      </el-checkbox>
    </div>

    <el-table :key="tableKey" v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" width="150px" align="center">
        <template #default="{ row }">
          <span>{{ parseTime(row.timestamp, 'YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title" min-width="150px">
        <template #default="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ typeMap[row.type] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110px" align="center">
        <template #default="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template #default="{ row }">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Imp" width="80px">
        <template #default="{ row }">
          <svg-icon v-for="n in +row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="Readings" align="center" width="95">
        <template #default="{ row }">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template #default="{ row }">
          <el-tag :type="statusMap[row.status]">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template #default="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status != 'published'" size="mini" type="success" @click="handleModifyStatus(row, 'published')">
            Publish
          </el-button>
          <el-button v-if="row.status != 'draft'" size="mini" @click="handleModifyStatus(row, 'draft')">
            Draft
          </el-button>
          <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-show="total > 0" :total="total" :current-page="listQuery.page" :page-size="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            Cancel
          </el-button>
          <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { defineComponent, nextTick, onBeforeMount, reactive, ref } from 'vue'

import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { ElMessage, ElNotification } from 'element-plus'

const rules = {
  type: [{ required: true, message: 'type is required', trigger: 'change' }],
  timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
  title: [{ required: true, message: 'title is required', trigger: 'blur' }]
}

const statusMap = {
  published: 'success',
  draft: 'info',
  deleted: 'danger'
}

const calendarTypeOptions = [
  { key: 'CN', displayName: 'China' },
  { key: 'US', displayName: 'USA' },
  { key: 'JP', displayName: 'Japan' },
  { key: 'EU', displayName: 'Eurozone' }
]

const sortOptions = [
  { label: 'ID Ascending', key: '+id' },
  { label: 'ID Descending', key: '-id' }
]

const statusOptions = ['published', 'draft', 'deleted']

// arr to obj, such as { CN : "China", US : "USA" }
const typeMap = calendarTypeOptions.reduce((acc: any, cur: any) => {
  acc[cur.key] = cur.displayName
  return acc
}, {})

const textMap = {
  update: 'Edit',
  create: 'Create'
}

const importanceOptions = [1, 2, 3]

export default defineComponent({
  name: 'ComplexTable',
  setup() {
    const parseTime = (time: any, format: string) => {
      return dayjs(time).format(format)
    }

    const dataForm = ref<any>(null)

    const dialogStatus = ref<string>('create')

    const dialogFormVisible = ref<boolean>(false)

    const dialogPvVisible = ref<boolean>(false)
    const pvData = ref<any>(null)

    const temp = ref<any>({
      id: undefined,
      importance: 1,
      remark: '',
      timestamp: new Date(),
      title: '',
      type: '',
      status: 'published'
    })

    const loading = ref<boolean>(false)
    const downloadLoading = ref<boolean>(false)

    const showReviewer = ref<boolean>(false)

    const list = ref<any[]>([])
    const total = ref<number>(0)

    const tableKey = ref<number>(0)

    const listQuery = reactive<any>({
      page: 1,
      limit: 20,
      importance: null,
      title: null,
      type: null,
      sort: '+id'
    })

    const getList = () => {
      loading.value = true
      fetchList(listQuery).then((response: any) => {
        list.value = response.data.items
        total.value = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          loading.value = false
        }, 1.5 * 1000)
      })
    }

    const handleFilter = () => {
      listQuery.page = 1
      getList()
    }

    const handleModifyStatus = (row: any, status: any) => {
      ElMessage({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    }

    const sortByID = (order: any) => {
      if (order === 'ascending') {
        listQuery.sort = '+id'
      } else {
        listQuery.sort = '-id'
      }
      handleFilter()
    }

    const sortChange = (data: any) => {
      const { prop, order } = data
      if (prop === 'id') {
        sortByID(order)
      }
    }

    const resetTemp = () => {
      temp.value = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    }

    const handleCreate = () => {
      resetTemp()
      dialogStatus.value = 'create'
      dialogFormVisible.value = true
      nextTick(() => {
        dataForm.value.clearValidate()
      })
    }

    const createData = () => {
      dataForm.value?.validate((valid: boolean) => {
        if (valid) {
          temp.value.id = Math.floor(Math.random() * 100) + 1024 // mock a id
          temp.value.author = 'vue-element-admin'
          createArticle(temp.value).then(() => {
            list.value.unshift(temp.value)
            dialogFormVisible.value = false
            ElNotification({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }

    const handleUpdate = (row: any) => {
      temp.value = Object.assign({}, row) // copy obj
      temp.value.timestamp = new Date(temp.value.timestamp)
      dialogStatus.value = 'update'
      dialogFormVisible.value = true
      nextTick(() => {
        dataForm.value?.clearValidate()
      })
    }

    const updateData = () => {
      dataForm.value?.validate((valid: boolean) => {
        if (valid) {
          const tempData = Object.assign({}, temp.value)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = list.value.findIndex((v) => v.id === temp.value.id)
            list.value.splice(index, 1, temp.value)
            dialogFormVisible.value = false
            ElNotification({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }

    const handleDelete = (row: any, index: number) => {
      ElNotification({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      list.value.splice(index, 1)
    }

    const handleFetchPv = (pv: any) => {
      fetchPv(pv).then((response) => {
        pvData.value = response.data.pvData
        dialogPvVisible.value = true
      })
    }

    const handleDownload = () => {
      //
    }

    const formatJson = (filterVal: any) => {
      return list.value.map((v) =>
        filterVal.map((j: any) => {
          if (j === 'timestamp') {
            return parseTime(filterVal, v[j])
          } else {
            return v[j]
          }
        })
      )
    }

    const getSortClass = (key: any) => {
      const sort = listQuery.value?.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }

    onBeforeMount(getList)

    return {
      statusMap,
      typeMap,
      parseTime,
      listQuery,
      handleFilter,
      loading,
      list,
      getList,
      total,
      sortOptions,
      statusOptions,
      handleModifyStatus,
      sortChange,
      temp,
      resetTemp,
      dialogStatus,
      dialogFormVisible,
      handleCreate,
      createData,
      handleUpdate,
      updateData,
      handleDelete,
      handleFetchPv,
      tableKey,
      downloadLoading,
      handleDownload,
      showReviewer,
      textMap,
      dialogPvVisible,
      importanceOptions,
      calendarTypeOptions,
      getSortClass,
      formatJson,
      rules,
      dataForm
    }
  }
})
</script>
