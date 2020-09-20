<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <tree-tools :tree-node="company" :is-root="true" @addpets="addpets" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" @delet="delet" @addpets="addpets" @editpets="editpets" />
        </el-tree>
      </el-card>
      <addDeot ref="addparts" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="addpart" />
    </div>
  </div>
</template>

<script>
import treeTools from './componengts/tree-tools'
import addDeot from './componengts/add-dept'

import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils/index'
export default {
  components: {
    treeTools,
    addDeot
  },
  data() {
    return {
      defaultProps: {
        lable: 'name'
      },
      company: {
      },
      departs: [],
      showDialog: false,
      node: null,
      loading: false
    }
  },
  created() {
    this.getDepartments()// 获取部门列表
  },
  methods: {
    // 获取部门列表
    async getDepartments() {
      this.loading = true
      const res = await getDepartments()
      // console.log(res)
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = transListToTreeData(res.depts, '')
      this.loading = false
    },
    delet() {
      // 删除成功，进行刷新数据
      this.getDepartments()
    },
    // 点击添加按钮
    addpets(node) {
      // 打开弹片
      this.showDialog = true
      this.node = node
      // console.log(this.node)
    },
    // 新增部门后，重新刷新
    addpart() {
      this.getDepartments()
    },
    // 编辑部门
    editpets(node) {
      // 打开弹片
      this.showDialog = true
      this.$refs.addparts.getDepartDetail(node.id)
    }
  }
}
</script>

<style>
.el-dropdown-link {
    cursor: pointer;
    /* color: #409EFF; */
  }
  .el-icon-arrow-down {
    font-size: 16px;
  }
</style>
