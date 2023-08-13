<template>
    <tabs :components="componentList"
          v-model="activeComponentIdx">
        <template v-slot:header>
            <div class="tab-header fw-bold">
                {{ $t('settings.settings') }}
            </div>
        </template>
    </tabs>
</template>

<script setup lang='ts'>
import { ref, shallowReactive } from 'vue'
import Tabs from '@/components/Tabs.vue'
import SettingsSponsor from './SettingsSponsor.vue'
import SettingsGeneral from './SettingsGeneral.vue'
import SettingsAbout from './SettingsAbout.vue'

const activeComponentIdx = ref<number>(0)
const componentList = shallowReactive([
    { id: 1, name: '赞助', component: SettingsSponsor },
    { id: 2, name: '常规', component: SettingsGeneral },
    { id: 3, name: '关于', component: SettingsAbout },
])
</script>

<style scoped></style>

<style>
.setting-item {
    max-width: 800px;
    padding: 20px 0;
    justify-content: left;
    overflow: hidden;
    border-bottom: 1px solid #dbdadf;
    line-height: 20px;
    font-size: 13px;
}

.setting-item__title {
    color: #7b7b7b;
    line-height: 20px;
}

.setting-item__content {
    margin-top: 10px;
    padding-left: 30px;
    color: #333333;
}

.setting-item .el-tooltip__trigger {
    line-height: 20px !important;
}

.setting-item img {
    -webkit-user-drag: none;
}

.flexRow {
    display: flex;
}

.flexRow>div {
    margin-right: 20px;
}

.marginTop10 {
    margin-top: 10px;
}

.externalUrl {
    text-decoration: none;
    color: #007bff
}

.externalUrl::after {
    font-family: "iconfont" !important;
    content: "\e8a9";
    font-size: 16px;
}

.setting-input {
    display: inline-block;
    width: 500px;
    height: 26px;
    margin-right: 8px;
    padding: 0 5px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    vertical-align: middle;
    background-color: #fff;
}

.setting-input::selection {
    background-color: #888888;
}

.setting-input:focus {
    outline: 0;
}
</style>