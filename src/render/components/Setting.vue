<template>
    <div>
        <h2>设置</h2>
        <component :is="componentActive">
        </component>
    </div>
</template>

<script setup lang='ts'>
import { ref, shallowReactive, shallowRef } from 'vue'
import SettingSponsor from './SettingSponsor.vue';
import SettingFileMap from './SettingFileMap.vue';

const componentActive = shallowRef(SettingSponsor)
const componentData = shallowReactive([
    { name: '资源', component: SettingSponsor },
    { name: '作者', component: SettingFileMap }
])
</script>

<style scoped></style>