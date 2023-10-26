<template>
    <div class="flex-1 flex-col overflow-hidden">
        <titlebar />
        <router-view v-slot="{ Component }"
                     class="main-container flex-1 flex-col overflow-hidden">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>

<script setup lang='ts'>
import { provide, reactive, ref } from 'vue'
import Titlebar from './views/Titlebar.vue'


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

const record = reactive<VO.RecordDetail>({
    id: 0,
    title: '',
    rate: 0,
    cover: null,
    hyperlink: null,
    dirname: null,
    basename: null,
    resourcePath: null,
    authors: [],
    tags: [],
    series: [],
    intro: '',
    info: '',
    createTime: '',
    modifiedTime: '',
})
provide('record', record)

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