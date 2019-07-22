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
  name: 'CrossChart',
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
    setOptions({ categoryList, categoryData, lineData } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          top: '10%', // 与四周的距离
          left: '2%',
          right: '2%',
          bottom: '10%',
          containLabel: true,
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 1,
          borderColor: '#ccc'
        },
        legend: {
          data: ['产出', '目标'],
          textStyle: {
            color: 'white' // 图例文字颜色
          }
        },

        xAxis: [
          {
            type: 'category',
            data: categoryList,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              // 坐标轴文本标签，详见axis.axisLabel
              show: true,
              interval: 'auto',
              rotate: 0,
              margin: 8,
              // formatter: null,
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: '#fff'
              }
            },
            axisLine: {
              // 坐标轴线
              show: true, // 默认显示，属性show控制显示与否
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: '#48b',
                width: 2,
                type: 'solid'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '产出',
            min: 0,
            max: (Math.ceil(Math.max(...lineData) / 50) + 1) * 50, // 每小时目标值里面找到最大值除以刻度50向上取整加一再乘以50作为Y轴刻度
            interval: 50,
            axisLabel: {
              formatter: '{value}',
              show: true,
              interval: 'auto',
              rotate: 0,
              margin: 8,
              // formatter: null,
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: '#fff'
              }
            },
            axisLine: {
              // 坐标轴线
              show: true, // 默认显示，属性show控制显示与否
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: '#48b',
                width: 2,
                type: 'solid'
              }
            }
          },
          {
            type: 'value',
            name: '目标',
            min: 0,
            max: (Math.ceil(Math.max(...lineData) / 50) + 1) * 50, // 每小时目标值里面找到最大值除以刻度50向上取整加一再乘以50作为Y轴刻度
            interval: 50,
            show: false,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '产出',
            type: 'bar',
            barWidth: '50%',
            label: {
              show: true
              // position: 默认自适应，水平布局为'top'，垂直布局为'right'，可选为
              //           'inside'|'left'|'right'|'top'|'bottom'
              // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
            },
            data: categoryData
          },
          {
            name: '目标',
            // smooth: true,
            type: 'line',
            yAxisIndex: 1,
            symbolSize: 5, // 拐点图形大小
            lineStyle: {
              color: '#FF0000',
              width: 2,
              type: 'solid',
              shadowColor: 'rgba(0,0,0,0)', // 默认透明
              shadowBlur: 5,
              shadowOffsetX: 3,
              shadowOffsetY: 3
            },
            label: {
              show: true,
              color: '#f4f400'
              // position: 默认自适应，水平布局为'top'，垂直布局为'right'，可选为
              //           'inside'|'left'|'right'|'top'|'bottom'
              // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
            },
            itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            data: lineData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
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
