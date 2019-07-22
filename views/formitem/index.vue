<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.item_descript"
        placeholder="作业项目名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}
      </el-button>
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
        prop="item_id"
        sortable="custom"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.item_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目描述" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.item_descript }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目类型" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.item_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否上传图片" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.item_images_name }}</span>
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
        <el-form-item label="项目描述:" prop="item_descript">
          <el-input v-model="deviceTemp.item_descript" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="项目类型:" prop="item_type">
          <el-select
            v-model="deviceTemp.item_type"
            class="filter-item"
            value-key="cycle_id"
            placeholder="Please select"
            @change="getFormItemName"
          >
            <el-option
              v-for="item in formitemlist"
              :key="item.item_type_id"
              :label="item.display_name"
              :value="item.item_type_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片:" prop="item_images">
          <el-select
            v-model="deviceTemp.item_images"
            class="filter-item"
            value-key="cycle_id"
            placeholder="Please select"
            @change="getUploadImages"
          >
            <el-option
              v-for="item in uploadImages"
              :key="item.item_images_id"
              :label="item.display_name"
              :value="item.item_images_id"
            />
          </el-select>
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
import formiteminfo from '@/api/formitem'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const formitemlist = [
  { item_type_id: 1, display_name: 'INPUT' },
  { item_type_id: 2, display_name: 'OFF/ON' }
]
const uploadImages = [
  { item_images_id: 0, display_name: '上传图片' },
  { item_images_id: 1, display_name: '不传图片' }
]
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
        accountId: '',
        item_descript: ''
      },
      formitemlist,
      uploadImages,
      form_id_item: 0,
      getformcycle: [],
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      deviceTemp: {
        item_id: '',
        item_descript: '',
        item_type_name: '',
        item_images_name: '',
        item_type: '',
        item_images: '',
        accountId: this.account
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '作业项目编辑',
        create: '作业项目注册'
      },
      itemdialogVisible: false,
      // 定义表单验证约束
      rules: {
        item_descript: [
          { required: true, message: '项目描述不能为空!', trigger: 'blur' }
        ],
        item_type: [
          { required: true, message: '项目类型不能为空!', trigger: 'change' }
        ],
        item_images: [
          { required: true, message: '上传图片不能为空!', trigger: 'change' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {},
  mounted() {
    const _this = this
    _this.getList()
  },
  methods: {
    // 根据登陆账号查询有权限的设备类型
    getList() {
      const _this = this
      this.listLoading = true
      _this.listQuery.accountId = _this.account
      formiteminfo.getformitem(_this.listQuery).then(response => {
        _this.listdata = response.data
        _this.total = response.page
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getFormItemName(val) {
      const _this = this
      let obj = {}
      obj = _this.formitemlist.find(item => {
        return item.item_type_id === val
      })
      _this.deviceTemp.item_type_name = obj.display_name
    },
    getUploadImages(val) {
      const _this = this
      let obj = {}
      obj = _this.uploadImages.find(item => {
        return item.item_images_id === val
      })
      _this.deviceTemp.item_images_name = obj.display_name
    },
    // 重置页数，重新获取数据
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 排序事件
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'item_id') {
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
        item_id: '',
        item_descript: '',
        item_type_name: '',
        item_images_name: '',
        item_type: '',
        item_images: '',
        accountId: this.account
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
      })
    },
    //  提交新增的项目作业
    createData() {
      const _this = this
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          formiteminfo.createformitem(_this.deviceTemp).then(response => {
            const code = response.code
            // console.log(response.data)
            if (code === '1') {
              _this.deviceTemp.item_id = response.data.getid //  device_type_Id
              _this.listdata.unshift(_this.deviceTemp) // 把当前新增的数据添加到listdata里的前面
              _this.dialogFormVisible = false
              _this.$notify({
                title: '成功',
                message: '作业项目添加成功!',
                type: 'success',
                duration: 2000
              })
            } else {
              _this.$notify({
                title: '失败',
                message: '作业项目添加失败，请检查输入的内容是否符合要求!',
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
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
      console.log(_this.deviceTemp)
    },
    //  提交修改表单
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const _this = this
          const tempData = Object.assign({}, _this.deviceTemp)
          console.log(tempData)
          formiteminfo.updateFormItem(tempData).then(response => {
            console.log(response.data)
            const code = response.code
            if (code === '1') {
              for (const v of _this.listdata) {
                if (v.item_id === this.deviceTemp.item_id) {
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
    //  表单删除
    handleDelete(row) {
      this.$confirm('你确定要删除作业项目吗?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await formiteminfo.delFormItem(row.item_id).then(response => {
            const code = response.code
            if (code === '1') {
              const index = this.listdata.indexOf(row)
              this.listdata.splice(index, 1)
              this.$message({
                type: 'success',
                message: '作业项目已删除!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '作业项目删除失败，请稍后重试!'
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

