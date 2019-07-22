<template>
  <div class="app-container">

    <el-tabs v-model="activeName">
      <el-tab-pane
        label="用户管理"
        name="first"
      >用户管理
        <div class="app-container">
          <el-button
            type="primary"
            @click="handleAddUser"
          >
            {{ $t('permission.addUser') }}
          </el-button>

          <el-table
            :data="userList"
            style="width: 100%;margin-top:30px;"
            border
          >
            <!-- 用户 -->
            <el-table-column
              align="center"
              :label="$t('permission.user')"
            >
              <template slot-scope="scope">
                {{ scope.row.user_id }}
              </template>
            </el-table-column>
            <!-- 用户姓名 -->
            <el-table-column
              align="center"
              :label="$t('permission.name')"
            >
              <template slot-scope="scope">
                {{ scope.row.user_name }}
              </template>
            </el-table-column>
            <!-- 角色 -->
            <el-table-column
              align="header-center"
              :label="$t('permission.roles')"
            >
              <template slot-scope="scope">
                {{ scope.row.roles }}
              </template>
            </el-table-column>
            <!-- 最后登录时间 -->
            <el-table-column
              align="header-center"
              :label="$t('permission.lastTime')"
            >
              <template slot-scope="scope">
                {{ scope.row.lasttime }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('table.operations')"
              width="220"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleEditUser(scope)"
                >
                  {{ $t('permission.edit') }}
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleDeleteUser(scope)"
                >
                  {{ $t('permission.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="角色管理"
        name="second"
      >角色管理
        <div class="app-container">
          <el-button
            type="primary"
            @click="handleAddRole"
          >
            {{ $t('permission.addRole') }}
          </el-button>

          <el-table
            :data="rolesList"
            style="width: 100%;margin-top:30px;"
            border
          >
            <!-- Role ID -->
            <el-table-column
              align="center"
              :label="$t('permission.roleKey')"
            >
              <template slot-scope="scope">
                {{ scope.row.role_id }}
              </template>
            </el-table-column>
            <!-- Role Name -->
            <el-table-column
              align="center"
              :label="$t('permission.roleName')"
            >
              <template slot-scope="scope">
                {{ scope.row.role_name }}
              </template>
            </el-table-column>
            <!-- Role Functions -->
            <el-table-column
              align="header-center"
              :label="$t('permission.functions')"
            >
              <template slot-scope="scope">
                {{ scope.row.functions }}
              </template>
            </el-table-column>
            <!-- Role Decription -->
            <el-table-column
              align="header-center"
              :label="$t('permission.description')"
            >
              <template slot-scope="scope">
                {{ scope.row.description }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('table.operations')"
              width="220"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleEdit(scope)"
                >
                  {{ $t('permission.edit') }}
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleDelete(scope)"
                >
                  {{ $t('permission.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="功能管理"
        name="third"
      >功能管理
        <div class="app-container">
          <el-button
            type="primary"
            @click="handleAddFunction"
          >
            {{ $t('permission.addFunction') }}
          </el-button>

          <el-table
            :data="functionList"
            style="width: 100%;margin-top:30px;"
            border
          >
            <!-- 功能编号 -->
            <el-table-column
              align="center"
              :label="$t('permission.functionKey')"
            >
              <template slot-scope="scope">
                {{ scope.row.function_id }}
              </template>
            </el-table-column>
            <!-- 功能代码 -->
            <el-table-column
              align="center"
              :label="$t('permission.functionCode')"
            >
              <template slot-scope="scope">
                {{ scope.row.function_code }}
              </template>
            </el-table-column>
            <!-- 功能名称 -->
            <el-table-column
              align="center"
              :label="$t('permission.functionName')"
            >
              <template slot-scope="scope">
                {{ scope.row.function_name }}
              </template>
            </el-table-column>
            <!-- 功能描述 -->
            <el-table-column
              align="center"
              :label="$t('permission.description')"
            >
              <template slot-scope="scope">
                {{ scope.row.description }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('table.operations')"
              width="220"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleEditFunction(scope)"
                >
                  {{ $t('permission.edit') }}
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleDeleteFunction(scope)"
                >
                  {{ $t('permission.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- User Dialog -->
    <el-dialog
      :visible.sync="userDialogVisible"
      :title="dialogType==='edit'?'Edit Function':'New Function'"
    >
      <el-form
        :model="role"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="UserID">
          <el-input
            v-model="user.user_id"
            placeholder="User ID"
            :disabled="readonly"
          />
        </el-form-item>
        <el-form-item label="UserName">
          <el-input
            v-model="user.user_name"
            placeholder="User Name"
          />
        </el-form-item>
        <el-form-item label="Email">
          <el-input
            v-model="user.email"
            placeholder="Email"
          />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="user.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="User Description"
          />
        </el-form-item>
        <el-form-item label="Roles">
          <el-tree
            ref="tree2"
            :check-strictly="checkStrictly"
            :data="rolesData"
            :props="userProps"
            show-checkbox
            node-key="role_name"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="userDialogVisible=false"
        >
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="confirmUser"
        >
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <!-- Role Dialog -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'Edit Role':'New Role'"
    >
      <el-form
        :model="role"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="Name">
          <el-input
            v-model="role.role_name"
            placeholder="Role Name"
            :disabled="readonly"
          />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="functionsData"
            :props="defaultProps"
            show-checkbox
            node-key="function_code"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="dialogVisible=false"
        >
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="confirmRole"
        >
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <!-- Function Dialog -->
    <el-dialog
      :visible.sync="functionDialogVisible"
      :title="dialogType==='edit'?'Edit Function':'New Function'"
    >
      <el-form
        :model="role"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="Code">
          <el-input
            v-model="func.function_code"
            placeholder="Function Code"
            :disabled="readonly"
          />
        </el-form-item>
        <el-form-item label="Name">
          <el-input
            v-model="func.function_name"
            placeholder="Function Name"
          />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="func.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="functionDialogVisible=false"
        >
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="confirmFunction"
        >
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getUsers,
  getRoles,
  getFunctions,
  addUser,
  updateUser,
  deleteUser,
  addRole,
  deleteRole,
  updateRole,
  addFunction,
  updateFunction,
  deleteFunction
} from '@/api/user'
import { deepClone } from '@/utils'
import i18n from '@/lang'

const classRole = {
  role_id: '',
  role_name: '',
  description: '',
  functions: []
}

const classUser = {
  user_id: '',
  user_name: '',
  email: '',
  description: '',
  roles: []
}

const classFunc = {
  function_id: '',
  function_code: '',
  function_name: '',
  description: ''
}

export default {
  data() {
    return {
      user: Object.assign({}, classUser), // 当前处理的user
      role: Object.assign({}, classRole), // 当前处理role
      func: Object.assign({}, classFunc), // 当前处理的functions
      routes: [],
      userList: [],
      rolesList: [],
      functionList: [],
      dialogVisible: false,
      userDialogVisible: false,
      functionDialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      userProps: {
        label: 'role_name'
      },
      defaultProps: {
        label: 'function_code'
      },
      activeName: 'first', // 默认激活的Tab
      readonly: true // 只读选项
    }
  },
  computed: {
    usersData() {
      return this.userList
    },
    rolesData() {
      return this.rolesList
    },
    functionsData() {
      return this.functionList
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    // this.getRoutes()
    this.getUsers()
    this.getRoles()
    this.getFunctions()
  },
  methods: {
    // 接口获取所有用户
    async getUsers() {
      const res = await getUsers()
      this.userList = res.data
    },
    // 接口获取所有角色
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    // 接口获取所有功能定义
    async getFunctions() {
      const res = await getFunctions()
      this.functionList = res.data
    },
    i18n(routes) {
      const app = routes.map(route => {
        route.title = i18n.t(`route.${route.title}`)
        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },

    // 增加用户
    handleAddUser() {
      this.user = Object.assign({}, classUser)

      // 设置可编辑
      this.readonly = false
      if (this.$refs.tree2) {
        // 清空选择项
        this.$refs.tree2.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.userDialogVisible = true
    },

    // 编辑用户
    handleEditUser(scope) {
      // 修改对话框类型为edit，不然就是Add
      this.dialogType = 'edit'
      // 编辑角色时角色名称不能修改，只可以修改描述和功能项
      this.readonly = true
      this.userDialogVisible = true
      this.checkStrictly = true
      this.user = deepClone(scope.row)
      this.$nextTick(() => {
        this.$refs.tree2.setCheckedKeys(this.user.roles)
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },

    // 删除用户
    handleDeleteUser({ $index, row }) {
      this.$confirm('Confirm to remove the user?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          await deleteUser(JSON.stringify(row))
          this.userList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
          this.getUsers() // 重新获取用户信息
        })
        .catch(err => {
          console.error(err)
        })
    },

    // 增加或编辑用户处理
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'
      const checkedKeys = this.$refs.tree2.getCheckedKeys()

      // 选择的项目数组赋值给user.roles
      this.user.roles = checkedKeys
      // 更新
      if (isEdit) {
        await updateUser(JSON.stringify(this.user))
      } else {
        // 新增
        await addUser(JSON.stringify(this.user))
      }

      const { description, user_id, user_name } = this.user
      this.userDialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>User ID: ${user_id}</div>
            <div>User Name: ${user_name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })

      // 重新获取Role信息
      this.getUsers()
    },
    // 增加角色
    handleAddRole() {
      this.role = Object.assign({}, classRole)

      // 设置可编辑
      this.readonly = false
      if (this.$refs.tree) {
        // 清空选择项
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑角色
    handleEdit(scope) {
      // 修改对话框类型为edit，不然就是Add
      this.dialogType = 'edit'
      // 编辑角色时角色名称不能修改，只可以修改描述和功能项
      this.readonly = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.role.functions)
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    // 删除角色
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          await deleteRole(JSON.stringify(row))
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
          this.getRoles() // 重新获取Role信息
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 增加或编辑角色处理
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      const checkedKeys = this.$refs.tree.getCheckedKeys()

      // 选择的项目数组赋值给role.functions
      this.role.functions = checkedKeys

      // 更新
      if (isEdit) {
        await updateRole(JSON.stringify(this.role))
      } else {
        // 新增
        await addRole(JSON.stringify(this.role))
      }

      const { description, role_id, role_name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role ID: ${role_id}</div>
            <div>Role Name: ${role_name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })

      // 重新获取Role信息
      this.getRoles()
    },
    // 增加功能代码
    handleAddFunction() {
      this.func = Object.assign({}, classFunc)

      // 设置可编辑
      this.readonly = false
      this.dialogType = 'new'
      this.functionDialogVisible = true
    },
    // 编辑功能代码
    handleEditFunction(scope) {
      // 修改对话框类型为edit，不然就是Add
      this.dialogType = 'edit'
      // 编辑角色时角色名称不能修改，只可以修改描述和功能项
      this.readonly = true
      this.functionDialogVisible = true
      this.checkStrictly = true
      this.func = deepClone(scope.row)
      this.checkStrictly = false
    },
    // 删除功能代码
    handleDeleteFunction({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          await deleteFunction(JSON.stringify(row))
          this.functionList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
          this.getFunctions() // 重新获取Role信息
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 增加和编辑功能代码处理
    async confirmFunction() {
      const isEdit = this.dialogType === 'edit'
      // 更新
      if (isEdit) {
        await updateFunction(JSON.stringify(this.func))
      } else {
        // 新增
        await addFunction(JSON.stringify(this.func))
      }

      const { description, function_code, function_name } = this.func
      this.functionDialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Function Code: ${function_code}</div>
            <div>Function Name: ${function_name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })

      // 重新获取Role信息
      this.getFunctions()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
