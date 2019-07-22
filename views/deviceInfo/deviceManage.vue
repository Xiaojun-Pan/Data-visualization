<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.deviceCode"
        placeholder="设备编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.deviceTypeName"
        placeholder="设备类型"
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
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ $t('table.export') }}</el-button>
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
        label="设备编号"
        prop="device_serial_number"
        sortable="custom"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.device_serial_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" width="135px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修部门" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.repair_depart_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备位置" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device_location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备状态" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device_dtatus }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        class-name="small-padding fixed-width"
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
        <el-form-item label="设备编号:" :prop="serial_number_check">
          <el-input v-model="deviceTemp.device_serial_number" :disabled="serialNumberDisabled" />
        </el-form-item>
        <el-form-item label="设备名称:" prop="device_name">
          <el-input v-model="deviceTemp.device_name" />
        </el-form-item>
        <el-form-item label="设备类型:" prop="device_type_Id">
          <el-select
            v-model="deviceTemp.device_type_Id"
            class="filter-item"
            value-key="device_type_Id"
            placeholder="Please select"
            @change="deviceTypeValue"
          >
            <el-option
              v-for="item in getDeviceTypeList"
              :key="item.device_type_Id"
              :label="item.device_name"
              :value="item.device_type_Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备位置:" prop="device_location">
          <el-input v-model="deviceTemp.device_location" />
        </el-form-item>
        <el-form-item label="点检时间:">
          <el-date-picker
            v-model="deviceTemp.device_latest_time"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <el-form-item label="设备状态:" prop="device_dtatus">
          <el-select
            v-model="deviceTemp.device_dtatus"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in DeviceState"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="维修部门:" prop="repair_depart">
          <el-select
            v-model="deviceTemp.repair_depart"
            class="filter-item"
            placeholder="Please select"
            @change="repairDepaValue"
          >
            <el-option
              v-for="item in getDepartmentList"
              :key="item.user_dapa_id"
              :label="item.user_dapa_name"
              :value="item.user_dapa_id"
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

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validateSerialNumber } from '@/utils/validate'
import deviceInfo from '@/api/deviceInfo'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

//  验证device_serial_number格式是否是6位的数字，并且在系统中不device_serial_number存在。

const validate_SerialNumber = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('设备的编号不能为空!'))
  } else {
    if (validateSerialNumber(value)) {
      deviceInfo.getSerialNumber(value).then(response => {
        if (response.code === '1') {
          callback()
        } else {
          return callback(new Error('你输入的设备编号系统中已存在！'))
        }
      })
    } else {
      return callback(new Error('设备编号格式不正确，请输入6位数字!'))
    }
  }
}

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]
const DeviceState = [
  { key: '正常', display_name: '正常' },
  { key: '停用', display_name: '停用' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      listdata: [],
      total: 0,
      listLoading: true,
      account: this.$store.state.user.name,
      serial_number_check: '',
      serialNumberDisabled: false,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        accountId: '',
        deviceCode: '',
        deviceTypeName: ''
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      DeviceState,
      getDeviceTypeList: [],
      getDepartmentList: [],
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      deviceTemp: {
        device_Id: '',
        device_code: '',
        device_description: '',
        device_dtatus: '',
        device_expire_date: '',
        device_issue_date: '',
        device_latest_time: new Date(),
        device_location: '',
        device_name: '',
        device_serial_number: '',
        device_type_Id: '',
        device_type_name: '',
        repair_depart: '',
        repair_depart_name: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '设备信息编辑',
        create: '设备信息注册'
      },
      dialogPvVisible: false,
      pvData: [],
      //  定义表单验证约束
      rules: {
        device_serial_number: [
          { required: true, validator: validate_SerialNumber, trigger: 'blur' }
        ],
        device_type_Id: [
          { required: true, message: '设备的类型不能为空!', trigger: 'change' }
        ],
        device_location: [
          { required: true, message: '设备的位置不能为空!', trigger: 'blur' }
        ],
        device_dtatus: [
          { required: true, message: '设备的状态不能为空!', trigger: 'change' }
        ],
        repair_depart: [
          {
            required: true,
            message: '设备的维修部门不能为空!',
            trigger: 'change'
          }
        ],
        device_name: [
          { required: true, message: '设备的名称不能为空!', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    const _this = this
    _this.getDepartmentInfo()
    _this.getDeviceTypeInfo()
  },
  mounted() {
    const _this = this
    _this.getList()
  },
  methods: {
    getList() {
      const _this = this
      _this.listQuery.accountId = _this.account
      this.listLoading = true
      deviceInfo.getDevicecInfo(_this.listQuery).then(response => {
        _this.listdata = response.data
        _this.total = response.page
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    deviceTypeValue(val) {
      const _this = this
      let obj = {}
      obj = _this.getDeviceTypeList.find(item => {
        return item.device_type_Id === val
      })
      _this.deviceTemp.device_type_name = obj.device_name
    },
    repairDepaValue(val) {
      const _this = this
      let obj = {}
      obj = _this.getDepartmentList.find(item => {
        return item.user_dapa_id === val
      })
      _this.deviceTemp.repair_depart_name = obj.user_dapa_name
    },
    getDeviceTypeInfo() {
      deviceInfo.getDeviceTypeInfo().then(response => {
        const _this = this
        _this.getDeviceTypeList = response.data
      })
    },
    getDepartmentInfo() {
      deviceInfo.getDepartmentInfo().then(response => {
        const _this = this
        _this.getDepartmentList = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // handleModifyStatus(row, status) {
    //   this.$message({
    //     message: '操作成功',
    //     type: 'success'
    //   })
    //   row.status = status
    // },
    sortChange(data) {
      //  排序事件
      const { prop, order } = data
      if (prop === 'device_serial_number') {
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
    resetTemp() {
      this.deviceTemp = {
        device_Id: '',
        device_code: '',
        device_description: '',
        device_dtatus: '',
        device_expire_date: '',
        device_issue_date: '',
        device_latest_time: new Date(),
        device_location: '',
        device_name: '',
        device_serial_number: '',
        device_type_Id: '',
        device_type_name: '',
        repair_depart: '',
        repair_depart_name: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.serialNumberDisabled = false
      this.dialogFormVisible = true
      this.serial_number_check = 'device_serial_number'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      const _this = this
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          deviceInfo.createDeviceInfo(_this.deviceTemp).then(response => {
            const code = response.code
            if (code === '1') {
              _this.listdata.unshift(_this.deviceTemp) // 把当前新增的数据添加到listdata里的前面
              _this.dialogFormVisible = false
              _this.$notify({
                title: '成功',
                message: '设备注册成功!',
                type: 'success',
                duration: 2000
              })
            } else {
              _this.$notify({
                title: '失败',
                message: '设备注册失败，请检查输输入的内容是否符合要求!',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.deviceTemp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.deviceTemp.device_latest_time)
      this.serial_number_check = ''
      this.dialogStatus = 'update'
      this.serialNumberDisabled = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const _this = this
          const tempData = Object.assign({}, _this.deviceTemp)
          console.log(_this.deviceTemp)
          deviceInfo.updateDeviceInfo(tempData).then(response => {
            const code = response.code
            if (code === '1') {
              for (const v of _this.listdata) {
                if (v.device_Id === this.deviceTemp.device_Id) {
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
    handleDelete(row) {
      this.$confirm('你确定要删除这个设备吗?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deviceInfo.deleteDeviceInfo(row.device_serial_number).then(response => {
            const code = response.code
            if (code === '1') {
              const index = this.listdata.indexOf(row)
              this.listdata.splice(index, 1)
              this.$message({
                type: 'success',
                message: '设备信息删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '设备信息删除失败!'
              })
            }
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    // handleFetchPv(pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData;
    //     this.dialogPvVisible = true;
    //   })
    // },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '设备编号',
          '设备名称',
          '设备类型',
          '设备位置',
          '最近点检时间',
          '设备状态',
          '维修部门'
        ]
        const filterVal = [
          'device_serial_number',
          'device_name',
          'device_type_name',
          'device_location',
          'device_latest_time',
          'device_dtatus',
          'repair_depart_name'
        ]
        const data = this.formatJson(filterVal, this.listdata)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'deviceInfoExport'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
