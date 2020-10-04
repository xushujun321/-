<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- 放置一个SVG的图标 -->
    <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  methods: {
  // 改变全屏
    changeScreen() {
      if (!ScreenFull.isEnabled) {
        // 此时全屏功能不能使用
        this.$message.warning('此时全屏功能不能使用')
        return
      } else {
        ScreenFull.toggle()
      }
    }
  }
}
</script>

<style>

</style>
