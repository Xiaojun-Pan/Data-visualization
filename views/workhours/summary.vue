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
      <el-table-column label="部门名称/编号" align="left" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.dept_name }}[{{ scope.row.deptno }}]</span>
        </template>
      </el-table-column>
      <el-table-column label="有效工时" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.recordedhours }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应出勤工时" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.attendancehours }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人员工时利用率" align="left">
        <template slot-scope="scope">
          <span>{{ sumAmount(scope.row) }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="lineRouter(row.deptno)">查看部门详细</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import workhours from '@/api/workhours'
import waves from '@/directive/waves' // waves directive
import { decrypt, encrypt } from '@/utils/crypto' // AES 加密解密模块
export default {
  name: 'ComplexTable',
  directives: { waves },
  data() {
    return {
      listdata: [],
      param: {},
      end_time: '',
      start_time: '',
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
      const res = await workhours.getSummaryInfo(_this.$route.query.param)
      _this.listdata = res.data
      const param = JSON.parse(decrypt(_this.$route.query.param))
      _this.$set(_this.param, 'start_time', param.start_time)
      _this.$set(_this.param, 'end_time', param.end_time)
      this.listLoading = false
    },
    sumAmount(row) {
      return parseFloat((row.recordedhours / row.attendancehours) * 100).toFixed(2)
    },
    lineRouter(deptno) {
      const _this = this
      var depar = []
      depar.unshift(deptno)
      _this.$set(_this.param, 'departments', depar)
      console.log(JSON.stringify(this.param))
      _this.$router.push({
        path: `GetDepartmentDetail`,
        query: {
          param: encrypt(JSON.stringify(_this.param))
        }
      })
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

