import { createApp } from 'vue'
// css重置
import './assets/css/reset.css'
// iconfont
import './assets/css/font.css'
// 国际化
import i18n from './locales/index'
// elementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'

const app = createApp(App)
app.use(i18n)
app.use(ElementPlus)
app.mount('#app')
