<template>
    <div class="record-recommendation-item overflow-hidden">
        <local-image :src="recmd.cover"
                     class="cover" />
        <div class="record-info">
            <div class="meta scrollbar-x-nodisplay title"
                 :title="recmd.title"
                 @mousedown="startScroll"> {{ recmd.title }} </div>
            <div class="meta">
                <div class="inline-list-title">{{ $t('layout.rate') }}</div>
                <div class="meta-content">
                    <el-rate v-model="recmd.rate"
                             size="small"
                             disabled />
                </div>
            </div>
            <div v-if="recmd.authors.length"
                 class="meta scrollbar-x-nodisplay"
                 @mousedown="startScroll">
                <div class="inline-list-title"> {{ $t('layout.authors') }}</div>
                <ul class="meta-content">
                    <li v-for="author in recmd.authors"
                        :key="author.id"
                        class="author">
                        <local-image :src="author.avatar"
                                     class="avatar-icon"
                                     @click="canPushToAuthorPage && router.push(RouterPathGenerator.libraryAuthor(activeLibrary, author.id))" />
                        <span class="author_name"> {{ author.name }} </span>
                        <span v-if="author.role">({{ author.role }})</span>
                    </li>
                </ul>
            </div>
            <div v-if="recmd.tags.length"
                 class="meta scrollbar-x-nodisplay"
                 @mousedown="startScroll">
                <div class="inline-list-title">{{ $t('layout.tags') }}</div>
                <ul class="meta-content">
                    <li v-for="tag in recmd.tags"
                        :key="tag.id"
                        class="tag"> {{ tag.title }} </li>
                </ul>
            </div>
            <div class="operates">
                <div :title="$t('layout.searchTitle')"
                     @click="searchTitle"> <span class="iconfont">&#xe8ba;</span> </div>
                <div :title="$t('layout.openLinkInBrowser')"
                     :class="recmd.hyperlink ? '' : 'disabled'"
                     @click="openInBrowser(recmd.hyperlink)"> <span class="iconfont">&#xe612;</span> </div>
                <div :title="$t('layout.openInFileExplorer')"
                     :class="recmd.resourcePath ? '' : 'disabled'"
                     @click="openInExplorer(recmd.resourcePath)"> <span class="iconfont">&#xe73e;</span> </div>
                <div :title="$t('layout.openInNewWindow')"
                     @click="createRecordWindow(activeLibrary, recmd.id)"> <span class="iconfont">&#xe7e9;</span>
                </div>
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
import RouterPathGenerator from '@/router/router_path_generator'
import { openInExplorer, openInBrowser, internetSearch } from '@/util/systemUtil'
import { VueInjectKey } from '@/constant/channel_key'
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

const activeLibrary = readonly(inject<Ref<number>>(VueInjectKey.ACTIVE_LIBRARY)!)
const activeLibraryDetail = inject<VO.LibraryDetail>(VueInjectKey.ACTIVE_LIBRARY_DETAIL)!;

const searchTitle = function () {
    const t = props.recmd.title
        + ' ' + props.recmd.authors.map(a => a.name).join(' ')
        + (activeLibraryDetail.use_auxiliary_st ? `  ${activeLibraryDetail.auxiliary_st}` : '')
    internetSearch(t)
}

function createRecordWindow(libraryId: number, recordId: number) {
    window.electronAPI.createRecordWindow(libraryId, recordId)
}
</script>