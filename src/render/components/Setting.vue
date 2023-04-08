<template>
    <div>
        <h2>设置</h2>
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
import { ref, shallowReactive, shallowRef } from 'vue'
import SettingSponsor from './SettingSponsor.vue';
import SettingTutorial from './SettingTutorial.vue';
import SettingGeneral from './SettingGeneral.vue';
import SettingData from './SettingData.vue';
import SettingAbout from './SettingAbout.vue';

const componentActive = shallowRef(SettingSponsor)
const componentData = shallowReactive([
    { name: '赞助', component: SettingSponsor },
    { name: '教程', component: SettingTutorial },
    { name: '通用', component: SettingGeneral },
    { name: '数据', component: SettingData },
    { name: '关于', component: SettingAbout }
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