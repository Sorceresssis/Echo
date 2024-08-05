<template>
    <div class="titlebar flex-row">
        <div>
            <span :title="$t('layout.searchTitle')"
                  class="iconfont no-drag"
                  @click="searchTitle">&#xe8ba;</span>
            <span :title="$t('layout.openLinkInBrowser')"
                  class="iconfont no-drag"
                  :class="record.hyperlink ? '' : 'disabled'"
                  @click="openInBrowser(record.hyperlink)">&#xe612;</span>
            <span :title="$t('layout.openInFileExplorer')"
                  class="iconfont no-drag"
                  :class="record.source_fullpath ? '' : 'disabled'"
                  @click="openInExplorer(record.source_fullpath)">&#xe73e;</span>
            <span :title="$t('layout.similarRecommendation')"
                  class="iconfont no-drag"
                  @click="openSimilarDrawer">&#xe620;</span>
            <span :title="$t('layout.allInfo')"
                  class="iconfont no-drag"
                  :class="[route.fullPath === '/' ? 'active' : '']"
                  @click="router.push('/')">&#xe6c9;</span>
            <span :title="$t('layout.edit')"
                  class="iconfont no-drag"
                  :class="[route.fullPath.startsWith('/manage') ? 'active' : '']"
                  @click="router.push(`/manage?record_id=${record.id}`)">&#xe722;</span>
        </div>
        <div class="titlebar__title flex-1 min-width-0 textover--ellopsis">
            <span> {{ record.title }} </span>
        </div>
        <div class="flex">
            <span class="iconfont no-drag"
                  @click="windowMinmize">&#xe67a;</span>
            <span v-if="isMaxmize"
                  class="iconfont no-drag"
                  @click="windowMaxmize">&#xe607;</span>
            <span v-else
                  class="iconfont no-drag"
                  @click="windowMaxmize">&#xe606;</span>
            <span class="iconfont no-drag"
                  @click="windowClose">&#xe685;</span>
        </div>
        <el-drawer v-model="showSimilarDrawer"
                   direction="btt"
                   size="380px"
                   class="similar-record-drawer">
            <template #header="{ close, titleId, titleClass }">
                <h4 :id="titleId"
                    :class="titleClass"> {{ $t('layout.similarRecommendation') }} </h4>
            </template>
            <div v-if="similarRecords.length"
                 v-loading.lock="similarLoading"
                 class="record-recommendations thumbnail-records scrollbar-x-h8"
                 @mousedown="startScroll">
                <record-card v-for="(recmd, idxRecmd) in similarRecords"
                             :key="recmd.id"
                             :recmd="recmd"
                             :selected="false"
                             :can-push-to-author-page="false"
                             @contextmenu="openCtm($event, idxRecmd)">
                </record-card>
                <context-menu v-model:show="isVisCtm"
                              :options="ctmOptions">
                    <context-menu-item :label="$t('layout.copyTitle')"
                                       @click="writeClibboard(similarRecords[idxFocusRecord].title)">
                        <template #icon> <span class="iconfont">&#xe85c;</span> </template>
                    </context-menu-item>
                    <context-menu-item :label="$t('layout.copyAllInfo')"
                                       @click="writeClibboard(similarRecords[idxFocusRecord].title
                                        + '\n' + similarRecords[idxFocusRecord].authors.map(author => author.name).join(',')
                                        + '\n' + similarRecords[idxFocusRecord].tags.map(tag => tag.title).join(','))" />
                    <context-menu-item :label="$t('layout.putInRecycleBin')"
                                       @click="recycleRecord(similarRecords[idxFocusRecord].id)">
                        <template #icon> <span class="iconfont"> &#xe636; </span> </template>
                    </context-menu-item>
                </context-menu>
            </div>
            <empty v-else-if="!similarLoading"
                   :title="$t('layout.noSimilarRecommendation')" />
        </el-drawer>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, inject, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { $t } from '@/locale'
import { VueInjectKey } from '@/constant/channel_key';
import MessageBox from '@/util/MessageBox'
import { openInBrowser, openInExplorer, internetSearch, writeClibboard } from '@/util/systemUtil'
import CrosTabBroadcast, { type CrosTabBroadcastMsg } from "@/util/CrosTabBroadcast";
import { CrosTabBroadcastKey } from '@/constant/channel_key'
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
import { useDragScroll } from '@/util/common'
import RecordCard from '@/components/RecordCard.vue'
import Empty from '@/components/Empty.vue'

const router = useRouter()
const route = useRoute()

const recordTabBroadcast = new CrosTabBroadcast(CrosTabBroadcastKey.CHANNEL.recordTab)

const activeLibrary = inject<Ref<number>>(VueInjectKey.ACTIVE_LIBRARY)!
const activeLibraryDetail = inject<VO.LibraryDetail>(VueInjectKey.ACTIVE_LIBRARY_DETAIL)!
const record = inject<VO.RecordDetail>(VueInjectKey.RECORD)!

const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()
const { startScroll } = useDragScroll()


const isMaxmize = ref<boolean>()
window.electronAPI.windowIsMaxmize((e: any, value: boolean) => isMaxmize.value = value)
const windowMinmize = () => window.electronAPI.windowMinmize()
const windowMaxmize = () => window.electronAPI.windowMaxmize()
const windowClose = () => window.electronAPI.windowClose()

const searchTitle = function () {
    window.dataAPI.queryLibraryDetail(activeLibrary.value).then(libDetail => {
        if (!libDetail) return
        const t = record.title + (libDetail.use_auxiliary_st ? `  ${libDetail.auxiliary_st}` : '')
        internetSearch(t)
    })
}

// 展示相似的record的抽屉
const showSimilarDrawer = ref(false)
const similarRecords = ref<VO.RecordRecommendation[]>([])
const similarLoading = ref(false)
const openSimilarDrawer = (function () {
    let queryed = false
    return () => {
        showSimilarDrawer.value = true

        if (queryed) return

        similarLoading.value = true
        window.dataAPI.querySimilarRecordRecmds(activeLibrary.value, record.id, 8).then(recmds => {
            similarRecords.value = recmds
            queryed = true
            similarLoading.value = false
        })
    }
})()


const queryRecordDetail = function () {
    window.dataAPI.queryRecordDetail(activeLibrary.value, record.id).then(recordDetail => {
        Object.assign(record, recordDetail)
        // 每一次查询recordDetail 更新document.title
        document.title = record.title
    })
}
const queryLibraryDetail = function () {
    window.dataAPI.queryLibraryDetail(activeLibrary.value).then(libraryDetail => {
        Object.assign(activeLibraryDetail, libraryDetail)
    })
}

// 右键菜单
const isVisCtm = ref(false)
const idxFocusRecord = ref(-1)
const ctmOptions = {
    zIndex: 3000,
    minWidth: 300,
    x: 500,
    y: 200
}
const openCtm = (e: MouseEvent, idxRecord: number) => {
    ctmOptions.x = e.x
    ctmOptions.y = e.y
    isVisCtm.value = true
    idxFocusRecord.value = idxRecord
}
const recycleRecord = (...ids: number[]) => {
    if (ids.length === 0) return
    MessageBox.confirm($t('layout.putInRecycleBin'), $t('tips.surePutInRecycleBin')).then(async () => {
        window.dataAPI.batchProcessingRecord(activeLibrary.value, 'recycle', ids).then(() => {
            similarRecords.value = similarRecords.value.filter(recmd => !ids.includes(recmd.id))
        })
    })
}

watch(route, () => {
    if (viewsTaskAfterRoutingStore.bashboardRecords !== 'none') {
        queryRecordDetail()
        viewsTaskAfterRoutingStore.setBashboardRecords('none')
    }
})


onMounted(() => {
    recordTabBroadcast.onMessage((e: MessageEvent<CrosTabBroadcastMsg<VO.LibraryDetail>>) => {
        if (e.data.type !== CrosTabBroadcastKey.MSG_TYPE.reloadLibraryDetail) return
        Object.assign(activeLibraryDetail, e.data.payload)
    })

    window.electronAPI.getRecordWindowParams((e: any, libraryId: number, recordId: number) => {
        activeLibrary.value = libraryId
        record.id = recordId
        queryLibraryDetail()
        queryRecordDetail()
    })
})
</script>

<style scoped>
.titlebar {
    padding: 0 10px;
}

.no-drag {
    padding: 5px 10px;
    cursor: pointer;
}

.active {
    color: var(--echo-theme-color);
}

.no-drag:not(.disabled):hover {
    color: var(--echo-theme-color);
}

.record-recommendations {
    display: flex;
    flex: 1;
    padding-bottom: 10px;
}
</style>