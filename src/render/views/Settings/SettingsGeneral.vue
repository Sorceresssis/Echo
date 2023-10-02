<template>
    <div class="flex-col">
        <div class="dashboard__content scrollbar-y-w8">
            <div class="settings-item">
                <h2 class="settings-item__title">{{ $t('settings.language') }}</h2>
                <div class="settings-item__content">
                    <div class="row">
                        <el-select v-model="i18n.global.locale.value"
                                   @change="setConfig('locale', toRaw(i18n.global.locale.value))">
                            <el-option v-for="locale in localeList"
                                       :key="locale.value"
                                       :label="locale.label"
                                       :value="locale.value" />
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">{{ $t('settings.dataLocation') }}</h2>
                <div class="settings-item__content">
                    <div class="row">
                        <el-input v-model="userDataPath"
                                  readonly />
                        <button2 @click="selectUserDataPath">{{ $t('settings.changeDir') }}</button2>
                        <button2 @click="openInExplorer(userDataPath)">{{ $t('settings.openDir') }}</button2>
                    </div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">{{ $t('settings.searchEngine') }}</h2>
                <div class="settings-item__content">
                    <div class="row">
                        <el-select v-model="searchEngine"
                                   @change="setConfig('searchEngine', searchEngine)">
                            <el-option v-for="engine in engineList"
                                       :key="engine.id"
                                       :label="engine.label"
                                       :value="engine.value" />
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">数据</h2>
                <div class="settings-item__content">
                    <div class="row">
                        <!-- 导入成功刷新 -->
                        <button2 @click="">导出数据</button2>
                        <button2 @click="">导入数据</button2>
                    </div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title"> 恢复默认设置</h2>
                <div class="settings-item__content">
                    <div class="row">
                        <button2 @click="handleResetConfig">恢复默认设置</button2>
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
import { ref, onMounted, toRaw } from 'vue'
import { ElMessageBox } from 'element-plus'
import { $t, i18n, localeList, Locale } from '@/locale'
import { openInExplorer } from '@/util/systemUtil'
import { setConfig, resetConfig, getAllConfig } from "@/util/ConfigUtil"
import Button2 from '@/components/Button2.vue'

/******************** 数据保存位置 ********************/
const userDataPath = ref<string>('')
const selectUserDataPath = () => {
    window.electronAPI.openDialog('dir', false
    ).then((p) => {
        const path = p[0]
        if (path === undefined || path === userDataPath.value) return Promise.reject()
        return setConfig('userDataPath', p[0])
    }).then((value) => {
        userDataPath.value = value || userDataPath.value
        // 建议您重启应用程序以使更改生效
        return ElMessageBox.confirm(
            "由于数据保存位置被改变，建议您重启应用程序以加载正确的数据",
            "建议重启",
            {
                confirmButtonText: "重启",
                cancelButtonText: "取消",
                type: "info",
            })
    }).then(() => {
        window.electronAPI.relaunch()
    })
}

const searchEngine = ref<string>('google')
const engineList = ref<any[]>([
    { id: 1, label: 'Google', value: 'google' },
    { id: 2, label: 'Bing', value: 'bing' },
    { id: 3, label: 'Baidu', value: 'baidu' },
    { id: 4, label: 'Yahoo', value: 'yahoo' },
    { id: 5, label: 'DuckDuckGo', value: 'duckduckgo' },
    { id: 6, label: 'Yandex', value: 'yandex' },
])

const handleResetConfig = async function () {
    await resetConfig()
    init()
}

const init = async function () {
    const config = await getAllConfig()
    userDataPath.value = config.userDataPath
    searchEngine.value = config.searchEngine
    i18n.global.locale.value = config.locale as Locale
}
onMounted(init)
</script> 