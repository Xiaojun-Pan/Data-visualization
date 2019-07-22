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
        prop="form_Id"
        sortable="custom"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.form_Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表单编号" align="left" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.form_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表单名称" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.form_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表单标题" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.form_title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作业类型" align="left" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.cycle_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        class-name="small-padding fixed-width"
        width="220"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="addItem(row)">项目</el-button>
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
        <el-form-item label="表单编号:" prop="form_code">
          <el-input v-model="deviceTemp.form_code" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="表单名称:" prop="form_name">
          <el-input v-model="deviceTemp.form_name" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="表单标题:" prop="form_title">
          <el-input v-model="deviceTemp.form_title" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="作业周期:" prop="cycle_id">
          <el-select
            v-model="deviceTemp.cycle_id"
            class="filter-item"
            value-key="cycle_id"
            placeholder="Please select"
            @change="getCycleName"
          >
            <el-option
              v-for="item in getformcycle"
              :key="item.cycle_id"
              :label="item.cycle_name"
              :value="item.cycle_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="表单说明:" prop="form_description">
          <el-input v-model="deviceTemp.form_description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
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
    <el-dialog :visible.sync="itemdialogVisible" width="60%" title="作业项目新增/编辑">
      <el-form label-width="80px" label-position="top">
        <el-form-item label="项目过滤:">
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
        </el-form-item>
        <el-form-item label="作业项目:">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="formItem" :props="defaultProps" show-checkbox node-key="item_Id" :filter-node-method="filterNode" class="permission-tree" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="itemdialogVisible=false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmFormItem">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formtemplate from '@/api/formtemplate'
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
        id: 'item_Id',
        label: 'item_descript'
      },
      filterText: '',
      formItem: [],
      form_id_item: 0,
      checkStrictly: false,
      getformcycle: [],
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      deviceTemp: {
        accountId: this.account,
        form_Id: '',
        form_code: '',
        form_name: '',
        form_title: '',
        cycle_id: '',
        cycle_name: '',
        form_description: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '表单信息编辑',
        create: '表单信息注册'
      },
      itemdialogVisible: false,
      // 定义表单验证约束
      rules: {
        form_code: [
          { required: true, message: '表单编号不能为空!', trigger: 'blur' }
        ],
        form_name: [
          { required: true, message: '表单名称不能为空!', trigger: 'blur' }
        ],
        form_title: [
          { required: true, message: '表单标题不能为空!', trigger: 'blur' }
        ],
        cycle_id: [
          {
            required: true,
            message: '作业周期不能为空!',
            trigger: 'change'
          }
        ],
        form_description: [
          { required: true, message: '表单说明不能为空!', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {},
  mounted() {
    const _this = this
    _this.getList()
    _this.getFormCycleInfo()
  },
  methods: {
    // 根据登陆账号查询有权限的表单
    getList() {
      const _this = this
      _this.listQuery.accountId = _this.account
      this.listLoading = true
      formtemplate.getformtemplate(_this.listQuery).then(response => {
        _this.listdata = response.data
        _this.total = response.page
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    //  获取当前选中作业周期名称,方便在新增成功后，后周期名称显示在table里
    getCycleName(val) {
      const _this = this
      let obj = {}
      obj = _this.getformcycle.find(item => {
        return item.cycle_id === val
      })
      _this.deviceTemp.cycle_name = obj.cycle_name
    },
    //  获取作业周期信息
    getFormCycleInfo() {
      formtemplate.getformcycleInfo().then(response => {
        const _this = this
        _this.getformcycle = response.data
      })
    },
    //  根据登陆账号的权限,获取所有作业项目
    async getFormItem() {
      const _this = this
      await formtemplate.getFormItem(_this.account).then(response => {
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
      if (prop === 'form_Id') {
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
        accountId: this.account,
        form_Id: '',
        form_code: '',
        form_name: '',
        form_title: '',
        cycle_id: '',
        cycle_name: '',
        form_description: ''
      }
    },
    //  弹出新增表单窗口
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //  提交新增表单
    createData() {
      const _this = this
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          formtemplate.createFormTemplate(_this.deviceTemp).then(response => {
            const code = response.code
            if (code === '1') {
              _this.deviceTemp.form_Id = response.data.getid //  取回插入数据的form_id
              _this.listdata.unshift(_this.deviceTemp) // 把当前新增的数据添加到listdata里的前面
              _this.dialogFormVisible = false
              _this.$notify({
                title: '成功',
                message: '表单创建成功!',
                type: 'success',
                duration: 2000
              })
            } else {
              _this.$notify({
                title: '失败',
                message: '表单创建失败，请检查输入的内容是否符合要求!',
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
      this.deviceTemp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //  提交修改表单
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const _this = this
          const tempData = Object.assign({}, _this.deviceTemp)
          formtemplate.updateFormTemplate(tempData).then(response => {
            const code = response.code
            if (code === '1') {
              for (const v of _this.listdata) {
                if (v.form_Id === this.deviceTemp.form_Id) {
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
      this.$confirm('你确定要删除这个表单吗?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await formtemplate.deleteFormTemplate(row.form_Id).then(response => {
            const code = response.code
            if (code === '1') {
              const index = this.listdata.indexOf(row)
              this.listdata.splice(index, 1)
              this.$message({
                type: 'success',
                message: '表单信息删除成功!'
              })
            } else if (code === '2') {
              this.$message({
                type: 'error',
                message: '你删除的表单，绑定的有设备，无法删除!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '表单信息删除失败!'
              })
            }
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    //  弹出项目编辑窗口
    addItem(row) {
      const _this = this
      _this.getFormItem()
      _this.itemdialogVisible = true
      _this.checkStrictly = true
      _this.form_id_item = row.form_Id
      formtemplate.getSelectedItem(row.form_Id).then(response => {
        const data = []
        response.data.forEach(form_id => {
          data.push(form_id.item_Id)
        })
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(data)
          this.checkStrictly = false
        })
      })
    },
    //  项目编辑提交
    confirmFormItem() {
      const _this = this
      const item = _this.$refs.tree.getCheckedKeys()
      let itemArray = ''
      item.forEach(item => {
        itemArray += item + '|'
      })
      formtemplate.saveSelectedItem(_this.form_id_item, itemArray).then(response => {
        if (response.code === '1') {
          _this.$message({
            type: 'success',
            message: '表单作业项目修改成功!'
          })
          _this.itemdialogVisible = false
        } else {
          _this.$message({
            type: 'error',
            message: '表单作业项目修改失败!'
          })
        }
      })
    },
    //  项目弹窗，项目过滤方法
    filterNode(value, formItem) {
      if (!value) return true
      return formItem.item_descript.indexOf(value) !== -1
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

