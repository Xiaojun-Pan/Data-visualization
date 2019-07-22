<template>
  <div class="app-container">
    <div class="filter-container" align="center" style="font-size:24px">
      {{ reportTitle }}
    </div>
    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple" aglin="left" style="size-font:14px">日期范围:{{ Temp.startdate }} - {{ Temp.enddate }} </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light" align="right" style="size-font:14px">制表人:{{ Temp.accountId }}</div></el-col>
    </el-row>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="listdata"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-top:20px"
    >
      <el-table-column
        label="设备编号"
        align="center"
        width="90"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.device_serial_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" align="left" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.device_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备位置" align="left" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.device_location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作业人员" align="left" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作业时间" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.check_record_time }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="作业内容" align="left">
        <template slot-scope="scope">
          <span v-for="(v,key) in scope.row.record_item" :key="key" class="item">
            {{ key + 1 }}.作业内容: {{ v.itemname }}-<span :class="v.itemvalue === 'FAIL' ? 'danger' : 'success'">  结果:[{{ v.itemvalue }}]</span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="content_manager" align="right" style="margin-top:20px;font-size:16px;margin-right:150px">
      <span>主管审核:</span>
    </div>
    <aside style="margin-top:15px;font-size:14px">
      <span>作业说明：</span>
      <span>{{ reportDescript }}</span>
    </aside>
  </div>
</template>

<script>
import reportinfo from '@/api/report'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'ComplexTable',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      listdata: [],
      listLoading: true,
      reportTitle: '',
      reportDescript: '',
      Temp: {
        startdate: '',
        enddate: '',
        accountId: '',
        formid: ''
      }
    }
  },
  created() {},
  mounted() {
    const _this = this
    _this.initData()
    _this.getTemplateInfo()
    _this.getList()
  },
  methods: {
    initData() {
      const _this = this
      _this.Temp.startdate = _this.$route.query.startdate
      _this.Temp.enddate = _this.$route.query.enddate
      _this.Temp.accountId = _this.$route.query.accoundId
      _this.Temp.formid = _this.$route.query.formid
    },
    getTemplateInfo() {
      const _this = this
      reportinfo.getTemplateInfo(_this.Temp.formid).then(response => {
        _this.reportTitle = response.data[0].form_title
        _this.reportDescript = response.data[0].form_description
      })
    },
    // 根据登陆账号查询有权限的设备类型
    getList() {
      const _this = this
      this.listLoading = true
      // const test = _this.getUrlParam('accoundId')
      // 获取Url传过来的参数
      reportinfo.getReportInfo(_this.Temp).then(response => {
        console.log('-----------111111111')
        console.log(response)
        _this.listdata = response.data
        console.log(_this.Temp)
        console.log(response.data)
        setTimeout(() => {
          this.listLoading = false
          this.$nextTick(() => {
            window.print()
          })
        }, 3 * 1000)
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
  .danger
  {
    color: #F56C6C;
  }
  .success{
    color: #67C23A;
  }
  .item{
    display:block;
    color: #409EFF;
  }
}

</style>

