<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first">
            <el-row type="flex" justify="left" align="middle" style="height:80px">
              <el-button type="primary" size="small" @click="addRole">新增角色</el-button>
            </el-row>
            <el-row type="flex" justify="center" align="middle">
              <el-table
                :data="tableData"
                border
                style="width: 100%"
              >
                <el-table-column
                  header-align="center"
                  align="center"
                  type="index"
                  label="序号"
                  width="80"
                />
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="name"
                  label="角色名称"
                />
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="description"
                  label="描述"
                  width="300"
                />
                <el-table-column
                  header-align="center"
                  align="center"
                  label="操作"
                  fixed="right"
                >
                  <template slot-scope="{ row }">
                    <el-button size="small" type="success" @click="getPermissionList(row.id)">分配权限</el-button>
                    <el-button size="small" type="primary" @click="getRoleDetail(row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <el-row type="flex" justify="center" align="middle" style="height:80px">
              <el-pagination
                :page-size="page.pagesize"
                :current-page="page.page"
                layout="prev, pager, next"
                :total="page.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="second">
            <el-row type="flex" justify="left" align="middle" style="height:60px">
              <el-alert
                title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
                type="info"
                show-icon
                :closable="false"
              />
            </el-row>
            <el-row type="flex" justify="left" align="middle" style="height:300px">
              <el-form label-width="120px">
                <el-form-item label="公司名称">
                  <el-input v-model="formData.name" :disabled="true" style="width:500px" />
                </el-form-item>
                <el-form-item label="公司地址">
                  <el-input v-model="formData.companyAddress" :disabled="true" style="width:500px" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="formData.mailbox" :disabled="true" style="width:500px" />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="formData.remarks" :disabled="true" style="width:500px" type="textarea" :rows="3" />
                </el-form-item>
              </el-form>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 新增角色与编辑角色的弹层:title="`${txt}角色`" -->
      <el-dialog :title="`${txt}角色`" :visible="showDialog" @close="btnCancon">
        <el-row>
          <el-form ref="newRole" label-width="120px" :rules="rules" :model="newRole">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="newRole.name" style="width:500px" />
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
              <el-input v-model="newRole.description" style="width:500px" />
            </el-form-item>
          </el-form>
        </el-row>
        <el-row type="flex" justify="center" align="middle" style="height:60px">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancon">取消</el-button>
        </el-row>
      </el-dialog>
      <!-- 为角色分配权限弹框 -->
      <el-dialog :title="`为${permData.name}分配权限`" :visible="showPermDialog" @close="btnPermCancel">
        <!-- 放置一个组件 来显示 权限的树形结构 el-tree  el-table -->
        <el-tree
          ref="permTree"
          :data="permData"
          :props="defaultProps"
          default-expand-all=""
          show-checkbox
          node-key="id"
          :default-checked-keys="selectCheck"
          :check-strictly="true"
        />
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnPermCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnPermOK">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
// 在vuex的时候将companyId存储在getters
import { mapGetters } from 'vuex'
import { transListToTreeData } from '@/utils'
// 获取所有权限
import { getPermissionList, assignPerm } from '@/api/permission'
export default {
  data() {
    return {
      activeName: 'first',
      tableData: [],
      page: {
        page: 1,
        pagesize: 5,
        total: 0
      },
      formData: [], // 公司的信息
      showDialog: false, // 弹层显示与隐藏
      newRole: {}, // 弹片角色数据
      rules: {
        name: [{ required: true, message: '角色名称必填' }]
      }, // 校验规则
      showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    txt() {
      return this.newRole.id ? '编辑' : '添加'
    }
  },
  created() {
    this.getRoleList()// 获取角色列表
    this.getCompanyInfo()// 获取公司信息
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleList(this.page)
      this.tableData = res.rows
      this.page.total = res.total
    },
    // 分页组件的切换页面
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    // 获取公司信息
    async  getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
      // console.log(res)
    },
    // 删除角色
    async deleteRole(id) {
      this.$confirm('您是否确定要删除该角色吗').then(() => {
        return deleteRole(id)
      }).then(() => {
        this.$message.success('删除成功')
        this.getRoleList()
      })
    },
    // 新增角色
    async addRole() {
      // 打开弹片
      this.showDialog = true
    },
    // 弹片的取消按钮
    btnCancon() {
      // 清除数据
      this.newRole = {}
      // 清除校验
      this.$refs.newRole.resetFields()
      // 关闭弹层
      this.showDialog = false
      this.getRoleList()
    },
    // 编辑,获取角色详情
    async getRoleDetail(id) {
      this.newRole = await getRoleDetail(id)
      this.showDialog = true
    },
    // 点击弹片的确定按钮
    btnOK() {
      this.$refs.newRole.validate(async isOK => {
        if (isOK) {
          if (this.newRole.id) {
            // 有id，是编辑功能
            await updateRole(this.newRole)
          } else {
            // 没id，就是新增功能
            await addRole(this.newRole)
          }
          // this.showDialog = false
          // 请求成功
          this.$message.success('操作成功')
          this.btnCancon()
          // this.getRoleList()
        }
      })
    },
    // 点击分配权限
    async getPermissionList(id) {
      this.roleId = id
      // 获取所有权限
      this.permData = transListToTreeData(await getPermissionList(), '0')
      // 获取角色的id
      const { permIds } = await getRoleDetail(id) // permIds就是角色所拥有的权限的点
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    // 分配权限的取消按钮
    btnPermCancel() {
      // 清除数据
      this.permData = []
      // 关闭弹层
      this.showPermDialog = false
    },
    // 分配权限的确定按钮
    async btnPermOK() {
      await assignPerm({ id: this.roleId, permIds: this.$refs.permTree.getCheckedKeys() })
      this.$message.success('分配成功')
      this.showPermDialog = false
    }
  }

}
</script>

<style>

</style>
