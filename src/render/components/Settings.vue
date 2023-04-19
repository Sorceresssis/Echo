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
import SettingsData from './SettingsData.vue'
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
    { name: i18n.global.t('settings.data'), component: SettingsData },
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