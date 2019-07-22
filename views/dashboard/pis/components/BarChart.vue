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

const animationDuration = 6000

export default {
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
      type: Object,
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
    setOptions({ categoryList, categoryData } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '{b}<br/>{a0}:{c0}'
        },
        grid: {
          top: 15,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            position: 'top',
            splitLine: {
              show: false
            },
            axisLabel: {
              show: true
            },
            data: categoryData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: categoryList,
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              // rotate: 20, // 旋转20度
              formatter: function(params) {
                return params.substring(0, 5)
              },
              textStyle: {
                color: '#1790CF',
                fontSize: 12
              }
            }
          }
        ],
        series: [
          {
            name: '产出',
            type: 'bar',
            stack: '总量',
            barWidth: '60%',
            itemStyle: {
              normal: {
                color: '#1790CF',
                label: {
                  show: true,
                  position: 'inner',
                  textStyle: {
                    fontSize: 12, // 字体大小
                    color: '#f4f4f5'
                  },
                  formatter: function(params) {
                    return (
                      params.name.substring(14, params.name.length) +
                      '\n产出:' +
                      params.data
                    )
                  }
                }
              }
            },
            data: categoryData,
            animationDuration
          }
        ]
      })
    },

    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
