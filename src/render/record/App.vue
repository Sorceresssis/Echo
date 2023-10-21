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
import { onMounted, provide, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Titlebar from './views/Titlebar.vue'
import { listenCrosTabMsg } from '@/util/CrosTabMsg';

const route = useRoute()

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

const queryRecordDetail = function () {
    window.electronAPI.queryRecordDetail(activeLibrary.value, record.id).then(recordDetail => {
        Object.assign(record, recordDetail)
    })
}
const queryLibraryDetail = function () {
    window.electronAPI.queryLibraryDetail(activeLibrary.value).then(libraryDetail => {
        Object.assign(activeLibraryDetail, libraryDetail)
    })
}

const bc = new BroadcastChannel('updateLibraryDetail')

onMounted(() => {
    listenCrosTabMsg(bc, (e: MessageEvent) => {
        if (e.data === activeLibrary.value.toString()) {
            queryLibraryDetail()
        }
    })

    window.electronAPI.getRecordWindowParams((e: any, libraryId: number, recordId: number) => {
        activeLibrary.value = libraryId
        record.id = recordId
        queryLibraryDetail()
        queryRecordDetail()
    })
})

// TODO record编辑后， 重新获取recordDetail
watch(route, queryRecordDetail)
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