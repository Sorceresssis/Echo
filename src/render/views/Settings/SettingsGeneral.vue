<template>
    <div>
        <div class="dashboard__content scrollbar-y-w8">
            <div class="settings-item">
                <h2 class="settings-item__title">语言</h2>
                <div class="settings-item__content">
                    <div class="row">
                        <el-select v-model="i18n.global.locale.value">
                            <el-option v-for="locale in localeList"
                                       :key="locale.value"
                                       :label="locale.label"
                                       :value="locale.value"
                                       @change="changeLocale(locale.value)" />
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">数据保存位置</h2>
                <div class="settings-item__content">
                    <div class="row">
                        <el-input v-model="userDataPath"
                                  readonly />
                        <button2 @click="selectUserDataPath">更改目录</button2>
                        <button2 @click="openInExplorer(userDataPath)">打开文件夹</button2>
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
                <h2 class="settings-item__title">搜索引擎</h2>
                <div class="settings-item__content">
                    <div class="row">
                        <el-select v-model="searchEngine">
                            <el-option v-for="engine in engineList"
                                       :key="engine.id"
                                       :label="engine.label"
                                       :value="engine.value"
                                       @change="" />
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
            <div>
                恢复默认设置
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { $t, i18n, localeList, changeLocale } from '@/locales'
import { openInExplorer } from '@/util/systemUtil'
import Button2 from '@/components/Button2.vue'

onMounted(async () => {
    userDataPath.value = await window.electronAPI.config('userDataPath');

})

/******************** 数据保存位置 ********************/
const userDataPath = ref<string>('')
const selectUserDataPath = () => {
    window.electronAPI.openDialog('dir', false
    ).then((p) => {
        return window.electronAPI.config('userDataPath', p[0])
    }).then((value) => {
        userDataPath.value = value
        // 建议您重启应用程序以使更改生效
        return ElMessageBox.confirm(
            "由于数据保存位置被改变，建议您重启应用程序以加载正确的数据",
            "建议重启",
            {
                confirmButtonText: "重启",
                cancelButtonText: "取消",
                type: "info",
            }
        )
    }).then(() => {
        window.electronAPI.relaunch()
    })
}

const searchEngine = ref<string>('google')
const engineList = ref<any[]>([
    { id: 1, label: 'Google', value: 'google' },

])
// BUG 在数据库查询的过程中，如果点击设置，会导致一直在加载
</script> 