<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form ref="userInfo" label-width="120px" style="margin-left: 120px; margin-top:30px" :model="userInfo" :rules="rules">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="新密码:" prop="password2">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUserDetailById">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 放置个人详情 -->
            <!-- <component :is="userComponent" /> -->
            <userComponent />
            <!-- <user-info /> -->
          </el-tab-pane>
          <el-tab-pane label="岗位详情">
            <!-- 放置岗位详情 -->
            <!-- <component :is="JobInfo" /> -->
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 获取基本信息
import { getUserDetailById } from '@/api/user'
// 点击保存
import { saveUserDetailById } from '@/api/employees'
import userComponent from './components/user-info'
import JobInfo from './components/job-info'
export default {
  components: {
    userComponent,
    JobInfo
  },
  data() {
    return {
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不可空', trigger: 'blur' }],
        password2: [{ min: 6, max: 16, message: '密码长度要在6-16位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()// 获取基本信息
  },
  methods: {
    // 获取基本信息
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    // 点击更新保存
    async saveUserDetailById() {
      await saveUserDetailById(this.userInfo)
      // 保存成功
      this.$message.success('更新成功')
    }
  }
}
</script>

<style>

</style>
