<template>
    <div class="flex-col">
        <div class="dashboard__content scrollbar-y-w8">
            <div class="row">
                <span class="inline-list-title">ID </span>
                {{ libraryDetail.id }}
            </div>
            <div class="row">
                <span class="inline-list-title">创建时间 </span>
                {{ libraryDetail.createTime }}
            </div>
            <div class="row">
                <span class="inline-list-title">最近修改时间 </span>
                {{ libraryDetail.modifiedTime }}
            </div>
            <div class="row section">
                <span class="inline-list-title">关键词</span> {{ libraryDetail.keyword }}
            </div>
            <div class="row section"
                 v-html="libraryDetail.intro">
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, Ref, inject, onActivated } from 'vue'

const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>

const defaultLibraryDetail = {
    id: 0,
    name: '',
    intro: '',
    keyword: '',
    createTime: '',
    modifiedTime: '',
}
const libraryDetail = ref<VO.LibraryDetail>(defaultLibraryDetail)

const queryLibraryDetail = async () => {
    const res = await window.electronAPI.queryLibraryDetail(activeLibrary.value)
    if (res) {
        res.intro = res.intro ? res.intro.replace(/\n/g, '<br/>') : ''
        res.keyword = res.keyword || ''
        libraryDetail.value = res
    } else { // 不存在
        libraryDetail.value = defaultLibraryDetail
    }
}
onActivated(queryLibraryDetail)
onMounted(queryLibraryDetail)
</script>

<style scoped>
.section {
    margin-bottom: 30px;
}

.row {
    padding: 5px 0;
}
</style>