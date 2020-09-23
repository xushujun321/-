<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共166条记录</span>
        <template slot="after">
          <el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary" @click="add">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column align="center" header-align="center" label="序号" sortable="" type="index" />
          <el-table-column align="center" header-align="center" label="姓名" sortable="" prop="username" />
          <el-table-column align="center" header-align="center" label="头像">
            <template slot-scope="{row}">
              <img v-imageerror="require('@/assets/common/bigUserHeader.png')" :src="row.staffPhoto ? row.staffPhoto : require('@/assets/common/bigUserHeader.png') " style="border-radius: 50%; width: 100px; height: 100px; padding: 10px" alt="">
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" label="工号" sortable="" prop="workNumber" />
          <el-table-column align="center" header-align="center" label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column align="center" header-align="center" label="部门" sortable="" prop="departmentName" />
          <el-table-column align="center" header-align="center" label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{ row }">
              {{
                row.timeOfEntry | formatDate
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <AddDemployee :show-dialog.sync="showDialog" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddDemployee from './components/add-employee'
export default {
  components: {
    AddDemployee
  },
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      showDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // 聘用形式的格式化
    formatEmployment(row, column, cellvalue, index) {
      var list = EmployeeEnum.hireType
      const obj = list.find(item => item.id === cellvalue)
      return obj ? obj.value : '未知'
    },
    // 删除功能
    async deleteEmployee(id) {
      try {
        await this.$confirm('确定要删除吗')
        await delEmployee(id)
        // 删除成功
        this.$message.success('删除成功')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    // 新增按钮
    add() {
      this.showDialog = true
    }
  }
}
</script>

<style>

</style>
