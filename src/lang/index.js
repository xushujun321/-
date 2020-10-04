import Vue from 'vue'// 引进vue
import VueI18n from 'vue-i18n'// 引进多语言包
import Cookie from 'js-cookie'// 引进存储cookie
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包

Vue.use(VueI18n)
export default new VueI18n({
  locale: Cookie.get('language') || 'zh', // 从cookie中获取语言类型 获取不到就是中文 elementZH
  messages: {
    en: {
      ...elementEN,
      ...customEN
    },
    zh: {
      ...elementZH,
      ...customZH
    }
  }
})
