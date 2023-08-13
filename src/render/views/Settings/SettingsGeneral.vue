<template>
    <div class="dashboard__content flex-col scrollbar-y-w8">
        <div class="setting-item">
            <div class="setting-item__title">{{ $t('settings.lang') }}</div>
            <div class="setting-item__content">
                <el-dropdown trigger="click"
                             popper-class="dropdown">
                    <span>
                        {{ currentLang.label }}
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="lang in langList"
                                              @click="changelang(lang)"
                                              class="langSelect">
                                {{ lang.label }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="setting-item">
            <div class="setting-item__title">保存位置</div>
            <div class="setting-item__content">
                <input type="text"
                       readonly
                       class="setting-input"
                       v-model="dataSavePath">
                <button @click=""
                        class="button"><span> 更改目录</span></button>
            </div>
        </div>
        <div class="setting-item">
            <div class="setting-item__title">数据的导入导出</div>
            <div class="setting-item__content">
                <button class="button">导出</button>
                开始导入qu
            </div>
        </div>
        <div class="setting-item">
            <div class="setting-item__title">文件映射</div>
            <div class="setting-item__content">
                <p class="dot">aaa</p>
                <p class="no-dot">aaa</p>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'

onMounted(async () => {
    currentLang.value = await window.electronAPI.config('lang') || langList[0]
    dataSavePath.value = await window.electronAPI.config('userDataPath');
})


/******************** 语言切换 ********************/
type lang = {
    label: string,
    locale: string
}
const langList = ([
    { label: '简体中文', locale: 'zhCN' },
    { label: 'English', locale: 'enUS' },
    { label: '日本語', locale: 'jaJP' },
    { label: '繁體中文', locale: 'zhTW' },
    { label: '한국어', locale: 'koKR' },
    { label: 'Deutsch', locale: 'de' },
    { label: 'Français', locale: 'fr' },
    { label: 'Pyccĸий', locale: 'ru' }
])
const currentLang = ref<lang>(langList[0])
const changelang = async (lang: lang) => {
    if (lang.locale === currentLang.value.locale) return
    // 切换语言要用户确认重启
    ElMessageBox.confirm(
        '您现在必须重启Echo才能更改语言设置',
        {
            confirmButtonText: '重启echo',
            cancelButtonText: '取消',
        }).then(async () => {
            await window.electronAPI.config('lang', lang)
            window.electronAPI.windowRelaunch()
        })
}


/******************** 数据保存位置 ********************/
const dataSavePath = ref<string>()


</script>

<style scoped></style>