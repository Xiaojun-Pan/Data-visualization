<template>
  <el-container
    class="el-container"
    direction="vertical"
  >
    <!--产线选择框-->
    <el-dialog
      title="请选择区域"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form">
        <el-form-item
          label="选择区域"
          :label-width="formLabelWidth"
        >
          <!-- 增加value-key属性，以让el-option设置为一个对象是显示正常,不然就一直显示最后一个选项 -->
          <el-select
            v-model="form.region"
            value-key="location_id"
            placeholder="请选择生产区域"
            @change="onSelectChange"
          >
            <el-option
              v-for="(item,index) in areaList"
              :key="index"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onSelect"
        >确 定</el-button>
      </div>
    </el-dialog>

    <el-header>
      <!--回主页-->
      <div
        class="collapse-btn"
        @click="backHome"
      >
        <el-tooltip
          effect="dark"
          content="回主页"
          placement="bottom"
        >
          <i class="el-icon-menu" />
        </el-tooltip>
      </div>

      <!-- 全屏显示 -->
      <div
        class="collapse-btn"
        @click="handleFullScreen"
      >
        <el-tooltip
          effect="dark"
          :content="fullscreen ? `取消全屏` : `全屏`"
          placement="bottom"
        >
          <i class="el-icon-rank" />
        </el-tooltip>
      </div>

      <!-- 产线信息 -->
      <div class="header-title">区域:{{ areaName }}</div>

      <!--Header右部-->
      <div class="header-right">
        <p>当前时间：{{ clock }}</p>
        <p>数据时间：{{ dataTime }}</p>
      </div>
    </el-header>

    <el-main
      v-show="boardVisible"
      :style="mainStyle"
    >
      <!-- 播放告警 -->
      <audio
        id="audio"
        preload="auto"
        loop
      >
        <source
          src="../../../assets/sound/alarm.wav"
          type="audio/wav"
        >
      </audio>

      <el-row :gutter="4">
        <!-- 右侧 -->
        <el-col
          :xs="24"
          :sm="24"
          :lg="24"
        >
          <div
            ref="status"
            class="chart-wrapper"
            :style="chartStyle"
          >
            <map-chart
              :chart-data="statusData"
              :img-name="areaImage"
              :width="chartStyle.width"
              :height="chartStyle.height"
            />
          </div>
        </el-col>
      </el-row>

    </el-main>
  </el-container>
</template>

<script>
import wsn from '@/api/wsn' // 引入wsn接口
import MapChart from './components/MapChart'
import { adjustPosition } from '@/utils/graphic'
import { getClock } from '@/utils'

export default {
  name: 'Temperature',
  components: {
    MapChart // 地图
  },
  data() {
    return {
      visible: false,
      fullscreen: false,
      dialogFormVisible: true, // 选择窗显示开关
      boardVisible: true, // 看板显示开关,默认显示，否则会造成echarts图表初始化时因隐藏组件而无法获得具体大小而过小,或者手动指定大小
      areaList: [], // 区域列表
      areaName: '', // 区域名称
      areaID: '',
      areaImage: '',
      tempLowLimit: '',
      tempHighLimit: '',
      humiLowLimit: '',
      humiHighLimit: '',
      name: localStorage.getItem('ms_username'),
      clock: '', // 页面右上角当前时间时钟
      dataTime: '', // 右上角数据时间
      statusData: { categoryData: [{ name: '', value: [] }] }, // 机台的坐标、状态
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      mainStyle: {
        height: '768px'
      },
      chartStyle: {
        width: '1250px',
        height: '860px',
        float: 'left',
        position: 'relative',
        // backgroundSize: 'cover!important', // 这个参数很重要，不生效背景图不会自动缩放
        backgroundSize: '100% 100%!important',
        backgroundImage: ''
      }
    }
  },
  computed: {
    role() {
      return this.name === 'admin' ? '超级管理员' : '普通用户'
    }
  },
  watch: {},
  mounted() {
    const _this = this // 声明一个变量指向Vue实例this，保证作用域一致
    _this.getArea()

    _this.timer = setInterval(() => {
      _this.clock = getClock() // 修改数据clock
    }, 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前清除定时器
    }
  },
  created() {
    // 自定义事件通知Home.vue隐藏Head,并将当前页面设置为全屏
    this.$store.dispatch('app/hideSideBar', { withoutAnimation: false })
    this.$store.dispatch('app/hideNavBar', { withoutAnimation: false })
    this.$store.dispatch('app/hideTagsView', { withoutAnimation: false })
    this.handleFullScreen // 全屏显示
    this.handleListener() // 自适应屏幕大小调整图表大小
  },
  activated() {
    this.handleListener()
  },
  deactivated() {
    // 非活动状态时关闭resize和collapse事件
    window.removeEventListener('resize', this.renderChart)
  },
  methods: {
    getUrlParam: function(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg) // 匹配目标参数
      if (r != null) return unescape(r[2])
      return null // 返回参数值
    },
    // 从接口获取区域列表
    getArea: function() {
      const _this = this
      wsn
        .fetchArea()
        .then(res => {
          _this.areaList = res.data
        })
        .catch(res => {
          console.log('请求失败：' + res.status + ',' + res.statusText)
        })
    },
    // 从接口获取背景图
    getAreaImage: function() {
      const _this = this
      wsn
        .fetchAreaImage(_this.areaID)
        .then(res => {
          _this.areaImage = res.data
        })
        .catch(res => {
          console.log('请求失败：' + res.status + ',' + res.statusText)
        })
    },
    // 从接口获取指定线的状态数据
    getData: function() {
      const _this = this // 声明一个变量指向Vue实例this，保证作用域一致,否则在下面的无法将res.data.Throughput赋值给throughputData
      if (_this.lineName === '') {
        this.$message.error('当前没有选择要显示的区域，请重新选择.')
        return
      }

      // 获取节点坐标及状态
      wsn
        .fetchAreaNodeStatus(_this.areaID)
        .then(function(res) {
          const locValue = res.data
          _this.statusData = { geo: {}, categoryData: [] } // 数组清空

          var newPosition = {}

          // 当前放机台状态元素的宽、高
          const w = parseInt(
            window.getComputedStyle(_this.$refs.status).width.replace('px', '')
          )
          const h = parseInt(
            window.getComputedStyle(_this.$refs.status).height.replace('px', '')
          )
          // 原始图片的宽高，主要是需要宽高比，等比缩放计算坐标
          const ow = 1250
          const oh = 860

          // 是有状态3，播放警告音
          var statWarn = false

          for (var j = 0; j < locValue.length; j++) {
            // 已经背景布局图的原始大小1280*1024，计算缩放后的点坐标
            newPosition = adjustPosition(
              locValue[j].x,
              locValue[j].y,
              ow,
              oh,
              w,
              h
            )
            _this.statusData.categoryData.push({
              name: locValue[j].name,
              value: [
                // 原始坐标
                // 换算后坐标
                newPosition.x,
                newPosition.y,
                // locValue[j].x,
                // locValue[j].y,
                locValue[j].type, // 节点类型
                locValue[j].temprature, // 温度
                locValue[j].humidity, // 湿度
                locValue[j].dust, // 落尘
                locValue[j].status // 状态 0=离线,1=正常,2=需要换电池,3=温度、湿度、落尘有一个异常
              ]
            })
            if (locValue[j].status === '3') {
              statWarn = true
            }
          }

          // 告警
          if (statWarn) {
            _this.play()
          }
        })
        .catch(res => {
          console.log('请求失败：' + res.status + ',' + res.statusText)
        })
    },
    // 产线选择变化
    onSelectChange: function(key, val) {
      this.areaID = key.location_id
      this.areaName = key.name
      this.tempLowLimit = key.temp_low_limit
      this.tempHighLimit = key.temp_high_limit
      this.humiLowLimit = key.humi_low_limit
      this.humiHighLimit = key.humi_high_limit
    },
    // 选择产线确认
    onSelect: function() {
      if (this.lineName === '') {
        this.$message.error('请选择要显示的产线')
        return
      } else {
        this.dialogFormVisible = false
        this.boardVisible = true
        this.getAreaImage()
        this.loadCharts()
      }
    },
    // 定时刷新数据更新图表
    loadCharts: function() {
      const _this = this // 声明一个变量指向Vue实例this，保证作用域一致,否则在下面的setInterval()无法更新dataTime
      // 调用接口获取線体状态
      _this.getData()
      this.dataTime = getClock()
      _this.resizeChart()

      // 定时1分钟刷新
      setInterval(function() {
        _this.getData()
        _this.resizeChart()
        _this.dataTime = getClock()
      }, 60000)
    },
    handleListener() {
      // 调用renderChart方法对图表进行重新渲染
      window.addEventListener('resize', this.renderChart)
    },
    handleBus(msg) {
      setTimeout(() => {
        this.renderChart()
      }, 300)
    },
    renderChart() {},
    // 按钮跳转回首页
    backHome() {
      // 返回主页前先将NavBar和SideBar显示出来
      this.$store.dispatch('app/showSideBar', { withoutAnimation: false })
      this.$store.dispatch('app/showNavBar', { withoutAnimation: false })
      this.$store.dispatch('app/showTagsView', { withoutAnimation: false })
      this.$router.push({ path: '/homepage' })
    },
    // 全屏事件
    handleFullScreen() {
      const element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }

      this.fullscreen = !this.fullscreen
    },
    // 播放和停止警示音
    play() {
      this.lastRunTime = Date.now()
      const audio = document.querySelector('#audio')
      if (!this.isPlaying) {
        audio.play()
        this.isPlaying = true
      }
      const timeOut = setTimeout(() => {
        this.stop(timeOut)
      }, 10000)
    },
    stop(timeOut) {
      this.currentTime = Date.now()
      const audio = document.querySelector('#audio')
      if (this.currentTime - this.lastRunTime > 10000) {
        if (this.isPlaying) {
          audio.currentTime = 0
          audio.pause()
          this.isPlaying = false
        }
      }
      clearTimeout(timeOut)
    },
    resizeChart() {
      // 依据屏幕解析度和产线调整背景图和宽高
      this.mainStyle.height = window.screen.height - 60 + 'px'
      this.chartStyle.height = window.screen.height - 100 + 'px'
      this.chartStyle.width =
        Math.round((window.screen.height - 100) / 0.688) + 'px'
      // this.chartStyle.width = '1300px'

      this.chartStyle.backgroundImage =
        'url(' + this.areaImage + ')  !important'
      // this.chartStyle.backgroundImage =
      //   'url(http://192.168.123.30/epis/svg/SMT.svg)  !important'
    }
  }
}
</script>

<style scoped>
.header-right {
  float: right;
  /* margin-top: auto; */
  line-height: 10px;
  text-align: top;
  color: White;
  font-size: 16px;
  font-family: 'BebasNeueRegular', Arial, Helvetica, sans-serif;
  text-shadow: 0 0 2px #00c6ff;
}
.header-title {
  float: left;
  padding: 0 20px;
  cursor: pointer;
  color: White;
  font-size: 20px;
  font-family: 'BebasNeueRegular', Arial, Helvetica, sans-serif;
  text-shadow: 0 0 5px #00c6ff;
}
.collapse-btn {
  float: left;
  padding: 0 5px;
  cursor: pointer;
  color: White;
  font-size: 30px;
  font-family: 'BebasNeueRegular', Arial, Helvetica, sans-serif;
  text-shadow: 0 0 5px #00c6ff;
}
.chart-wrapper {
  background: #404040;
  color: white;
  font-size: 12px;
  font-family: 'BebasNeueRegular', Arial, Helvetica, sans-serif;
}
.pie-chart {
  float: left;
  padding: 0 5px;
  cursor: pointer;
}
.grid-section {
  background: #404040;
}
.grid-target {
  background: #404040;
}
.grid-throughput {
  background: #404040;
}
.el-row {
  /* margin-bottom: 20px; */
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  /* margin-bottom: 20px; */
}
.el-container {
  background: #303030;
  color: White;
}
.el-header {
  color: White;
}
.el-footer {
  color: White;
  text-align: center;
  line-height: 60px;
  font-size: 16px;
  font-family: 'BebasNeueRegular', Arial, Helvetica, sans-serif;
  text-shadow: 0 0 5px #00c6ff;
  /* position: fixed; */
  width: 100%;
  z-index: 100;
}
.el-main {
  background-color: #303030;
  color: White;
  font-size: 16px;
  font-family: 'BebasNeueRegular', Arial, Helvetica, sans-serif;
}
</style>
