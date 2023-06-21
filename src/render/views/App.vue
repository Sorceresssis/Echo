<template>
    <div class="flex-1 flex-row overflow-hidden">
        <Transition name="slide">
            <sidebar v-show="isOpenSideBar"
                     class="sidebar"></sidebar>
        </Transition>
        <div class="flex-col">
            <div class="titlebar"></div>
            <div class="slide-track flex-1 flex-row">
                <span @click="isOpenSideBar = !isOpenSideBar"
                      class="slide-thumb iconfont">
                    &#xe653;
                </span>
            </div>
        </div>
        <div class="flex-1 flex-col min-width-0">
            <titlebar></titlebar>
            <router-view class="main-container flex-1 flex-col overflow-hidden"></router-view>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { provide, ref } from 'vue'
import Sidebar from './Sidebar.vue'
import Titlebar from './Titlebar.vue'

/* 正在打开的Library */
const activeLibrary = ref<library>({ id: 0, name: '' })
provide('activeLibrary', activeLibrary)

/* 侧边开关 */
const isOpenSideBar = ref<boolean>(true)

</script>

<style scoped>
.sidebar {
    width: 230px;
}

.slide-track {
    align-items: center;
    color: #505050;
}

.slide-thumb {
    height: 25px;
    line-height: 25px;
}

.slide-thumb:hover {
    color: var(--echo-button-color);
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
    margin-right: 16px;
}
</style>