<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="listdata"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="日期" width="100" fixed prop="operatedate" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.operatedate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="70" fixed>
        <template slot-scope="scope">
          <span> {{ scope.row.emp_name }} </span>
        </template>
      </el-table-column>
      <el-table-column label="部门工时填写项目">
        <el-table-column
          v-for="(val,i) in colName"
          :key="i"
          :label="val"
          width="140"
          :prop="val"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row[val] }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="实际出勤工时" width="70" fixed prop="rate" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.attendancehours }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工时利用率" width="70" fixed prop="rate" sortable>
        <template slot-scope="scope">
          <span>{{ (parseFloat(scope.row.rate)*100).toFixed(0) }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="有效工时" width="60" fixed prop="sum" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.sum }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import workhours from '@/api/workhours'
import waves from '@/directive/waves' // waves directive
// import { stringify } from 'querystring';
export default {
  name: 'ComplexTable',
  directives: { waves },
  data() {
    return {
      listdata: [],
      colName: [],
      end_time: '',
      start_time: '',
      param: {},
      listLoading: true
    }
  },
  created() {},
  mounted() {
    const _this = this
    _this.getList()
  },
  methods: {
    // 获取列表
    async getList() {
      const _this = this
      this.listLoading = true
      var empno = []
      empno.push(_this.$route.query.empno)
      _this.param.departments = empno
      _this.param.start_time = _this.$route.query.startdate
      _this.param.end_time = _this.$route.query.enddate
      console.log('params对象')
      console.log(_this.param)
      const res = await workhours.getPersonDetail(JSON.stringify(_this.param))
      console.log('aaaaaaaaa-------===========')
      console.log(res)
      var colLength = Object.keys(res.data[0]).length
      var startLength = 0
      for (const j in res.data[0]) {
        if (startLength > 3 && startLength < colLength - 3) {
          this.colName.push(j)
        }
        startLength += 1
      }
      _this.listdata = res.data
      this.listLoading = false
    },
    lineRouter(empno) {
      return empno
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

