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
  name: 'PieChart',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '150px'
    },
    height: {
      type: String,
      default: '184px'
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
    OEEStyle() {
      var OStyle = {}
      if (this.chartData.OEE < 77) {
        OStyle = { color: '#FFFF37' }
      } else {
        OStyle = { color: '#46A3FF' }
      }
      return OStyle
    },
    setOptions(chartData) {
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          show: false
          // orient: 'vertical',
          // x: 'left',
          // data: ['有效工时', '无效工时']
        },
        color: ['red', 'green', 'yellow', 'blueviolet'],
        calculable: true,
        series: [
          {
            name: 'OEE',
            type: 'pie',
            clockWise: true, // 顺时针
            radius: ['30%', '50%'], // 饼图的半径，数组的第一项是内半径，第二项是外半径，支持设置成百分比，相对于容器高宽中较小的一项的一半；
            // radius: '55%', // 也可以这样设置是一个实心圆
            center: ['25%', '40%'], // 饼图的中心(圆心)坐标，数组的第一项是横坐标，第二项是纵坐标，支持设置百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'center',
                  formatter: function(param) {
                    var status
                    if (param.name === 'Other') {
                      status = ''
                    } else {
                      status = param.name + '\n' + param.value + '%'
                    }
                    return status
                  },
                  textStyle: {
                    color: '#1790CF',
                    fontSize: '12',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                }
              },
              emphasis: {
                color: 'red',
                label: {
                  show: false,
                  position: 'center',
                  formatter: '{d}%',
                  textStyle: {
                    color: 'red',
                    fontSize: '12',
                    fontFamily: '微软雅黑',
                    fontWeight: 'bold'
                  }
                }
              }
            },
            data: [
              {
                name: 'Other',
                value: 100 - chartData.OEE,
                itemStyle: { color: '#F38A7C' }
              },
              {
                name: chartData.Line,
                value: chartData.OEE,
                itemStyle: this.OEEStyle()
              }
            ]
          }
        ]
      }

      // option.series[0].data[0].value = parseFloat(chartData.OEE).toFixed(2)
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
