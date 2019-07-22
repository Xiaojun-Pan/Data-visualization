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
      <el-form-item label="表单名称:" prop="formid">
        <el-select
          v-model="reportQuery.formid"
          class="filter-item"
          value-key="form_Id"
          placeholder="Please select"
        >
          <el-option
            v-for="item in formItem"
            :key="item.form_Id"
            :label="item.form_name"
            :value="item.form_Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间:" prop="startdate">
        <el-date-picker
          v-model="reportQuery.startdate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="结束时间:" prop="enddate">
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
        生成作业报表
      </el-button>
    </div>

  </div>
</template>
<script>
// import reportinfo from '@/api/report'
import waves from '@/directive/waves' // waves directive
import devicetypeinfo from '@/api/devicetype'
export default {
  name: 'ComplexTable',
  directives: { waves },
  data() {
    return {
      username: this.$store.state.user.name,
      formItem: [],
      reportQuery: {
        startdate: '',
        enddate: '',
        formid: '',
        accoundId: ''
      },
      rules: {
        formid: [
          { required: true, message: '表单名称不能为空!', trigger: 'blur' }
        ],
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
    const _this = this
    _this.initdata()
    _this.getDeviceTypeFormInfo()
  },
  mounted() {
  },
  methods: {
    initdata() {
      const _this = this
      _this.reportQuery.accoundId = _this.username
      // console.log('打印用户名：' + this.$store.state.user.loginAccound)
      // console.log('打印token：' + this.$store.state.user.token)
      // console.log('打印用户名：' + this.$store.state.user.name)
    },
    getDeviceTypeFormInfo() {
      const _this = this
      devicetypeinfo.getDeviceTypeForm(_this.username).then(response => {
        // console.log(response)
        _this.formItem = response.data
      })
    },
    toPDF() {
      const _this = this
      _this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // this.$router.replace('/report/index')
          const { href } = this.$router.resolve({ path: '/report/index', query: _this.reportQuery })
          window.open(href, '_blank')
        }
      })
    }

  }
}
</script>
