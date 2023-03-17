import { createApp } from 'vue'
import App from './App.vue'
// css重置
import './assets/css/reset.css'
// iconfont
import './assets/css/font.css'
// 国际化
import i18n from './locales/index'
// elementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'



const app = createApp(App)
app.use(i18n)
app.use(ElementPlus)
app.use(ContextMenu)
app.mount('#app')
