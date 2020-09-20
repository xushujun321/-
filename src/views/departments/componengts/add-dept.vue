<template>
  <el-dialog title="新增部门" :visible="showDialog" @close="btnCancel">
    <el-row type="flex" justify="center" align="middle">
      <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" placeholder="1-50个字符" style="width:400px" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" placeholder="1-50个字符" style="width:400px" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="formData.manager" style="width: 80%" placeholder="请选择" @focus="getEmployeeSimple">
            <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="formData.introduce" placeholder="1-300个字符" style="width:400px" />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center" align="middle" style="height:80px">
            <el-button size="small" type="primary" @click="btnOk">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail } from '@/api/departments'
// 获取员工列表，负责人
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      const isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      const isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      // 定义表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' }, {
            trigger: 'blur',
            validator: checkNameRepeat // 自定义函数的形式校验
          }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }, {
            trigger: 'blur',
            validator: checkCodeRepeat
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      // 负责人的下拉列表
      peoples: []
    }
  },
  methods: {
    // 获取员工信息
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 点击确定
    btnOk() {
      // 表单提交，进行整体校验，需要给el-form给一个ref即可，然后用validate（）
      this.$refs.deptForm.validate(async isValidate => {
        // 是否校验通过
        if (isValidate) {
          // 如果该值为true 表示校验通过
          // 注意：增加部门的参数处理formData之外还需要pid，所以需要进行组合
          const addData = { ...this.formData, pid: this.treeNode.id ? this.treeNode.id : '' }
          await addDepartments(addData) // 调用新增部门方法
          // 告诉父组件，重新加载数据
          this.$emit('addDepts')
          this.$emit('update:showDialog', false)
          this.$message.success('添加成功')
        }
      })
    },
    // 点击取消按钮
    btnCancel() {
      // 数据清空
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 负责人
        introduce: '' // 介绍
      }
      // 清除校验
      this.$refs.deptForm.resetFields()
      // 关闭弹出框
      this.$emit('update:showDialog', false)
    },
    // 获取部门详情
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style>

</style>
