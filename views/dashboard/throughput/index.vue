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
          <el-select
            v-model="form.region"
            placeholder="请选择生产区域"
            @change="onSelectChange"
          >
            <el-option
              v-for="(item, index) in lineList"
              :key="index"
              :label="item.LINE_NAME"
              :value="item.LINE_NAME"
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
          <i class="el-icon-menu" /> /> />
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
      <div class="header-title">班别:{{ shift }}</div>
      <div class="header-title">产品:{{ product }}</div>

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
      <el-row :gutter="4">
        <el-col
          :xs="24"
          :sm="24"
          :lg="6"
        >
          <el-card
            shadow="always"
            class="chart-wrapper"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <span>IPQC当前不良前五项</span>
            </div>

            <div>
              <bar-chart
                :chart-data="defectNow"
                :height="pieStyle.height"
              />
            </div>
          </el-card>
        </el-col>

        <el-col
          :xs="24"
          :sm="24"
          :lg="6"
        >
          <el-card
            shadow="always"
            class="chart-wrapper"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <span>优秀达成率</span>
            </div>
            <!-- <div class="dashboard"> -->
            <div>
              <gauge-chart
                :chart-data="bestReach"
                :height="pieStyle.height"
              />
            </div>
          </el-card>
        </el-col>

        <el-col
          :xs="24"
          :sm="24"
          :lg="6"
        >
          <el-card
            shadow="always"
            class="chart-wrapper"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <span>IPQC当班良率</span>
            </div>

            <div>
              <gauge-chart
                :chart-data="DefectYield"
                :height="pieStyle.height"
              />
            </div>
          </el-card>
        </el-col>

        <el-col
          :xs="24"
          :sm="24"
          :lg="6"
        >
          <el-card
            shadow="always"
            class="chart-wrapper"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <span>IPQC当班不良前五项</span>
            </div>

            <div>
              <bar-chart
                :chart-data="defect"
                :height="pieStyle.height"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!--达成率和产出-->
      <el-row :gutter="4">
        <el-col :span="24">
          <el-card
            shadow="hover"
            class="chart-wrapper"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <span>当前达成率和产出</span>
            </div>

            <div style=" float:left; width:10%">
              <div class="content-throughput-top">
                <p>达成率:{{ reachAll }}%</p>
              </div>
              <div class="content-throughput-top">
                <span>总产出:{{ throughputAll }}</span>
              </div>
            </div>
            <div style=" float:right; width:90%">
              <!-- 表格呈现 -->
              <!-- <table class="content-throughput">
                  <tr class="grid-section">
                    <td>时段</td>
                    <td v-for=" (item,index) in this.throughputData.categoryList"
                        :key="index">{{item}}</td>
                  </tr>
                  <tr class="grid-target">
                    <td>目标</td>
                    <td v-for=" (item,index) in this.throughputData.lineData"
                        :key="index">{{item}}</td>
                  </tr>
                  <tr class="grid-throughput">
                    <td>产出</td>
                    <td v-for=" (item,index) in this.throughputData.categoryData"
                        :key="index">{{item}}</td>
                  </tr>
                </table> -->
              <!-- 图表呈现 -->

              <cross-chart
                :chart-data="throughputData"
                :height="crossStyle.height"
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
import GaugeChart from './components/GaugeChart'
import CrossChart from './components/CrossChart'
import { getClock } from '@/utils'

export default {
  name: 'TPDashboard',
  components: {
    BarChart, // 柱状图
    GaugeChart, // 仪表盘
    CrossChart // 折柱混合
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
      product: '', // 当前线产品
      shift: '', // 当前线班别
      name: localStorage.getItem('ms_username'),
      clock: '', // 页面右上角当前时间时钟
      dataTime: '', // 右上角数据时间
      screenQty: 0, // 线体最小测试量
      DefectYield: '', // 当班不良率
      bestReach: '', // 历史最佳达成率
      reachRate: 0, // 当前当班达成率
      defect: { categoryList: [], categoryData: [] }, // 接口返回的当班不良
      defectNow: { categoryList: [], categoryData: [] }, // 接口返回的当前不良
      throughputData: { categoryList: [], categoryData: [], lineData: [] }, // 用于每小时产出图绘制

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
      pieStyle: {
        height: '200px'
      },
      crossStyle: {
        height: '300px'
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
  mounted() {
    const _this = this // 声明一个变量指向Vue实例this，保证作用域一致
    _this.getLine()
    // pis
    //   .fetchEmpInfo({
    //     func: 'GetEmpInfo',
    //     param: '{emp_no:"20002273",cday:"2019/5/10"}'
    //   })
    //   .then(res => {
    //     console.log(res)
    //   })

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
        .fetchLine()
        .then(res => {
          _this.lineList = res.data.Line
        })
        .catch(res => {
          console.log('请求失败：' + res.status + ',' + res.statusText)
        })
    },
    // 从PIS接口获取指定线的状态数据
    getData: function() {
      const _this = this // 声明一个变量指向Vue实例this，保证作用域一致,否则在下面的无法将res.data.Throughput赋值给throughputData
      if (_this.lineName === '') {
        this.$message.error('当前没有选择要显示的线，请重新选择.')
        return
      }
      pis
        .fetchLineStatus(this.lineName)
        .then(function(res) {
          // 因为Object和JSON中数组是没有Length这个属性的，为方便统计，将JSON中的数组赋值给一个对象
          // 或者也可以用 var arr=Object.keys(obj);arr.length的方式
          _this.product = res.data.Product
          _this.shift = res.data.Shift
          _this.screenQty = res.data.ScreenQty
          _this.DefectYield = res.data.DefectYield
          _this.bestReach = res.data.BestReach
          _this.reachRate = res.data.ReachRate
          const throughputArray = res.data.Throughput
          const defectArray = res.data.Defect
          const defectNowArray = res.data.DefectNow

          // 每小时产出
          _this.throughputData = {
            categoryList: [],
            categoryData: [],
            lineData: []
          }
          for (let i = 0; i < throughputArray.length; i++) {
            _this.throughputData.categoryList.push(throughputArray[i].Section)
            _this.throughputData.categoryData.push(
              throughputArray[i].Throughput
            )
            _this.throughputData.lineData.push(throughputArray[i].Target)
          }

          // 当班前五项不良
          _this.defect = { categoryList: [], categoryData: [] }
          for (let i = 0; i < 5; i++) {
            if (i < defectArray.length) {
              _this.defect.categoryList.push(defectArray[i].defect)
              _this.defect.categoryData.push(defectArray[i].defectcount)
            } else {
              _this.defect.categoryList.push('NA')
              _this.defect.categoryData.push(0)
            }
          }

          // 当前这一小时前五项不良
          _this.defectNow = { categoryList: [], categoryData: [] }
          for (let i = 0; i < 5; i++) {
            if (i < defectNowArray.length) {
              _this.defectNow.categoryList.push(defectNowArray[i].defect)
              _this.defectNow.categoryData.push(defectNowArray[i].defectcount)
            } else {
              _this.defectNow.categoryList.push('NA')
              _this.defectNow.categoryData.push(0)
            }
          }
        })
        .catch(res => {
          console.log('请求失败：' + res.status + ',' + res.statusText)
        })
      // .catch(function (e) { console.log(e); })
    },
    // 产线选择变化
    onSelectChange: function(key, val) {
      this.lineName = key
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
      _this.resizeChart()
      _this.getData()
      this.dataTime = getClock()

      // 定时1分钟刷新
      setInterval(function() {
        _this.resizeChart()
        _this.getData()
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
    resizeChart() {
      // 依据屏幕解析度和产线调整背景图和宽高
      this.mainStyle.height = window.screen.height - 60 + 'px'
      this.pieStyle.height =
        Math.round((window.screen.height - 310) * 0.4) + 'px'
      this.crossStyle.height =
        Math.round((window.screen.height - 310) * 0.6) + 'px'
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
  font-family: 'BebasNeueRegular', Arial, Helvetica, sans-serif;
  text-shadow: 0 0 5px #00c6ff;
  padding: 16px 16px 0;
  margin-bottom: 4px;
}

.content-throughput-top {
  display: flex;
  align-items: center;
  justify-content: left;
  text-align: justify;
  width: 150px;
  height: 100px;
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
  /* margin-bottom: 20px; */
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  /* margin-bottom: 20px; */
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
  text-shadow: 0 0 5px #00c6ff;
}
</style>
