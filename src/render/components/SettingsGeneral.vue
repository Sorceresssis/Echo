<template>
    <div>
        <div>
            <span>{{ $t('settings.lang') }}</span>
            <el-dropdown trigger="click"
                         popper-class="dropdown">
                <span class="">
                    {{ currentLang }}
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
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n';

type lang = {
    label: string,
    value: string
}
const langList = reactive([
    { label: '简体中文', value: 'zhCN' },
    { label: 'English', value: 'enUS' },
    { label: '日本語', value: 'jaJP' },
    { label: '繁體中文', value: 'zhTW' },
    { label: '한국어', value: 'koKR' },
    { label: 'Deutsch', value: 'de' },
    { label: 'Français', value: 'fr' },
    { label: 'Pyccĸий', value: 'ru' }
])
const currentLang = ref('English')
const i18n = useI18n()
function changelang(lang: lang) {
    currentLang.value = lang.label
    i18n.locale.value = lang.value
    // TODO 写入配置，重启加载
}
</script>

<style scoped></style>