import { createApp } from 'vue'
import App from '../views/App.vue'
/* css */
import '../assets/css/reset.css'
import '../assets/css/global.css'
import '../assets/css/elementplus.css'
import '../assets/css/recordcard.css'
import '../assets/font/iconfont.css'
import 'element-plus/dist/index.css'

import router from '../router/index'
import locales from '@/locales/index'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
// 右键菜单
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'


const app = createApp(App)
app.use(router)
app.use(locales.i18n)
app.use(ElementPlus)
app.use(createPinia())
app.use(ContextMenu)
app.mount('#app')