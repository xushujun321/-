<template>
  <div>
    <page-tools>
      <template slot="after">
        <!-- 往根上添加根元素，此时type为1，pid为0是固定的addPermission(1, 0) -->
        <el-button type="primary" @click="addPermission(1, '0')">添加权限模块</el-button>
      </template>
    </page-tools>
    <el-card>
      <el-table :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="addPermission(2,row.id )">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹层 -->
    <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="formData" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, getPermissionDetail, delPermission, updatePermission, addPermission } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()// 获取权限
  },
  methods: {
    // 获取所有权限
    async getPermissionList() {
      this.list = transListToTreeData(await getPermissionList(), '0')
    },
    // 取消按钮
    btnCancel() {
      // 清除数据
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      // 清除校验
      this.$refs.formData.resetFields()
      // 关闭弹层
      this.showDialog = false
    },
    // 添加按钮
    addPermission(type, id) {
      // 显示弹层
      this.showDialog = true
      this.formData.pid = id
      this.formData.type = type
    },
    // 编辑按钮
    async editPermission(id) {
      // 打开弹层
      this.showDialog = true
      // 获取数据
      this.formData = await getPermissionDetail(id)
    },
    // 删除按钮
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除吗')
        await delPermission(id)
        // 删除成功
        this.$message.success('删除成功')
        // 重新刷新
        this.getPermissionList()
      } catch (error) {
        console.log(error)
      }
    },
    // 弹层的确定按钮
    async  btnOK() {
      try {
        await this.$refs.formData.validate() // 重置字段
        this.formData.id ? await updatePermission(this.formData) : await addPermission(this.formData)
        this.$message.success('操作成功')
        this.getPermissionList() // 重新拉取数据
        this.btnCancel()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
