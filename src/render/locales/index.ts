import { createI18n } from 'vue-i18n'
import zhCN from './zhCN'
import en from './en'
import ja from './ja'

export enum Locale {
    zhCN = 'zhCN',
    zhTW = 'zhTW',
    en = 'en',
    ja = 'ja',
    ko = 'ko',
    de = 'de',
    fr = 'fr',
    ru = 'ru'
}

export const localeList = [
    { label: '简体中文', value: Locale.zhCN },
    { label: '繁體中文', value: Locale.zhTW },
    { label: 'English', value: Locale.en },
    { label: '日本語', value: Locale.ja },
    { label: '한국어', value: Locale.ko },
    { label: 'Deutsch', value: Locale.de },
    { label: 'Français', value: Locale.fr },
    { label: 'Pyccĸий', value: Locale.ru },
]

// 切换语言
export const changeLocale = async (locale: Locale) => {
    // 写入配置文件
    await window.electronAPI.config('locale', locale)
    // 切换语言
    i18n.global.locale.value = locale
}

const locale = await window.electronAPI.config('locale') || Locale.zhCN
export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: locale,
    fallbackLocale: locale,
    messages: {
        zhCN,
        en,
        ja,
    }
})

export const $t = i18n.global.t

export default { $t, i18n, Locale, localeList, changeLocale }