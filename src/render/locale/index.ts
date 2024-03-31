import { createI18n } from 'vue-i18n'
import { getConfig } from '@/util/ConfigUtil'
import zhCN from './lang/zhCN'
import en from './lang/en'
import ja from './lang/ja'
import zhTW from './lang/zhTW'
// @ts-ignore
import el_zhCN from 'element-plus/dist/locale/zh-cn.mjs'
// @ts-ignore
import el_en from 'element-plus/dist/locale/en.mjs'
// @ts-ignore
import el_ja from 'element-plus/dist/locale/ja.mjs'
// @ts-ignore
import el_zhTW from 'element-plus/dist/locale/zh-tw.mjs'


//  | 'ko' | 'de' | 'fr' | 'ru'
export type Lang = 'zhCN' | 'en' | 'ja' | 'zhTW'

const lang: Lang = await getConfig('locale') as Lang || 'zhCN'

export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: lang,
    fallbackLocale: lang,
    messages: {
        zhCN,
        en,
        ja,
        zhTW
    },
    warnHtmlInMessage: false
})

export const getElLang = () => {
    switch (lang) {
        case 'zhCN':
            return el_zhCN
        case 'en':
            return el_en
        case 'ja':
            return el_ja
        case 'zhTW':
            return el_zhTW
        default:
            return el_zhCN
    }
}

export const $t = i18n.global.t

export default i18n