<template>
    <div class="record-recommendation-item overflow-hidden">
        <local-image :src="recmd.cover"
                     class="cover" />
        <div>
            <div class="meta scrollbar-x-nodisplay title"
                 :title="recmd.title"
                 @mousedown="startInfoScroll"> {{ recmd.title }} </div>
            <div class="meta scrollbar-x-nodisplay"
                 @mousedown="startInfoScroll">
                <span class="inline-list-title"> {{ '作者' }}</span>
                <div v-for="author in recmd.authors"
                     :key="author.id"
                     class="author">
                    <local-image :src="author.avatar"
                                 class="img-icon"
                                 @click="router.push(`/library/${activeLibrary}/author?id=${author.id}`)" />
                    <span> {{ author.name }} </span>
                </div>
            </div>
            <div class="meta scrollbar-x-nodisplay"
                 @mousedown="startInfoScroll">
                <span class="inline-list-title">{{ '标签' }}</span>
                <span v-for="tag in recmd.tags"
                      :key="tag.id"
                      class="tag"> {{ tag.title }} </span>
            </div>
            <div class="operates">
                <div :title="'搜索标题'"
                     @click="internetSearch(recmd.title)"> <span class="iconfont">&#xe651;</span> </div>
                <div :title="'浏览器中打开链接'"
                     :class="recmd.hyperlink ? '' : 'disabled'"
                     @click="openInBrowser(recmd.hyperlink)"> <span class="iconfont">&#xe6c8;</span> </div>
                <div :title="'在资源管理器中打开'"
                     :class="recmd.resourcePath ? '' : 'disabled'"
                     @click="openInExplorer(recmd.resourcePath)"> <span class="iconfont">&#xe73e;</span> </div>
                <div :title="'在新窗口中打开'"
                     @click="createRecordWindow(activeLibrary, recmd.id)"> <span class="iconfont">&#xe7e9;</span> </div>
            </div>
        </div>
        <!-- 批量选择遮罩 -->
        <div class="check-container">
            <el-checkbox size="large" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { Ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { openInExplorer, openInBrowser, internetSearch } from '@/util/systemUtil'
import LocalImage from './LocalImage.vue'

defineProps<{
    recmd: VO.RecordRecommendation
}>()

const router = useRouter()

const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>

let canScrollInfo = false
let currentTarget: HTMLDivElement
function startInfoScroll(e: MouseEvent) {
    e.preventDefault()
    canScrollInfo = true
    currentTarget = e.currentTarget as HTMLDivElement
    document.addEventListener('mousemove', scrollInfo)
    document.addEventListener('mouseup', stopScrollInfo)
}
function scrollInfo(e: MouseEvent) {
    if (canScrollInfo) {
        currentTarget.scrollLeft -= e.movementX
    }
}
function stopScrollInfo() {
    canScrollInfo = false
    document.removeEventListener('mousemove', scrollInfo)
    document.removeEventListener('mouseup', stopScrollInfo)
}

function createRecordWindow(libraryId: number, recordId: number) {
    window.electronAPI.createRecordWindow(libraryId, recordId)
}
</script>