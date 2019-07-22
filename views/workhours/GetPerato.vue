<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="reportQuery"
      label-position="left"
      label-width="100px"
      :rules="rules"
      style="width: 300px; margin-left:50px;"
    >
      <el-form-item label="开始日期:" prop="startdate">
        <el-date-picker
          v-model="reportQuery.startdate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="结束日期:" prop="enddate">
        <el-date-picker
          v-model="reportQuery.enddate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-left:150px">
      <el-button type="primary" @click="toPDF()">
        报表查询
      </el-button>
    </div>

  </div>
</template>
<script>
// import reportinfo from '@/api/report'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'ComplexTable',
  directives: { waves },
  data() {
    return {
      param: {},
      reportQuery: {
        startdate: '',
        enddate: ''
      },
      rules: {
        startdate: [
          { required: true, message: '开始日期不能为空!', trigger: 'change' }
        ],
        enddate: [
          { required: true, message: '结束日期不能为空!', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    toPDF() {
      const _this = this
      _this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$router.push({
            path: `/report/GetPeratoDetail`,
            query: {
              startdate: _this.reportQuery.startdate, enddate: _this.reportQuery.enddate
            }
          })
        }
      })
    }

  }
}
</script>
