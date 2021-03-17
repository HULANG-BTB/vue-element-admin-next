<template>
  <div ref="root" :style="{ height: height, width: width }" v-bind="$attrs" />
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'

import * as echarts from 'echarts'

import 'echarts/theme/macarons'

import useResize from '../../mixins/resize'

export default defineComponent({
  name: 'BarChart',
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
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: 'pageA',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [79, 52, 200, 334, 390, 330, 220],
            animationDuration: 4
          },
          {
            name: 'pageB',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [80, 52, 200, 334, 390, 330, 220],
            animationDuration: 4
          },
          {
            name: 'pageC',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [30, 52, 200, 334, 390, 330, 220],
            animationDuration: 4
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
