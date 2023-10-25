import { createApp } from 'vue'
import App from './App.vue'
/* css */
import '@/assets/css/reset.css'
import '@/assets/css/global.css'
import '@/assets/css/recordcard.css'
import '@/assets/css/elementplus.css'
import '@/assets/font/iconfont.css'

import i18n from '@/locale'
import { createPinia } from 'pinia'
import router from '@/record/router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 右键菜单
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

// vue 图片预览
import "viewerjs/dist/viewer.css"
import VueViewer from 'v-viewer'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(ElementPlus)
app.use(createPinia())
app.use(ContextMenu)
app.use(VueViewer)
app.mount('#app')