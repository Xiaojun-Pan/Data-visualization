<template>
  <div
    :class="className"
    :style="{height:height,width:width}"
  />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  name: 'GaugeChart',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    chartData: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {},
  watch: {
    // 重要：检测从父组件传来的Props变化更新子组件
    chartData(newValue, oldValue) {
      this.$nextTick(() => {
        if (this.chartData) {
          this.initChart()
        }
      })
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setOptions(chartData) {
      const option = {
        series: [
          {
            name: '业务指标',
            type: 'gauge',
            splitNumber: 10, // 分割段数，默认为5
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[0.2, '#228b22'], [0.8, '#48b'], [1, '#ff4500']],
                width: 2
              }
            },
            axisTick: {
              // 坐标轴小标记
              splitNumber: 10, // 每份split细分多少段
              length: 12, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'auto'
              }
            },
            axisLabel: {
              // 坐标轴文本标签，详见axis.axisLabel1
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
              }
            },
            splitLine: {
              // 分隔线
              show: true, // 默认显示，属性show控制显示与否
              length: 30, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
              }
            },
            pointer: {
              width: 5
            },
            title: {
              show: true,
              offsetCenter: [0, 20], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder', // 标题位置
                color: 'white'
              }
            },
            detail: {
              formatter: '{value}%',
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto',
                fontWeight: 'bolder'
              }
            },
            data: [
              {
                value: 50,
                name: ''
              }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      }

      option.series[0].data[0].value = (parseFloat(chartData) * 100).toFixed(2)
      option.series.animationDuration
      this.chart.setOption(option, true)
    },

    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
