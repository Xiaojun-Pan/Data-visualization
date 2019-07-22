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
      <el-table-column label="姓名" width="70" fixed>
        <template slot-scope="scope">
          <router-link :to="{path:'/report/GetPersonDetail', query: {empno: lineRouter(scope.row.emp_no),startdate: start_time,enddate: end_time}}">  {{ scope.row.emp_name }} </router-link>
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
          <span>{{ (parseFloat(scope.row.rate)*100).toFixed(2) }}%</span>
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
import { decrypt } from '@/utils/crypto' // AES 加密解密模块
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
      var paramUrl = decrypt(_this.$route.query.param)
      _this.start_time = JSON.parse(paramUrl).start_time
      _this.end_time = JSON.parse(paramUrl).end_time
      const res = await workhours.GetDepartmentDetail(paramUrl)
      var colLength = Object.keys(res.data[0]).length
      var startLength = 0
      for (const j in res.data[0]) {
        if (startLength > 3 && startLength < colLength - 3) {
          this.colName.push(j)
        }
        startLength += 1
      }
      // console.log(res.data)
      // res.data[0].map((v, b) => {
      //   // v.map(j => {
      //   //   console.log('----------------')
      //   //   console.log(v)
      //   //   console.log(j)
      //   // })
      //   // JSON.parse(v).forEach(form_id => {
      //   //   console.log(form_id)
      //   // })
      //   // res.data[0].map(a => {
      //   //   console.log(v)
      //   // })
      //   console.log('----------------')
      //   console.log(v, b)
      // })
      // for (const j in res.data) {
      //   console.log('bbcccdd-----' + j)
      //   var aa = []
      //   var flag = 0
      //   for (const i in res.data[j]) {
      //     aa.push(res.data[j][i])
      //     console.log('flag值' + flag)
      //     flag += 1
      //     console.log(res.data[j][i])
      //   }
      //   console.log('---------------')
      //   this.showdata.push(aa)
      //   console.log(aa)
      // }
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

