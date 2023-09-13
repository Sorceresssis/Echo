import { createI18n } from 'vue-i18n'
import { getConfig } from '@/util/ConfigUtil'
import zhCN from './zhCN'
import en from './en'
import ja from './ja'

export enum Locale {
    zhCN = 'zhCN',
    // zhTW = 'zhTW',
    en = 'en',
    ja = 'ja',
    // ko = 'ko',
    // de = 'de',
    // fr = 'fr',
    // ru = 'ru'
}

export const localeList = [
    { label: '简体中文', value: Locale.zhCN },
    // { label: '繁體中文', value: Locale.zhTW },
    { label: 'English', value: Locale.en },
    { label: '日本語', value: Locale.ja },
    // { label: '한국어', value: Locale.ko },
    // { label: 'Deutsch', value: Locale.de },
    // { label: 'Français', value: Locale.fr },
    // { label: 'Pyccĸий', value: Locale.ru },
]

const locale = await getConfig('locale') || Locale.zhCN
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

export default { $t, i18n, Locale, localeList }