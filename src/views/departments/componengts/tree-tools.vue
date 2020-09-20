<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">
    <el-col>
      <!-- 名称应该变成 对应的节点中的name -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown" @command="handleCommand">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  // props可以用数组来接收数据 也可以用对象来接收
  // props: {   props属性: {  配置选项 }  }
  props: {
    //   定义一个props属性
    treeNode: {
      required: true, // 设置当前数据为必填
      type: Object // 类型是Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 通过判断common的类型来处理增删改时间
    handleCommand(type) {
      if (type === 'add') {
        // 添加部门
        this.$emit('addpets', this.treeNode)
      } else if (type === 'edit') {
        // 编辑部门
        this.$emit('editpets', this.treeNode)
      } else {
        // 删除部门
        this.$confirm('确定要删除吗').then(async() => {
          return await delDepartments(this.treeNode.id)
        }).then(() => {
          // 删除成功
          this.$message.success('删除成功')
          this.$emit('delet')
        })
      }
    }
  }
}
</script>

<style>

</style>
