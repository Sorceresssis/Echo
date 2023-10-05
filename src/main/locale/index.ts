import { createI18n } from 'vue-i18n'
import appConfig from '../app/config'
import zhCN from './lang/zhCN'
import en from './lang/en'
import ja from './lang/ja'


export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: appConfig.get('locale'),
    fallbackLocale: appConfig.get('locale'),
    messages: {
        zhCN,
        en,
        ja,
    }
})


export default i18n