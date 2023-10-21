<template>
    <div class="record-recommendation-item overflow-hidden">
        <local-image :src="recmd.cover"
                     class="cover" />
        <div class="record-info">
            <div class="meta scrollbar-x-nodisplay title"
                 :title="recmd.title"
                 @mousedown="startScroll"> {{ recmd.title }} </div>
            <div class="meta scrollbar-x-nodisplay"
                 @mousedown="startScroll">
                <div class="inline-list-title"> {{ '作者' }}</div>
                <div class="meta-content">
                    <span v-for="author in recmd.authors"
                          :key="author.id"
                          class="author">
                        <local-image :src="author.avatar"
                                     class="avatar-icon"
                                     @click="canPushToAuthorPage && router.push(hrefGenerator.libraryAuthor(activeLibrary, author.id))" />
                        {{ author.name }} </span>
                </div>
            </div>
            <div class="meta scrollbar-x-nodisplay"
                 @mousedown="startScroll">
                <div class="inline-list-title">{{ '标签' }}</div>
                <div class="meta-content">
                    <span v-for="tag in recmd.tags"
                          :key="tag.id"
                          class="tag"> {{ tag.title }} </span>
                </div>
            </div>
            <div class="operates">
                <div :title="'搜索标题'"
                     @click="searchTitle"> <span class="iconfont">&#xe8ba;</span> </div>
                <div :title="'浏览器中打开链接'"
                     :class="recmd.hyperlink ? '' : 'disabled'"
                     @click="openInBrowser(recmd.hyperlink)"> <span class="iconfont">&#xe612;</span> </div>
                <div :title="'在资源管理器中打开'"
                     :class="recmd.resourcePath ? '' : 'disabled'"
                     @click="openInExplorer(recmd.resourcePath)"> <span class="iconfont">&#xe73e;</span> </div>
                <div :title="'在新窗口中打开'"
                     @click="createRecordWindow(activeLibrary, recmd.id)"> <span class="iconfont">&#xe7e9;</span> </div>
            </div>
        </div>
        <!-- 批量选择遮罩 -->
        <div class="check-container"
             @click="emit('select', recmd.id)">
            <!-- 阻止checkbox的点击事件, v-model绑定的是props的值，让父组件去改变props的值 -->
            <el-checkbox v-model="props.selected"
                         @click.prevent
                         size="large" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { Ref, inject, readonly } from 'vue'
import { useRouter } from 'vue-router'
import hrefGenerator from '@/router/hrefGenerator'
import { openInExplorer, openInBrowser, internetSearch } from '@/util/systemUtil'
import { useDragScroll } from '@/util/common'
import LocalImage from './LocalImage.vue'

const props = withDefaults(defineProps<{
    recmd: VO.RecordRecommendation,
    selected: boolean,
    canPushToAuthorPage?: boolean,
}>(), {
    canPushToAuthorPage: true,
})

const emit = defineEmits<{
    (e: 'select', recordId: number): void
}>()

const router = useRouter()
const { startScroll } = useDragScroll()

const activeLibrary = readonly(inject<Ref<number>>('activeLibrary')!)
const activeLibDetail = inject<VO.LibraryDetail>('activeLibraryDetail') as VO.LibraryDetail

const searchTitle = function () {
    const t = props.recmd.title + (activeLibDetail.useAuxiliarySt ? `  ${activeLibDetail.auxiliarySt}` : '')
    internetSearch(t)
}

function createRecordWindow(libraryId: number, recordId: number) {
    window.electronAPI.createRecordWindow(libraryId, recordId)
}
</script>