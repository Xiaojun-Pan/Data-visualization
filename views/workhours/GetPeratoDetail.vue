<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div>
          <bar-chart
            v-if="defect['categoryList'].length"
            :chart-data="defect"
            :height="pieStyle.height"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import workhours from '@/api/workhours'
import waves from '@/directive/waves' // waves directive
import BarChart from './components/BarChart'
// import { stringify } from 'querystring';
export default {
  name: 'ComplexTable',
  directives: { waves },
  components: {
    BarChart // 柱状图
  },
  data() {
    return {
      listdata: [],
      colName: [],
      itemarr: [],
      itemarracount: [],
      param: {},
      end_time: '',
      start_time: '',
      defect: { categoryList: [], categoryData: [] },
      listLoading: true,
      pieStyle: {
        height: '400px'
      }
    }
  },
  created() {
    const _this = this
    _this.getList()
  },
  mounted() {
  },
  methods: {
    // 获取列表
    async getList() {
      const _this = this
      var depa = ['20707100', '20404001']
      _this.param.departments = depa
      _this.param.start_time = _this.$route.query.startdate
      _this.param.end_time = _this.$route.query.enddate
      //  _this.defect.categoryList = ['11','222']
      //  _this.defect.categoryData = [12,333]
      const res = await workhours.GetPerato(JSON.stringify(_this.param))
      // 对各部门工作的TOP1,进行汇总再进行去重
      res.data.map((item) => _this.itemarr.findIndex((value, index, arr) => {
        return value === item.item_name
      }) === -1 && _this.itemarr.push(item.item_name) && _this.itemarracount.push(item.totalhours))
      var colLength = Object.keys(res.data[0]).length
      _this.defect.categoryList = _this.itemarr
      _this.defect.categoryData = _this.itemarracount
      var startLength = 0
      for (const j in res.data[0]) {
        if (startLength > 3 && startLength < colLength - 3) {
          this.colName.push(j)
        }
        startLength += 1
      }
      _this.listdata = res.data
      this.listLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
}
.customWidth{
  width:80%;
}
</style>

