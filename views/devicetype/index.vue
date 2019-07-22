<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="listdata"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="编号"
        prop="device_type_Id"
        sortable="custom"
        align="center"
        width="130"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.device_type_Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型名称" align="left" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.device_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型描述" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.device_descript }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        class-name="small-padding fixed-width"
        width="260"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">{{ $t('table.edit') }}</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="deviceTemp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="类型名称:" prop="device_name">
          <el-input v-model="deviceTemp.device_name" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="类型说明:" prop="device_descript">
          <el-input v-model="deviceTemp.device_descript" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="关联表单:">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="formItem" :props="defaultProps" show-checkbox node-key="form_Id" class="permission-tree" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import devicetypeinfo from '@/api/devicetype'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      listdata: [],
      total: 0,
      listLoading: true,
      account: this.$store.state.user.name,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        accountId: ''
      },
      defaultProps: {
        id: 'form_Id',
        label: 'form_name'
      },
      formItem: [],
      form_id_item: 0,
      checkStrictly: false,
      getformcycle: [],
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      deviceTemp: {
        device_type_Id: '',
        device_name: '',
        device_descript: '',
        device_form_id: '',
        accound_id: this.account
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '设备类型编辑',
        create: '设备类型注册'
      },
      itemdialogVisible: false,
      // 定义表单验证约束
      rules: {
        device_name: [
          { required: true, message: '设备名称不能为空!', trigger: 'blur' }
        ],
        device_descript: [
          { required: true, message: '设备说明不能为空!', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {},
  mounted() {
    const _this = this
    _this.getList()
    _this.getDeviceTypeFormInfo()
  },
  methods: {
    // 根据登陆账号查询有权限的设备类型
    getList() {
      const _this = this
      this.listLoading = true
      _this.listQuery.accountId = _this.account
      devicetypeinfo.getDeviceType(_this.listQuery).then(response => {
        _this.listdata = response.data
        _this.total = response.page

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    //  根据账号所属的组，获取组下的所有表单
    async getDeviceTypeFormInfo() {
      const _this = this
      await devicetypeinfo.getDeviceTypeForm(_this.account).then(response => {
        _this.formItem = response.data
      })
    },
    // 重置页数，重新获取数据
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 排序事件
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'device_type_Id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    //  重置新增表单input的值
    resetTemp() {
      this.deviceTemp = {
        device_type_Id: '',
        device_name: '',
        device_descript: '',
        device_form_id: '',
        accound_id: this.account
      }
    },
    //  弹出新增表单窗口
    handleCreate() {
      const _this = this
      _this.resetTemp()
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      _this.$nextTick(() => {
        _this.$refs['dataForm'].clearValidate()
        _this.$refs.tree.setCheckedKeys([])
      })
    },
    //  提交新增设备类型
    createData() {
      const _this = this
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const items = _this.$refs.tree.getCheckedKeys()
          let itemArray = ''
          items.forEach(item => {
            itemArray += item + '|'
          })
          _this.deviceTemp.device_form_id = itemArray
          _this.deviceTemp.accound_id = _this.account
          devicetypeinfo.createDeviceTypeForm(_this.deviceTemp).then(response => {
            const code = response.code
            if (code === '1') {
              _this.deviceTemp.device_type_Id = response.data.getid //  device_type_Id
              _this.listdata.unshift(_this.deviceTemp) // 把当前新增的数据添加到listdata里的前面
              _this.dialogFormVisible = false
              _this.$notify({
                title: '成功',
                message: '设备类型添加成功!',
                type: 'success',
                duration: 2000
              })
            } else {
              _this.$notify({
                title: '失败',
                message: '设备类型添加失败，请检查输入的内容是否符合要求!',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    //  弹出修改窗口
    handleUpdate(row) {
      const _this = this
      _this.deviceTemp = Object.assign({}, row) // copy obj
      //  _this.deviceTemp['device_form_id'] = ''
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
      devicetypeinfo.getDeviceTypeBindForm(row.device_type_Id).then(response => {
        const data = []
        response.data.forEach(form_id => {
          data.push(form_id.form_id)
        })
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(data)
          this.checkStrictly = false
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    //  提交修改表单
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const _this = this
          const tempData = Object.assign({}, _this.deviceTemp)
          const items = _this.$refs.tree.getCheckedKeys()
          let itemArray = ''
          items.forEach(item => {
            itemArray += item + '|'
          })
          tempData.device_form_id = itemArray
          devicetypeinfo.updateDeviceTypeBindForm(tempData).then(response => {
            const code = response.code
            if (code === '1') {
              for (const v of _this.listdata) {
                if (v.device_type_Id === this.deviceTemp.device_type_Id) {
                  const index = this.listdata.indexOf(v)
                  this.listdata.splice(index, 1, this.deviceTemp)
                  break
                }
              }
              _this.dialogFormVisible = false
              _this.$notify({
                title: '成功',
                message: '数据更新成功!',
                type: 'success',
                duration: 2000
              })
            } else {
              _this.$notify({
                title: '失败',
                message: '数据更新失败，请检查输输入的内容是否符合要求!',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    //  表单删除，删除前要确定表单是否绑定有设备，如果有将无法删除表单
    handleDelete(row) {
      this.$confirm('你确定要删除这个设备类型吗?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await devicetypeinfo.delDeviceTypeForm(row.device_type_Id).then(response => {
            const code = response.code
            if (code === '1') {
              const index = this.listdata.indexOf(row)
              this.listdata.splice(index, 1)
              this.$message({
                type: 'success',
                message: '设备类型已删除!'
              })
            } else if (code === '2') {
              this.$message({
                type: 'error',
                message: '你删除的设备类型，绑定的有设备，无法删除!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '设备类型删除失败，请稍后重试!'
              })
            }
          })
        })
        .catch(err => {
          console.error(err)
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

