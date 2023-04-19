import { createI18n } from 'vue-i18n';
import zhCN from './zhCN';
import enUS from './enUS';

const locale = (await window.electronAPI.config('lang')).locale || 'enUS'
const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: locale,
    fallbackLocale: locale,
    messages: {
        zhCN,
        enUS,
    }
});

export default i18n