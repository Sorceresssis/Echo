<template>
    <div>
        <h2>{{ $t('settings.settings') }}</h2>
        <div class="menu">
            <div v-for="(component, index) in componentData"
                 @click="switchComponent(index)"
                 :class="[componentActive == component.component ? 'componentActive' : '']"
                 class="menuItem">
                {{ component.name }}</div>
        </div>
        <component :is="componentActive"
                   id="settingContainer">
        </component>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, shallowReactive, shallowRef, inject, Ref } from 'vue'
import i18n from '../locales/index'
import SettingsSponsor from './SettingsSponsor.vue'
import SettingsTutorial from './SettingsTutorial.vue'
import SettingsGeneral from './SettingsGeneral.vue'
import SettingsAbout from './SettingsAbout.vue'


const activeLibrary = inject<Ref<library>>('activeLibrary') as Ref<library>
onMounted(() => {
    activeLibrary.value = { id: 0, name: "" }
    document.title = `${i18n.global.t('settings.settings')} - Echo`;
})

const componentActive = shallowRef(SettingsSponsor)
const componentData = shallowReactive([
    { name: i18n.global.t('settings.sponsor'), component: SettingsSponsor },
    { name: i18n.global.t('settings.turorial'), component: SettingsTutorial },
    { name: i18n.global.t('settings.greneral'), component: SettingsGeneral },
    { name: i18n.global.t('settings.about'), component: SettingsAbout }
])
const switchComponent = (index: number) => {
    componentActive.value = componentData[index].component
}

</script>

<style scoped>
h2 {
    margin: 0 10px;
    font-size: 30px;
    font-weight: 700;
}

.menu {
    display: flex;
    height: 34px;
    margin: 10px;
    justify-content: left;
    align-items: center;
}

.menuItem {
    font-size: 14px;
    margin-right: 30px;
    cursor: pointer;
}

.menuItem:hover {
    color: #9e94f7;
}

.componentActive {
    color: #9e94f7;
    border-bottom: solid 3px #9e94f7;
}

#settingContainer {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
}

#settingContainer::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
}

#settingContainer::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #cfcfcf;
}
</style>

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