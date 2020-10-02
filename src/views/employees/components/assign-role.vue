<template>
  <el-dialog title="分配角色" :visible="showDialog" @close="btnCanlon">
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <!-- <el-col :span="6"> -->
      <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      <el-button size="small" @click="btnCanlon">取消</el-button>
      <!-- </el-col> -->
    </el-row>
  </el-dialog>
</template>

<script>
// 获取角色列表
import { getRoleList } from '@/api/setting'
// 通过获取基本信息获取角色详情，
import { getUserDetailById } from '@/api/user'
// 给员工分配角色
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      checkList: [],
      list: [],
      page: {
        page: 1,
        pagesize: 10
      }
    }
  },
  created() {
    this.getRoleList()// 获取角色列表
  },
  methods: {
    // 取消按钮的点击事件
    btnCanlon() {
      // 清空数据
      this.checkList = []
      // 关闭弹层
      this.$emit('update:showDialog', false)
    },
    // 获取角色列表
    async getRoleList() {
      const { rows } = await getRoleList(this.page)
      this.list = rows
    },
    // 获取角色详情
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.checkList = roleIds
    },
    // 点击确定
    async btnOK() {
      // 给角色分配角色
      await assignRoles({ roleIds: this.checkList, id: this.userId })
      // 关闭弹层
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>

</style>
