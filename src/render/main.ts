import { createApp } from 'vue'
import './assets/css/reset.css'
import App from './App.vue'
import i18n from './locales/index'

createApp(App).use(i18n).mount('#app')
