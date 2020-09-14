// 自定义指令文件

export const imageerror = {
  inserted(dom, option) {
    dom.onerror = function() {
      dom.src = option.value
    }
  }
}
