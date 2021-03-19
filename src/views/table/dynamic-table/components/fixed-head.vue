<template>
  <div class="app-container">
    <div class="filter-container">
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="apple">
          apple
        </el-checkbox>
        <el-checkbox label="banana">
          banana
        </el-checkbox>
        <el-checkbox label="orange">
          orange
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table :key="key" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="name" label="fruitName" width="180" />
      <el-table-column v-for="fruit in formThead" :key="fruit" :label="fruit">
        <template #default="scope">
          {{ scope.row[fruit] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

const defaultFormThead: string[] = ['apple', 'banana']

const tableData: any[] = [
  {
    name: 'fruit-1',
    apple: 'apple-10',
    banana: 'banana-10',
    orange: 'orange-10'
  },
  {
    name: 'fruit-2',
    apple: 'apple-20',
    banana: 'banana-20',
    orange: 'orange-20'
  }
]

const formTheadOptions: string[] = ['apple', 'banana', 'orange']

export default defineComponent({
  name: 'FixedHeadTable',
  setup() {
    const key = ref<number>(1)

    const checkboxVal = ref<any[]>(defaultFormThead)

    const formThead = ref<any[]>(defaultFormThead)

    watch(
      () => checkboxVal.value,
      (val) => {
        formThead.value = formTheadOptions.filter((i) => val.indexOf(i) >= 0)
      }
    )

    return {
      defaultFormThead,
      tableData,
      key,
      checkboxVal,
      formThead
    }
  }
})
</script>

<style lang="scss"></style>
