import { createI18n } from 'vue-i18n'
import zhCN from './zhCN'
import enUS from './enUS'
import jaJP from './jaJP'


// let locale = (window.electronAPI.config('lang')).locale || 'enUS'
let locale
window.electronAPI.config('lang').then((res) => {
    locale = res.locale || 'enUS'
})

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: locale,
    fallbackLocale: locale,
    messages: {
        zhCN,
        enUS,
        jaJP,
    }
});

export const t = i18n.global.t
export default i18n