<template>
  <div ref="root" :style="{ height: height, width: width }" v-bind="$attrs" />
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'

import * as echarts from 'echarts'

import 'echarts/theme/macarons'

import useResize from '../../mixins/resize'

export default defineComponent({
  name: 'PieChart',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  setup() {
    const root = ref<any>(null)
    let chart: any = null

    const { onCancel, onResize } = useResize()

    onMounted(() => {
      onResize(() => {
        if (chart) {
          chart.resize?.()
        }
      })
    })

    onBeforeUnmount(onCancel)

    const initChart = () => {
      chart = echarts.init(root.value, 'macarons')
      chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: 'Industries' },
              { value: 240, name: 'Technology' },
              { value: 149, name: 'Forex' },
              { value: 100, name: 'Gold' },
              { value: 59, name: 'Forecasts' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }

    onMounted(() => {
      initChart()
    })

    onBeforeUnmount(() => {
      if (!chart) {
        return
      }
      chart.dispose()
      chart = null
    })

    return {
      root
    }
  }
})
</script>

<style lang="scss"></style>
