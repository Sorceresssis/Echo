import { createI18n } from 'vue-i18n'
import zhCN from './zhCN'
import en from './en'
import ja from './ja'

export const enum Locale {
    zhCN = 'zhCN',
    en = 'en',
    ja = 'ja',
}

const locale = await window.electronAPI.config('locale') || Locale.zhCN

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: locale,
    fallbackLocale: locale,
    messages: {
        zhCN,
        en,
        ja,
    }
});

export const $t = i18n.global.t
export default i18n