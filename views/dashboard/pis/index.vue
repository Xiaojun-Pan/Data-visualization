<template>
  <el-container style="background: #303030;">
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
            value-key="Area_ID"
            placeholder="请选择生产区域"
            @change="onSelectChange"
          >
            <el-option
              v-for="(item,index) in lineList"
              :key="index"
              :label="item.Area_Name"
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
      <div class="header-title">线别:{{ lineName }}</div>

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

      <!-- 机台运行比例 -->
      <el-row :gutter="4">
        <el-col
          :xs="24"
          :sm="24"
          :lg="6"
        >
          <el-card
            ref="summary"
            shadow="always"
            class="chart-wrapper"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <span>机台运行比例</span>
            </div>

            <div class="progress-item">
              <span style="color:#00CC00;">运行 </span>
              <elx-progress
                :stroke-width="20"
                :percentage="runPercentage"
                color="#00CC00"
                :ptext="runQuantity.toString()"
              />
            </div>

            <div class="progress-item">
              <span style="color:#FFFF37;">待机</span>
              <elx-progress
                :stroke-width="20"
                :percentage="waitPercentage"
                color="#FFFF37"
                :ptext="waitQuantity.toString()"
              />
            </div>
            <div class="progress-item">
              <span style="color:#FF0000;">故障</span>
              <elx-progress
                :stroke-width="20"
                :percentage="warnPercentage"
                color="#FF0000"
                :ptext="warnQuantity.toString()"
              />
            </div>
            <div class="progress-item">
              <span style="color:#C0C0C0;">空闲</span>
              <elx-progress
                :stroke-width="20"
                :percentage="idelPercentage"
                color="#C0C0C0"
                :ptext="idelQuantity.toString()"
              />
            </div>
          </el-card>

          <el-card
            ref="sthroughput"
            shadow="always"
            class="chart-wrapper"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <span>当前产出</span>
            </div>
            <div>
              <bar-chart
                :chart-data="throughputData"
                :height="throStyle.height"
              />
            </div>
          </el-card>
        </el-col>

        <!-- 右侧 -->
        <el-col
          :xs="24"
          :sm="24"
          :lg="18"
        >
          <!-- SMT OEE -->
          <el-card
            v-show="lineName==='SMT'"
            ref="oee"
            shadow="always"
            class="chart-wrapper"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <span>OEE</span>
            </div>
            <div
              v-for="(item,index) in smtOEE"
              :key="index"
            >
              <pie-chart
                :chart-data="item"
                class="pie-chart"
              />
            </div>

          </el-card>
          <el-card
            shadow="always"
            class="chart-wrapper"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <span>机台运行状态</span>
            </div>
            <div
              ref="status"
              :style="chartStyle"
            >
              <map-chart
                :chart-data="statusData"
                :img-name="lineImage"
                :width="chartStyle.width"
                :height="chartStyle.height"
              />
            </div>

          </el-card>
        </el-col>
      </el-row>

    </el-main>
  </el-container>
</template>

<script>
import pis from '@/api/pis' // 引入pis接口
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import MapChart from './components/MapChart'
import ElxProgress from './components/progress' // 自定义的elmentui 进度条
import { adjustPosition } from '@/utils/graphic'
import { getClock } from '@/utils'

export default {
  name: 'PISDashboard',
  components: {
    BarChart, // 柱状图
    PieChart, // 仪表盘
    MapChart, // 地图
    ElxProgress // 自定义的elmentui 进度条
  },
  data() {
    return {
      visible: false,
      fullscreen: false,
      dialogFormVisible: true, // 选择窗显示开关
      boardVisible: true, // 看板显示开关,默认显示，否则会造成echarts图表初始化时因隐藏组件而无法获得具体大小而过小,或者手动指定大小
      barHeight: '230px',
      lineList: [], // 产线列表
      lineName: '', // 线的名称
      lineID: '',
      linePara: '',
      lineImage: '',
      groupName: '', // 群组名称
      product: '', // 当前线产品
      shift: '', // 当前线班别
      name: localStorage.getItem('ms_username'),
      clock: '', // 页面右上角当前时间时钟
      dataTime: '', // 右上角数据时间
      throughputData: { categoryList: [], categoryData: [] }, // 用于产出图绘制
      statusData: { categoryData: [{ name: '', value: [] }] }, // 机台的坐标、状态
      geoCoordMap: [],
      runPercentage: 0,
      runQuantity: 0,
      waitPercentage: 0,
      waitQuantity: 0,
      warnPercentage: 0,
      warnQuantity: 0,
      idelPercentage: 0,
      idelQuantity: 0,
      smtOEE: [],
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
      chartStyle: {
        // width: '980px',
        // height: '784px',
        width: '1280px',
        height: '1024px',
        float: 'left',
        position: 'relative',
        // backgroundSize: 'cover!important', // 这个参数很重要，不生效背景图不会自动缩放
        backgroundSize: '100% 100%!important',
        backgroundImage: ''
      },
      mainStyle: {
        height: '768px'
      },
      throStyle: {
        height: '350px'
      }
    }
  },
  computed: {
    role() {
      return this.name === 'admin' ? '超级管理员' : '普通用户'
    },
    reachAll() {
      return (parseFloat(this.reachRate) * 100).toFixed(2)
    },
    throughputAll() {
      let j = 0
      for (let i = 0; i < this.throughputData.categoryData.length; i++) {
        j += parseInt(this.throughputData.categoryData[i])
      }

      return j
    }
  },
  watch: {},
  mounted() {
    const _this = this // 声明一个变量指向Vue实例this，保证作用域一致
    _this.getLine()

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
    // 从PIS接口获取指产线列表
    getLine: function() {
      const _this = this
      pis
        .fetchArea()
        .then(res => {
          _this.lineList = res.data
        })
        .catch(res => {
          console.log('请求失败：' + res.status + ',' + res.statusText)
        })
    },
    // 从PIS接口获取指定线的状态数据
    getData: function() {
      const _this = this // 声明一个变量指向Vue实例this，保证作用域一致,否则在下面的无法将res.data.Throughput赋值给throughputData
      let statRun = 0
      let statWait = 0
      let statWarn = 0
      let statIdel = 0

      if (_this.lineName === '') {
        this.$message.error('当前没有选择要显示的线，请重新选择.')
        return
      }

      // 获取区域机台坐标
      pis
        .fetchAreaStationCoordinate(this.lineID)
        .then(function(res) {
          _this.geoCoordMap = res.data
        })
        .catch(res => {
          console.log('请求失败：' + res.status + ',' + res.statusText)
        })

      // 获取机台状态
      pis
        .fetchAreaStatus(this.linePara)
        .then(function(res) {
          // 因为Object和JSON中数组是没有Length这个属性的，为方便统计，将JSON中的数组赋值给一个对象
          // 或者也可以用 var arr=Object.keys(obj);arr.length的方式
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
          const ow = 1280
          const oh = 1024

          for (var i = 0; i < _this.geoCoordMap.length; i++) {
            for (var j = 0; j < locValue.length; j++) {
              if (
                _this.geoCoordMap[i].point_Name === locValue[j].STATION_NAME
              ) {
                // 已经背景布局图的原始大小1280*1024，计算缩放后的点坐标
                newPosition = adjustPosition(
                  _this.geoCoordMap[i].point_x,
                  _this.geoCoordMap[i].point_y,
                  ow,
                  oh,
                  w,
                  h
                )

                _this.statusData.categoryData.push({
                  name: _this.geoCoordMap[i].point_Name,
                  value: [
                    // 原始坐标
                    // _this.geoCoordMap[i].point_x,
                    // _this.geoCoordMap[i].point_y,
                    // 换算后坐标
                    newPosition.x,
                    newPosition.y,
                    locValue[j].STATUS
                  ]
                })

                switch (locValue[j].STATUS) {
                  case '0':
                    statIdel += 1
                    break
                  case '1':
                    statRun += 1
                    break
                  case '2':
                    statWait += 1
                    break
                  case '3':
                    statWarn += 1
                    break
                }

                break // 跳出循环
              }
            }
          }

          const stationCount = _this.statusData.categoryData.length

          // 计算机台状态比例
          if (stationCount > 0) {
            _this.idelPercentage = parseInt((statIdel / stationCount) * 100)
            _this.runPercentage = parseInt((statRun / stationCount) * 100)
            _this.waitPercentage = parseInt((statWait / stationCount) * 100)
            _this.warnPercentage = parseInt((statWarn / stationCount) * 100)
            _this.idelQuantity = statIdel
            _this.runQuantity = statRun
            _this.waitQuantity = statWait
            _this.warnQuantity = statWarn
          }

          // 告警
          if (statWarn > 0) {
            _this.play()
          }
        })
        .catch(res => {
          console.log('请求失败：' + res.status + ',' + res.statusText)
        })

      // 获取区域产出
      pis
        .fetchAreaThroughputAndYield(this.groupName)
        .then(function(res) {
          _this.throughputData = { categoryList: [], categoryData: [] }

          for (let i = 0; i < res.data.length; i++) {
            _this.throughputData.categoryList.push(
              res.data[i].STATION + ' ' + res.data[i].PRODUCT
            )
            _this.throughputData.categoryData.push(res.data[i].THROUGHPUT)
          }
        })
        .catch(res => {
          console.log('请求失败：' + res.status + ',' + res.statusText)
        })

      // 获取SMT OEE
      if (_this.lineName === 'SMT') {
        pis
          .fetchSMTOEE()
          .then(function(res) {
            _this.smtOEE = res.data
          })
          .catch(res => {
            console.log('请求失败：' + res.status + ',' + res.statusText)
          })
      }
    },
    // 产线选择变化
    onSelectChange: function(key, val) {
      this.lineName = key.Area_Name
      this.groupName = key.Area_Group_Para
      this.lineID = key.Area_ID
      this.linePara = key.Area_Para
      this.lineImage = key.Area_SVG
    },
    // 选择产线确认
    onSelect: function() {
      if (this.lineName === '') {
        this.$message.error('请选择要显示的产线')
        return
      } else {
        this.dialogFormVisible = false
        this.boardVisible = true
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
      if (this.lineName === '' || this.lineName === 'undefined') {
        this.mainStyle.height = window.screen.height - 60 + 'px'
        this.chartStyle.height = window.screen.height - 240 + 'px'
        this.chartStyle.width =
          Math.round((window.screen.height - 240) / 0.8) + 'px'
        this.chartStyle.background =
          'url(http://192.168.123.30/epis/svg/SMT.svg) no-repeat center !important'
      } else if (this.lineName === 'SMT') {
        this.mainStyle.height = window.screen.height - 60 + 'px'
        this.throStyle.height = window.screen.height - 453 + 'px'
        this.chartStyle.height = window.screen.height - 433 + 'px'
        this.chartStyle.width =
          Math.round((window.screen.height - 433) / 0.8) + 'px'
        this.chartStyle.backgroundImage =
          'url(http://192.168.123.30/epis/svg/' +
          this.lineImage +
          ')  !important'
      } else {
        this.mainStyle.height = window.screen.height - 60 + 'px'
        this.throStyle.height = window.screen.height - 453 + 'px'
        this.chartStyle.height = window.screen.height - 175 + 'px'
        this.chartStyle.width =
          Math.round((window.screen.height - 175) / 0.8) + 'px'
        this.chartStyle.backgroundImage =
          'url(http://192.168.123.30/epis/svg/' +
          this.lineImage +
          ')  !important'
      }
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
  /* line-height: 60px; */
  color: White;
  font-size: 20px;
  font-family: 'BebasNeueRegular', Arial, Helvetica, sans-serif;
  text-shadow: 0 0 5px #00c6ff;
}
.collapse-btn {
  float: left;
  padding: 0 5px;
  cursor: pointer;
  /* line-height: 60px; */
  color: White;
  font-size: 30px;
  font-family: 'BebasNeueRegular', Arial, Helvetica, sans-serif;
  text-shadow: 0 0 5px #00c6ff;
}
.chart-wrapper {
  /* height: 350px; */
  border: 1px;
  background: #404040;
  color: white;
  font-size: 12px;
  font-family: 'BebasNeueRegular', Arial, Helvetica, sans-serif;
  /* text-shadow: 0 0 5px #00c6ff; */
  /* padding: 16px 16px 0; */
  margin-bottom: 4px;
}
.pie-chart {
  float: left;
  padding: 0 5px;
  cursor: pointer;
}
.status-wrapper {
  width: 980px;
  height: 784px;
  /* width:1280px;
  height:1024px; */
  float: left;
  position: relative;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  /*注意：最高权重必须要给，不然样式会被覆盖掉*/
  /* background: url("../../../assets/pis_images/SMT.svg") no-repeat center!important;  */
  background: url(http://192.168.123.30/epis/svg/SMT.svg) no-repeat center !important;
  /*注意：背景图大小宽高都给到100%,且加上最高权重  */
  background-size: cover !important;
}
.content-throughput-top {
  display: flex;
  align-items: center;
  justify-content: left;
  text-align: justify;
  width: 150px;
  height: 150px;
  margin: 0 auto;
  font-size: 20px;
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
/* .content-top5 {
  width: 250px;
  height: 250px;
} */
.el-row {
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.el-header,
.el-footer {
  /* background-color: #303030; */
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
  /* text-align: center; */
  /* line-height: 160px; */
  font-size: 16px;
  font-family: 'BebasNeueRegular', Arial, Helvetica, sans-serif;
  /* text-shadow: 0 0 5px #00c6ff; */
}
.progress-item {
  margin-bottom: 5px;
  font-size: 14px;
}
.el-progress {
  width: 90%;
  display: flex;
  /* justify-content: space-between; */
  /* align-items: center; */
  /* position: relative; */
  /* line-height: 1; */
}
.el-progress-bar {
  padding-right: 30px;
  width: 85%;
}
.el-progress__text {
  font-size: 12px !important;
  color: #fff;
}
</style>
