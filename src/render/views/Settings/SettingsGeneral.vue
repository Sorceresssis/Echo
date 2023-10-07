<template>
    <div class="flex-col">
        <div class="dashboard__content scrollbar-y-w8">
            <div class="settings-item">
                <h2 class="settings-item__title">{{ $t('settings.language') }}</h2>
                <div class="settings-item__content">
                    <div class="row">
                        <el-select v-model="curLang"
                                   @change="handleLangChange">
                            <el-option v-for="lang in langOptions"
                                       :key="lang.value"
                                       :label="lang.label"
                                       :value="lang.value" />
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">{{ $t('settings.dataLocation') }}</h2>
                <div class="settings-item__content">
                    <div class="row">
                        <el-input v-model="curUserDataPath"
                                  readonly />
                        <button2 @click="selectUserDataPath">{{ $t('settings.changeDir') }}</button2>
                        <button2 @click="openInExplorer(curUserDataPath)">{{ $t('settings.openDir') }}</button2>
                    </div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">{{ $t('settings.searchEngine') }}</h2>
                <div class="settings-item__content">
                    <div class="row">
                        <el-select v-model="searchEngine"
                                   @change="setConfig('searchEngine', searchEngine)">
                            <el-option v-for="engine in engineOptions"
                                       :key="engine.id"
                                       :label="engine.label"
                                       :value="engine.value" />
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">升级</h2>
                <div class="settings-item__content">
                    <div class="row">

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import i18n, { $t, type Lang } from '@/locale'
import { openInExplorer } from '@/util/systemUtil'
import { setConfig, resetConfig, getAllConfig } from "@/util/ConfigUtil"
import MessageBox from '@/util/MessageBox'
import Button2 from '@/components/Button2.vue'

// ANCHOR locale
const langOptions: { label: string, value: Lang }[] = [
    { label: '简体中文', value: 'zhCN' },
    { label: 'English', value: 'en' },
    { label: '日本語', value: 'ja' },
    // { label: '繁體中文', value: Locale.zhTW },
    // { label: '한국어', value: Locale.ko },
    // { label: 'Deutsch', value: Locale.de },
    // { label: 'Français', value: Locale.fr },
    // { label: 'Pyccĸий', value: Locale.ru },
]
const curLang = ref<Lang>()
const handleLangChange = (value: Lang) => {
    MessageBox.confirm('切换语言', '重启后才能生效, 是否立即重启?',
        'info', '立即重启'
    ).then(() => {
        setConfig('locale', value)
        window.electronAPI.relaunch()
    }).catch(() => {
        curLang.value = i18n.global.locale.value
    })
}


// ANCHOR userDataPath
const curUserDataPath = ref<string>('')
const selectUserDataPath = () => {
    window.electronAPI.openDialog('dir', false).then(p => {
        const path = p[0]
        // 如果没有选择路径或者选择的路径和当前路径相同, 直接返回
        if (path === undefined || path === curUserDataPath.value) return Promise.reject()

        curUserDataPath.value = path
        return setConfig('userDataPath', p[0])
    }).then(() => {
        // 建议您重启应用程序以使更改生效
        return MessageBox.confirm(
            '建议重启',
            '由于数据保存位置被改变，建议您重启应用程序以加载正确的数据',
            'info', '立即重启', '取消',
            {
                closeOnClickModal: false,
                closeOnPressEscape: false,
                showCancelButton: false,
                showClose: false
            }
        )
    }).then(() => {
        window.electronAPI.relaunch()
    })
}

const searchEngine = ref<string>('google')
const engineOptions = ref<any[]>([
    { id: 1, label: 'Google', value: 'google' },
    { id: 2, label: 'Bing', value: 'bing' },
    { id: 3, label: 'Baidu', value: 'baidu' },
    { id: 4, label: 'Yahoo', value: 'yahoo' },
    { id: 5, label: 'DuckDuckGo', value: 'duckduckgo' },
    { id: 6, label: 'Yandex', value: 'yandex' },
])

const init = async function () {
    const config = await getAllConfig()

    curUserDataPath.value = config.userDataPath
    searchEngine.value = config.searchEngine
    curLang.value = config.locale as Lang
}
onMounted(init)
</script> 