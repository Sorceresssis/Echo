import { createI18n } from 'vue-i18n';
import zhCN from './zh-cn';
import en from './en';
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        zhCN,
        en
    }
});
export default i18n