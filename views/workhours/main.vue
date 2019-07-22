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
      <el-form-item label="部门选择:">
        <el-tree ref="tree" :check-strictly="checkStrictly" :data="depaItem" :props="defaultProps" show-checkbox node-key="dept_no" class="permission-tree" />
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
import workhours from '@/api/workhours'
import { encrypt } from '@/utils/crypto' // AES 加密解密模块
export default {
  name: 'ComplexTable',
  directives: { waves },
  data() {
    return {
      username: this.$store.state.user.name,
      checkStrictly: false,
      depaItem: [],
      param: {},
      reportQuery: {
        startdate: '',
        enddate: '',
        formid: '',
        accoundId: ''
      },
      defaultProps: {
        id: 'dept_no',
        label: 'dept_name'
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
    const _this = this
    _this.getDepaInfo()
  },
  mounted() {
  },
  methods: {
    async getDepaInfo() {
      const res = await workhours.getdepaInfo()
      this.depaItem = res.data
    },
    toPDF() {
      const _this = this
      _this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const items = _this.$refs.tree.getCheckedKeys()
          if (items.length > 0) {
            _this.$set(_this.param, 'departments', items)
            _this.$set(_this.param, 'start_time', _this.reportQuery.startdate)
            _this.$set(_this.param, 'end_time', _this.reportQuery.enddate)
            // workhours.getSummaryInfo(JSON.stringify(_this.param)).then(response => {
            //   console.log('--------------11111111111')
            //   console.log(response.data)
            // })
            // const { href } = this.$router.resolve({ path: '/workhours/summary', query: _this.reportQuery })
            this.$router.push({
              path: `/report/summary`,
              query: {
                param: encrypt(JSON.stringify(_this.param))
              }
            })
          } else {
            _this.$notify({
              title: '告警',
              message: '最少需要选择一个部门!',
              type: 'error',
              duration: 2000
            })
          }
        }
      })
    }

  }
}
</script>
