<template>
  <div ref="root" :style="{ height: height, width: width }" v-bind="$attrs" />
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import * as echarts from 'echarts'

import 'echarts/theme/macarons'

export interface ILineChartData {
  expectedData: number[]
  actualData: number[]
}

import useResize from '../../mixins/resize'

export default defineComponent({
  name: 'LineChart',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const root = ref<any>(null)
    let chart: any = null

    const { onResize, onCancel } = useResize()

    onMounted(onCancel)

    onResize(() => {
      if (chart) {
        chart.resize?.()
      }
    })

    const setOptions = (data: any = {}) => {
      const { expectedData, actualData } = data
      chart.setOption({
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['expected', 'actual']
        },
        series: [
          {
            name: 'expected',
            lineStyle: {
              color: '#FF005A',
              width: 2
            },
            itemStyle: {
              color: '#FF005A'
            },
            smooth: true,
            type: 'line',
            data: expectedData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: 'actual',
            smooth: true,
            type: 'line',
            lineStyle: {
              color: '#3888fa',
              width: 2
            },
            areaStyle: {
              color: '#f3f8ff'
            },
            itemStyle: {
              color: '#3888fa'
            },
            data: actualData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      })
    }

    const initChart = () => {
      chart = echarts.init(root.value, 'macarons')
      setOptions(props.chartData)
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

    watch(
      (): ILineChartData => {
        return props.chartData as ILineChartData
      },
      (newVal: ILineChartData) => {
        if (chart) setOptions(newVal)
        else initChart()
      }
    )

    return {
      root
    }
  }
})
</script>

<style lang="scss"></style>
