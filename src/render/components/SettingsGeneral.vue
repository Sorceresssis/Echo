<template>
    <div>
        <div>
            <span>{{ $t('settings.lang') }}</span>
            <el-dropdown trigger="click"
                         popper-class="dropdown">
                <span class="">
                    {{ currentLang.label }}
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="lang in langList"
                                          @click="changelang(lang)">
                            {{ lang.label }}
                        </el-dropdown-item>

                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div></div>
        文件扩展名与 软件映射
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'


onMounted(async () => {
    currentLang.value = await window.electronAPI.config('lang') || langList[0]
})

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


</script>

<style scoped></style>