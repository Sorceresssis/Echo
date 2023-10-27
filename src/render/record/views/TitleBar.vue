<template>
    <div class="titlebar flex-row">
        <div>
            <span :title="'搜索标题'"
                  class="iconfont no-drag"
                  @click="searchTitle">&#xe8ba;</span>
            <span :title="'浏览器中打开链接'"
                  class="iconfont no-drag"
                  :class="record.hyperlink ? '' : 'disabled'"
                  @click="openInBrowser(record.hyperlink)">&#xe612;</span>
            <span :title="'在资源管理器中打开'"
                  class="iconfont no-drag"
                  :class="record.resourcePath ? '' : 'disabled'"
                  @click="openInExplorer(record.resourcePath)">&#xe73e;</span>
            <span :title="'相似推荐'"
                  class="iconfont no-drag"
                  @click="openSimilarDrawer">&#xe620;</span>
            <span :title="'全部信息'"
                  class="iconfont no-drag"
                  :class="[route.fullPath === '/' ? 'active' : '']"
                  @click="router.push('/')">&#xe6c9;</span>
            <span :title="'编辑'"
                  class="iconfont no-drag"
                  :class="[route.fullPath.startsWith('/manage') ? 'active' : '']"
                  @click="router.push(`/manage?record_id=${record.id}`)">&#xe722;</span>
        </div>
        <div class="titlebar__title flex-1 min-width-0 textover--ellopsis">
            <span> {{ record.title }} </span>
        </div>
        <div class="flex">
            <span :title="$t('titlebar.minimize')"
                  class="iconfont no-drag"
                  @click="windowMinmize">&#xe67a;</span>
            <span v-if="isMaxmize"
                  :title="$t('titlebar.restore')"
                  class="iconfont no-drag"
                  @click="windowMaxmize">&#xe607;</span>
            <span v-else
                  :title="$t('titlebar.maximize')"
                  class="iconfont no-drag"
                  @click="windowMaxmize">&#xe606;</span>
            <span :title="$t('titlebar.close')"
                  class="iconfont no-drag"
                  @click="windowClose">&#xe685;</span>
        </div>
        <el-drawer v-model="similarDrawerVisible"
                   direction="btt"
                   size="380px"
                   class="similar-record-drawer">
            <template #header="{ close, titleId, titleClass }">
                <h4 :id="titleId"
                    :class="titleClass"> {{ '相似推荐' }} </h4>
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
                    <context-menu-item :label="'复制标题'"
                                       @click="writeClibboard(similarRecords[idxFocusRecord].title)">
                        <template #icon> <span class="iconfont">&#xe85c;</span> </template>
                    </context-menu-item>
                    <context-menu-item :label="'复制全部信息'"
                                       @click="writeClibboard(similarRecords[idxFocusRecord].title
                                           + '\n' + similarRecords[idxFocusRecord].authors.map(author => author.name).join(',')
                                           + '\n' + similarRecords[idxFocusRecord].tags.map(tag => tag.title).join(','))" />
                    <context-menu-item label="放入回收站"
                                       @click="recycleRecord(similarRecords[idxFocusRecord].id)">
                        <template #icon> <span class="iconfont"> &#xe636; </span> </template>
                    </context-menu-item>
                </context-menu>
            </div>
            <empty v-else-if="!similarLoading"
                   :title="'暂无相似推荐'" />
        </el-drawer>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, inject, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { $t } from '@/locale'
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
import { openInBrowser, openInExplorer, internetSearch, writeClibboard } from '@/util/systemUtil'
import { useDragScroll } from '@/util/common'
import { listenCrosTabMsg } from '@/util/CrosTabMsg'
import RecordCard from '@/components/RecordCard.vue'
import Empty from '@/components/Empty.vue'
import MessageBox from '@/util/MessageBox'

const router = useRouter()
const route = useRoute()

const { startScroll } = useDragScroll()

const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()
const activeLibrary = inject<Ref<number>>('activeLibrary')!
const activeLibraryDetail = inject<VO.LibraryDetail>('activeLibraryDetail')!
const record = inject<VO.RecordDetail>('record')!

const isMaxmize = ref<boolean>()
window.electronAPI.windowIsMaxmize((e: any, value: boolean) => isMaxmize.value = value)
const windowMinmize = () => window.electronAPI.windowMinmize()
const windowMaxmize = () => window.electronAPI.windowMaxmize()
const windowClose = () => window.electronAPI.windowClose()

const searchTitle = function () {
    window.electronAPI.queryLibraryDetail(activeLibrary.value).then(libDetail => {
        if (!libDetail) return
        const t = record.title + (libDetail.useAuxiliarySt ? `  ${libDetail.auxiliarySt}` : '')
        internetSearch(t)
    })
}

// 展示相似的record的抽屉
const similarDrawerVisible = ref(false)
const similarRecords = ref<VO.RecordRecommendation[]>([])
const similarLoading = ref(false)
const openSimilarDrawer = (function () {
    let queryed = false
    return () => {
        similarDrawerVisible.value = true

        if (queryed) return

        similarLoading.value = true
        window.electronAPI.querySimilarRecordRecmds(activeLibrary.value, record.id, 8).then(recmds => {
            similarRecords.value = recmds
            queryed = true
            similarLoading.value = false
        })
    }
})()


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
    MessageBox.confirm('放入回收站', '确定要放入回收站吗?').then(async () => {
        window.electronAPI.batchProcessingRecord(activeLibrary.value, 'recycle', ids).then(() => {
            similarRecords.value = similarRecords.value.filter(recmd => !ids.includes(recmd.id))
        })
    })
}

watch(route, async () => {
    if (viewsTaskAfterRoutingStore.bashboardRecycled !== 'none') {
        queryRecordDetail()
        viewsTaskAfterRoutingStore.setBashboardRecycled('none')
    }
    document.title = `${record.title}`
})

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