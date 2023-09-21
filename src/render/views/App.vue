<template>
    <div class="flex-1 flex-row overflow-hidden">
        <Transition name="slide">
            <sidebar v-show="isOpenSideBar"></sidebar>
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
        <div class="flex-1 flex-col overflow-hidden">
            <titlebar />
            <router-view class="main-container flex-1 flex-col overflow-hidden" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { provide, reactive, ref } from 'vue'
import Sidebar from './Sidebar.vue'
import Titlebar from './Titlebar.vue'

/* 正在打开的Library */
const activeLibrary = ref<number>(0)
provide('activeLibrary', activeLibrary)
const activeLibraryDetail = reactive<VO.LibraryDetail>({
    id: 0,
    name: '',
    auxiliarySt: '',
    useAuxiliarySt: false,
    intro: '',
    createTime: '',
    modifiedTime: '',
})
provide('activeLibraryDetail', activeLibraryDetail)

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
    padding: 0 10px;
}
</style>