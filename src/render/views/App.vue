<template>
    <div class="flex-1 flex-row overflow-hidden">
        <Transition name="collapse">
            <sidebar v-show="isOpenSideBar" />
        </Transition>
        <div class="flex-col">
            <div class="titlebar" />
            <div class="slide-track flex-1 flex-row">
                <span @click="isOpenSideBar = !isOpenSideBar"
                      class="slide-thumb iconfont"> &#xe653; </span>
            </div>
        </div>
        <div class="flex-1 flex-col overflow-hidden">
            <titlebar />
            <router-view class="main-container flex-1 flex-col overflow-hidden" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { provide, reactive, ref, readonly } from 'vue'
import Sidebar from './Sidebar.vue'
import Titlebar from './Titlebar.vue'

// 侧边是否展开
const isOpenSideBar = ref<boolean>(true)

// 正在使用的库, 只能在Titlebar.vue中修改, 其他地方只能读取
const activeLibrary = ref<number>(0)
provide('activeLibrary', activeLibrary)

// 正在使用的库详情
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

// TODO 全局Loading, 测试 多个窗口， 一个窗口堵塞时，其他窗口是否可以正常使用
const windowLoading = ref<boolean>(false)
provide('windowLoading', windowLoading)
</script>

<style scoped>
.main-container {
    font-size: 14px;
    padding: 0 10px;
}

.slide-track {
    align-items: center;
}

/* TODO collapse thumb */
.slide-thumb {
    height: 25px;
    line-height: 25px;
    color: #505050;
    transform: translateY(-25px);
}

.slide-thumb:hover {
    color: var(--echo-theme-color);
}

.sidebar {
    --echo-sidebar-width: 230px;
}

.collapse-enter-from,
.collapse-leave-to {
    width: 0;
}

.collapse-enter-active,
.collapse-leave-active {
    transition: 0.5s;
}

.collapse-enter-to,
.collapse-leave-from {
    width: var(--echo-sidebar-width);
}
</style>