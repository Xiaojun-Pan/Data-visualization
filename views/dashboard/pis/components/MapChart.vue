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
// import world from 'echarts/map/json/world'
// echarts.registerMap('world', world)
      // var img = new Image() //新建对象
      //  img.src='http://192.168.123.30/epis/svg/SMT.svg'
      // img.src='../1.jpg'
      //图片的地址

      // 裁剪图片大小同chart相同
      // var canvas = document.createElement('canvas');
      // var ctx = canvas.getContext('2d');
      // canvas.width = this.chart.getWidth() * window.devicePixelRatio
      // canvas.height = this.chart.getHeight() * window.devicePixelRatio
      // canvas.width = 1280  * window.devicePixelRatio;
      // canvas.height = 1024 * window.devicePixelRatio

      // var fullImage = new Image();
      // img.setAttribute("crossOrigin",'Anonymous')
      // img.onload = function() {
      //  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      //  fullImage.src = canvas.toDataURL();
      // }




export default {
  name: 'MapChart',
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
    },
    imgName:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null,
      img : null
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
    // this.img = new Image ()
    // this.img.src='http://192.168.123.30/epis/svg/' + this.imgName
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
    // this.img.dispose()
    this.chart = null
    // this.img =null 
  },

  methods: {
    setOptions(chartData) {
      this.chart.setOption({
        // backgroundColor: '#404040',
         backgroundColor:'', //设置无背景色
        // backgroundColor: { //设置背景为图片,此种方式太耗费CPU和GPU，不建议用
        // // type: 'pattern',
        // repeat: 'no-repeat', // 是否平铺, 可以是 'repeat-x', 'repeat-y', 'no-repeat'
        // image: this.img // // 支持为 HTMLImageElement, HTMLCanvasElement，不支持路径字符串
        // },
        title: {
          show: false,
          text: '',
          x: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(param) {
            var status = ''
            switch (param.value[2]) {
              case '0':
                status = '空闲状态'
                break
              case '1':
                status = '运行状态'
                break
              case '2':
                status = '待机状态'
                break
              case '3':
                status = '告警状态'
                break
              default:
                status = '空闲状态'
            }
            return param.name + ':' + status
          },
          extraCssText: 'height:40px;'
        },
        legend: {
          show: false,
          orient: 'vertical',
          y: 'bottom',
          x: 'right',
          data: ['Status'],
          textStyle: {
            color: '#fff'
          }
        },
        // visualMap: {
        //   min: 0,
        //   max: 200,
        //   calculable: true,
        //   inRange: {
        //     color: ['#50a3ba', '#eac736', '#d94e5d']
        //   },
        //   textStyle: {
        //     color: '#fff'
        //   }
        // },
        geo: {
          show:true,  //是否显示
          map: 'world',
          roam: 'scale',   //是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          // center:[115.97, 29.71],                     //当前视角的中心点，用经纬度表示
          // aspectScale:1,                           //这个参数用于 scale 地图的长宽比,默认是0.75
          // boundingCoords: [[-180, 90], [180, -90]],  //二维数组，定义定位的左上角以及右下角分别所对应的经纬度
          // zoom:1,                                  //当前视角的缩放比例(经纬度下)
          label: {
            emphasis: {
              show: true,
              color: '#fff'
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#323c48',
              borderColor: '#111'
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          },
          zlevel:0,                                   //所属图形的 zlevel 值。
          z:2,                                        //所属图形的 z 值。
          left:"10%",                                 //组件离容器左侧的距离,百分比字符串或整型数字
          top:60,                                     //组件离容器上侧的距离，百分比字符串或整型数字
          right:"auto",                               //组件离容器右侧的距离,百分比字符串或整型数字
          bottom:"auto",                              //组件离容器下侧的距离,百分比字符串或整型数字
          layoutCenter:['30%', '30%'],                //地图中心在屏幕中的位置
          layoutSize:100,                             //地图的大小,支持相对于屏幕宽高的百分比或者绝对的像素大小。
          opacity: 0.1 // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
        },
        
        series: [
          //状态0，1使用散点图呈现
          {
            name: 'Status01',
            type: 'scatter',
            coordinateSystem: 'geo',  //参照系：之前设置的geo。
            data: chartData.categoryData.filter(function(param){
              return param.value[2] < '2'
            }),  //这里是api数据接受的的地方,使用筛选器只显示状态0和1
            symbol: 'circle', // 图形 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
            symbolSize: 30, // 标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
            silent: false, // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
            legendHoverLink: true, // 是否启用图例 hover 时的联动高亮。
            hoverAnimation: true, // 是否开启鼠标 hover 的提示动画效果。
            effectType: 'ripple', // 特效类型，目前只支持涟漪特效'ripple'。
            showEffectOn: 'render', // 配置何时显示特效。可选：'render' 绘制完成后显示特效。'emphasis' 高亮（hover）的时候显示特效。
            rippleEffect: {
              // 涟漪特效相关配置。
              period: 4, // 动画的时间。
              scale: 5, // 动画中波纹的最大缩放比例。
              brushType: 'fill' // 波纹的绘制方式，可选 'stroke' 和 'fill'。
            },
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: function(param) {
                  var icolor = '#C0C0C0'
                  switch (param.value[2]) {
                    case '0':
                      icolor = '#C0C0C0'
                      break
                    case '1':
                      icolor = '#00CC00'
                      break
                    case '2':
                      icolor = '#CCCC00'
                      break
                    case '3':
                      icolor = '#CC0000'
                      break
                    default:
                      icolor = '#C0C0C0'
                  }
                  return icolor
                }
                // opacity: 0.5 // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
              },
              emphasis: {
                borderColor: '#fff',
                borderWidth: 1
              }
            }
          },

          //状态2，3使用特效三点呈现
          {
            name: 'Status23',
            type: 'effectScatter',
            coordinateSystem: 'geo',  //参照系：之前设置的geo。
            data: chartData.categoryData.filter(function(param){
              return param.value[2] > '1'
            }),  //这里是api数据接受的的地方,使用筛选器只显示状态0和1
            symbol: 'emptyCircle', // 图形 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
            // symbolSize: 12, // 标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
            symbolSize: function (val) {
                var symbolSize=10
                // return (parseInt(val[2])+1) * 4
                if(val[2]==='3'){
                   symbolSize=16
                }
                else{
                    symbolSize=10
                }
                return symbolSize
            },
            silent: false, // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
            legendHoverLink: true, // 是否启用图例 hover 时的联动高亮。
            hoverAnimation: true, // 是否开启鼠标 hover 的提示动画效果。
            effectType: 'ripple', // 特效类型，目前只支持涟漪特效'ripple'。
            showEffectOn: 'render', // 配置何时显示特效。可选：'render' 绘制完成后显示特效。'emphasis' 高亮（hover）的时候显示特效。
            large: false, // 是否开启大规模散点图的优化，在数据图形特别多的时候（>=5k）可以开启。开启后配合 largeThreshold 在数据量大于指定阈值的时候对绘制进行优化。缺点：优化后不能自定义设置单个数据项的样式。
            largeThreshold: 2000, // 开启绘制优化的阈值。
            rippleEffect: {
              // 涟漪特效相关配置。
              period: 4, // 动画的时间。
              scale: 5, // 动画中波纹的最大缩放比例。
              brushType: 'fill' // 波纹的绘制方式，可选 'stroke' 和 'fill'。
            },
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: function(param) {
                  var icolor = '#C0C0C0'
                  switch (param.value[2]) {
                    case '0':
                      icolor = '#C0C0C0'
                      break
                    case '1':
                      icolor = '#00CC00'
                      break
                    case '2':
                      icolor = '#CCCC00'
                      break
                    case '3':
                      icolor = '#CC0000'
                      break
                    default:
                      icolor = '#C0C0C0'
                  }
                  return icolor
                }
                // opacity: 0.5 // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
              },
              emphasis: {
                borderColor: '#fff',
                borderWidth: 1
              }
            }
          }
        ],
        //状态2，3使用特效散点图呈现
        //   series: [
        //   {
        //     name: 'Status23',
        //     type: 'effectScatter',
        //     coordinateSystem: 'geo',  //参照系：之前设置的geo。
        //     data: chartData.categoryData.filter(function(param){
        //       return param.value[2] > '1'
        //     }),  //这里是api数据接受的的地方,使用筛选器只显示状态0和1
        //     symbol: 'emptyCircle', // 图形 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
        //     // symbolSize: 12, // 标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
        //     symbolSize: function (val) {
        //         var symbolSize=10
        //         // return (parseInt(val[2])+1) * 4
        //         if(val[2]==='3'){
        //            symbolSize=16
        //         }
        //         else{
        //             symbolSize=10
        //         }
        //         return symbolSize
        //     },
        //     silent: false, // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
        //     legendHoverLink: true, // 是否启用图例 hover 时的联动高亮。
        //     hoverAnimation: true, // 是否开启鼠标 hover 的提示动画效果。
        //     effectType: 'ripple', // 特效类型，目前只支持涟漪特效'ripple'。
        //     showEffectOn: 'render', // 配置何时显示特效。可选：'render' 绘制完成后显示特效。'emphasis' 高亮（hover）的时候显示特效。
        //     large: false, // 是否开启大规模散点图的优化，在数据图形特别多的时候（>=5k）可以开启。开启后配合 largeThreshold 在数据量大于指定阈值的时候对绘制进行优化。缺点：优化后不能自定义设置单个数据项的样式。
        //     largeThreshold: 2000, // 开启绘制优化的阈值。
        //     rippleEffect: {
        //       // 涟漪特效相关配置。
        //       period: 4, // 动画的时间。
        //       scale: 5, // 动画中波纹的最大缩放比例。
        //       brushType: 'fill' // 波纹的绘制方式，可选 'stroke' 和 'fill'。
        //     },
        //     label: {
        //       normal: {
        //         show: false
        //       },
        //       emphasis: {
        //         show: false
        //       }
        //     },
        //     itemStyle: {
        //       normal: {
        //         color: function(param) {
        //           var icolor = '#C0C0C0'
        //           switch (param.value[2]) {
        //             case '0':
        //               icolor = '#C0C0C0'
        //               break
        //             case '1':
        //               icolor = '#00CC00'
        //               break
        //             case '2':
        //               icolor = '#CCCC00'
        //               break
        //             case '3':
        //               icolor = '#CC0000'
        //               break
        //             default:
        //               icolor = '#C0C0C0'
        //           }
        //           return icolor
        //         }
        //         // opacity: 0.5 // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
        //       },
        //       emphasis: {
        //         borderColor: '#fff',
        //         borderWidth: 1
        //       }
        //     }
        //   }
        // ]
      })
    },

    initChart() {
      // console.log(this.chartData.categoryData)
      // this.img.src='http://192.168.123.30/epis/svg/' + this.imgName
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
