<template>
    <div class="flex-1 flex-col overflow-hidden">
        <title-bar></title-bar>
        <router-view class="main-container flex-1 overflow-hidden">
        </router-view>
    </div>
</template>

<script setup lang='ts'>
import { provide, ref } from 'vue'
import TitleBar from './views/TitleBar.vue';

/* 正在打开的Library */
const activeLibrary = ref<number>(0)
provide('activeLibrary', activeLibrary)

/* 侧边开关 */
const isOpenSideBar = ref<boolean>(true)
</script>

<style scoped>
.slide-track {
    align-items: center;
}

.slide-thumb {
    height: 25px;
    line-height: 25px;
    color: #505050;
    transform: translateY(-25px);
}

.slide-thumb:hover {
    color: var(--echo-theme-color);
}

.slide-enter-from,
.slide-leave-to {
    width: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: 0.5s;
}

.slide-enter-to,
.slide-leave-from {
    width: 230px;
}

.main-container {
    font-size: 14px;
}
</style>