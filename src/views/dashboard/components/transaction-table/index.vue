<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Order_No" min-width="200">
      <template #default="scope">
        {{ scope.row.order_no.substring(0, 30) }}
      </template>
    </el-table-column>
    <el-table-column label="Price" width="195" align="center">
      <template #default="scope"> ¥{{ toThousandFilter(scope.row.price) }} </template>
    </el-table-column>
    <el-table-column label="Status" width="100" align="center">
      <template #default="{ row }">
        <el-tag :type="statusMap[row.status]">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue'

import { transactionList } from '@/api/remote-search'

export default defineComponent({
  name: 'TransactionTable',
  setup() {
    const list = ref<any[]>([])

    const statusMap = {
      success: 'success',
      pending: 'danger'
    }

    const fetchData = () => {
      transactionList().then((response) => {
        list.value = response.data.items.slice(0, 8)
      })
    }

    const toThousandFilter = (num: number | string) => {
      return (+num || 0).toString().replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    }

    onBeforeMount(fetchData)

    return {
      list,
      statusMap,
      toThousandFilter
    }
  }
})
</script>

<style lang="scss"></style>
