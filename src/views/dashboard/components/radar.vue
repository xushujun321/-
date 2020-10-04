<template>
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入 雷达图模块
require('echarts/lib/chart/radar')
export default {
  mounted() {
  // 初始化
    this.inChart()
  },
  methods: {
    inChart() {
    // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(this.$refs.myDiv)
      // 数据
      this.setOption()
    },
    setOption() {
      this.myChart.setOption({
        title: {
          text: '基础雷达图'
        },
        tooltip: {},
        legend: {
          data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
        },
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: [
            { name: '销售', max: 6500 },
            { name: '管理', max: 16000 },
            { name: '信息技术', max: 30000 },
            { name: '客服', max: 38000 },
            { name: '研发', max: 52000 },
            { name: '市场', max: 25000 }
          ]
        },
        series: [{
          name: '优秀 vs 自己',
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: [4300, 10000, 28000, 35000, 50000, 19000],
              name: '优秀'
            },
            {
              value: [5000, 14000, 28000, 31000, 42000, 21000],
              name: '自己'
            }
          ]
        }]
      })
    }
  }
}
</script>

<style scoped>
.radar-echart {
  width: 600px;
  height: 400px;
}
</style>
