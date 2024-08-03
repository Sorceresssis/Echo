<template>
    <div class="flex-col flex-1">
        <div v-if="isBatch"
             class="dashboard__header divider">
            <div class="left-menu">
                <span class="batch-processing-btn"
                      @click="closeBatch"> {{ $t('layout.exitBatchOperation') }} </span>
            </div>
            <div class="right-menu">
                <el-checkbox v-model="isSelectedAll"
                             :label="$t('layout.selectAll')"
                             class="batch-processing-btn"
                             @click.prevent="handleCheckAll" />
                <span v-if="props.type !== 'recycled'"
                      class="batch-processing-btn"
                      :class="[selectedSet.size === 0 ? 'disabled' : '']"
                      @click="recycleRecord(...selectedSet)"> {{ $t('layout.putInRecycleBin') }} </span>
                <span v-if="props.type === 'recycled'"
                      class="batch-processing-btn"
                      :class="[selectedSet.size === 0 ? 'disabled' : '']"
                      @click="recoverRecord(...selectedSet)"> {{ $t('layout.restore') }} </span>
                <span v-if="props.type === 'recycled'"
                      class="batch-processing-btn"
                      :class="[selectedSet.size === 0 ? 'disabled' : '']"
                      @click="deleteRecord(...selectedSet)"> {{ $t('layout.delete') }} </span>
            </div>
        </div>
        <div v-else
             class="dashboard__header">
            <div class="left-menu">
                <div class="batch-processing-btn"
                     @click="isBatch = true"> {{ $t('layout.batchOperation') }} </div>
                <div v-if="props.type === 'recycled'"
                     class="batch-processing-btn"
                     :class="[recordRecmds.length === 0 ? 'disabled' : '']"
                     @click="deleteAllRecycled"> {{ $t('layout.emptyRecycleBin') }} </div>
            </div>
            <div class="right-menu">
                <echo-autocomplete class="menu-item search"
                                   v-model="keyword"
                                   :placeholder="$t('layout.search')"
                                   @keyup.enter="handleQueryParamsChange" />
                <dash-drop-menu v-for="menu in dropdownMenus"
                                :menu="menu"
                                class="menu-item" />
            </div>
        </div>
        <scrollbar v-loading="loading"
                   ref="scrollbarRef"
                   class="dashboard__content scrollbar-y-w8">
            <empty v-if="recordRecmds.length === 0" />
            <div v-else
                 class="record-recommendations adaptive-grid"
                 :class="[`${recordsDashStore.view}-grid`, `${recordsDashStore.view}-records`, isBatch ? 'is-batch' : '']">
                <record-card v-for="(recmd, idxRecmd) in recordRecmds"
                             :key="recmd.id"
                             :recmd="recmd"
                             :selected="selectedSet.has(recmd.id)"
                             :title-display-type="recordsDashStore.recordCardTitleDisplayType"
                             :can-push-to-author-page="props.type !== 'series'"
                             @contextmenu="openCtm($event, idxRecmd)"
                             @select="handleSelect(recmd.id)">
                </record-card>
            </div>
        </scrollbar>
        <el-pagination v-model:current-page="currentPage"
                       class="dashboard__footer"
                       background
                       size="small"
                       :page-size="pageSize"
                       layout="prev, pager, next, jumper, total"
                       :total="total"
                       @current-change="handlePageChange" />
        <context-menu v-model:show="isVisCtm"
                      :options="ctmOptions">
            <context-menu-item :label="$t('layout.copyTitle')"
                               @click="writeClibboard(recordRecmds[idxFocusRecord].title)">
                <template #icon> <span class="iconfont">&#xe85c;</span> </template>
            </context-menu-item>
            <context-menu-item :label="$t('layout.copyTitleAndAuthors')"
                               @click="writeClibboard(recordRecmds[idxFocusRecord].title
                                + '  ' + recordRecmds[idxFocusRecord].authors.map(author => author.name).join(', '))" />
            <context-menu-item v-if="props.type !== 'series'"
                               :label="$t('layout.edit')"
                               @click="router.push(RouterPathGenerator.libraryEditRecord(activeLibrary, recordRecmds[idxFocusRecord].id))">
                <template #icon> <span class="iconfont"> &#xe722; </span> </template>
            </context-menu-item>
            <context-menu-item v-if="props.type === 'series'"
                               :label="$t('layout.removeFromSeries')"
                               @click="removeRecordFromSeries(recordRecmds[idxFocusRecord].id)">
                <template #icon> <span class="iconfont"> &#xe722; </span> </template>
            </context-menu-item>
            <context-menu-item v-if="props.type !== 'recycled'"
                               :label="$t('layout.putInRecycleBin')"
                               @click="recycleRecord(recordRecmds[idxFocusRecord].id)">
                <template #icon> <span class="iconfont"> &#xe636; </span> </template>
            </context-menu-item>
            <context-menu-item v-if="props.type === 'recycled'"
                               :label="$t('layout.restore')"
                               @click="recoverRecord(recordRecmds[idxFocusRecord].id)">
                <template #icon> <span class="iconfont"> &#xe652; </span> </template>
            </context-menu-item>
            <context-menu-item v-if="props.type === 'recycled'"
                               :label="$t('layout.deletePermanently')"
                               @click="deleteRecord(recordRecmds[idxFocusRecord].id)" />
        </context-menu>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref, Ref, inject, watch, toRaw, reactive, onActivated } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
import RouterPathGenerator from '@/router/router_path_generator';
import { $t } from '@/locale'
import { debounce } from '@/util/common'
import { RecordCardTitleDisplayType } from '@/constant/enum'
import { writeClibboard } from '@/util/systemUtil'
import MessageBox from '@/util/MessageBox'
import { VueInjectKey } from '@/constant/channel_key';
import useRecordsDashStore from '@/store/recordsDashStore'
import Empty from '@/components/Empty.vue'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import DashDropMenu from '@/components/DashDropMenu.vue'
import Scrollbar from '@/components/Scrollbar.vue'
import RecordCard from '@/components/RecordCard.vue'

const props = withDefaults(defineProps<{
    type?: 'common' | 'recycled' | 'author' | 'series'
}>(), {
    type: 'common'
})

const emit = defineEmits<{
    (e: 'removeRecordFromSeries', recordId: number, seriesId: number): void
}>()

const router = useRouter()
const route = useRoute()

const enum FilterKey {
    cover = 0,
    hyperlink,
    basename,
}

const activeLibrary = inject<Ref<number>>(VueInjectKey.ACTIVE_LIBRARY)!;

const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()
const recordsDashStore = useRecordsDashStore()

const dropdownMenus: DashDropMenu[] = [
    {
        HTMLElementTitle: $t('layout.filter'),
        title: '&#xe7e6;',
        items: [
            {
                title: $t('layout.hasCover'),
                divided: false,
                click: () => recordsDashStore.handleFilter(FilterKey.cover),
                hit: () => recordsDashStore.filter[FilterKey.cover]
            },
            {
                title: $t('layout.hasHyperlink'),
                divided: false,
                click: () => recordsDashStore.handleFilter(FilterKey.hyperlink),
                hit: () => recordsDashStore.filter[FilterKey.hyperlink]
            },
            {
                title: $t('layout.hasFile'),
                divided: false,
                click: () => recordsDashStore.handleFilter(FilterKey.basename),
                hit: () => recordsDashStore.filter[FilterKey.basename]
            },
        ]
    },
    {
        HTMLElementTitle: $t('layout.sortBy'),
        title: '&#xe81f;',
        items: [
            {
                title: $t('layout.time'),
                divided: false,
                click: () => recordsDashStore.handleSortField('time'),
                hit: () => recordsDashStore.sortField === 'time'
            },
            {
                title: $t('layout.title'),
                divided: false,
                click: () => recordsDashStore.handleSortField('title'),
                hit: () => recordsDashStore.sortField === 'title'
            },
            {
                title: $t('layout.rate'),
                divided: false,
                click: () => recordsDashStore.handleSortField('rate'),
                hit: () => recordsDashStore.sortField === 'rate'
            },
            {
                title: $t('layout.releaseDate'),
                divided: false,
                click: () => recordsDashStore.handleSortField('release_date'),
                hit: () => recordsDashStore.sortField === 'release_date'
            },
            {
                title: $t('layout.ascending'),
                divided: true,
                click: () => recordsDashStore.handleOrder('ASC'),
                hit: () => recordsDashStore.order === 'ASC'
            },
            {
                title: $t('layout.descending'),
                divided: false,
                click: () => recordsDashStore.handleOrder('DESC'),
                hit: () => recordsDashStore.order === 'DESC'
            },
        ]
    },
    {
        HTMLElementTitle: $t('layout.title'),
        title: '&#xe61d;',
        items: [
            {
                title: $t('layout.title'),
                divided: false,
                click: () => recordsDashStore.setRecordCardTitleDisplayType(RecordCardTitleDisplayType.TITLE),
                hit: () => recordsDashStore.recordCardTitleDisplayType === RecordCardTitleDisplayType.TITLE
            },
            {
                title: $t('layout.translated_title'),
                divided: false,
                click: () => recordsDashStore.setRecordCardTitleDisplayType(RecordCardTitleDisplayType.TRANSLATED_TITLE),
                hit: () => recordsDashStore.recordCardTitleDisplayType === RecordCardTitleDisplayType.TRANSLATED_TITLE
            }
        ]
    },
    {
        HTMLElementTitle: $t('layout.view'),
        title: '&#xe6c7;',
        items: [
            {
                title: $t('layout.thumbnail'),
                divided: false,
                click: () => recordsDashStore.handleView('thumbnail'),
                hit: () => recordsDashStore.view === 'thumbnail'
            },
            {
                title: $t('layout.extended'),
                divided: false,
                click: () => recordsDashStore.handleView('extended'),
                hit: () => recordsDashStore.view === 'extended'
            },
        ]
    },
]
const scrollbarRef = ref()
const loading = ref<boolean>(false)

const recordRecmds = ref<VO.RecordRecommendation[]>([])
const keyword = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = 50
const total = ref<number>(0)

// ANCHOR 右键菜单
const isVisCtm = ref(false)
const idxFocusRecord = ref(-1)
const ctmOptions = {
    zIndex: 3000,
    minWidth: 220,
    x: 500,
    y: 200
}
const openCtm = (e: MouseEvent, idxRecord: number) => {
    if (isBatch.value) return // 批量操作时不显示右键菜单
    ctmOptions.x = e.x
    ctmOptions.y = e.y
    isVisCtm.value = true
    idxFocusRecord.value = idxRecord
}

//ANCHOR 批量操作
const isBatch = ref(false)
const isSelectedAll = ref<boolean>(false)
const selectedSet = reactive<Set<number>>(new Set())
const closeBatch = () => {
    isBatch.value = false
    selectedSet.clear()
    isSelectedAll.value = false
}
const handleSelect = (id: number) => {
    if (selectedSet.has(id)) {
        selectedSet.delete(id)
    } else {
        selectedSet.add(id)
    }
    isSelectedAll.value = selectedSet.size === recordRecmds.value.length
}
const handleCheckAll = () => {
    selectedSet.clear()
    isSelectedAll.value = !isSelectedAll.value
    if (isSelectedAll.value) {
        recordRecmds.value.forEach(recmd => selectedSet.add(recmd.id))
    }
}

// ANCHOR 数据操作
const handleDataChange = () => {
    // 检查是否需要跳转到上一页，如果执行了改变数据的操作，是否还存在当前页, 防止出错调转到第一页，来重复查询
    if (currentPage.value === 1 || total.value - selectedSet.size > (currentPage.value - 1) * pageSize) {
        handlePageChange(currentPage.value)
    } else {
        handlePageChange(currentPage.value - 1)
    }
}
// 放入回收站
const recycleRecord = (...ids: number[]) => {
    if (ids.length === 0) return
    MessageBox.confirm($t('layout.putInRecycleBin'), $t('tips.surePutInRecycleBin')).then(async () => {
        // 提醒其他组件刷新
        viewsTaskAfterRoutingStore.setBashboardRecycled('refresh')

        await window.dataAPI.batchProcessingRecord(activeLibrary.value, 'recycle', ids)
        handleDataChange()
    })
}
// 彻底删除
const deleteRecord = (...ids: number[]) => {
    if (ids.length === 0) return
    MessageBox.deleteConfirm().then(async () => {
        await window.dataAPI.batchProcessingRecord(activeLibrary.value, 'delete_recycled', ids)
        handleDataChange()
    })
}
const deleteAllRecycled = () => {
    if (recordRecmds.value.length === 0) return
    MessageBox.deleteConfirm().then(() => {
        loading.value = true
        return window.dataAPI.batchProcessingRecord(activeLibrary.value, 'delete_recycled_all')
    }).then(() => {
        handleDataChange()
    }).finally(() => {
        loading.value = false
    })
}
// 恢复
const recoverRecord = (...ids: number[]) => {
    if (ids.length === 0) return
    MessageBox.confirm($t('layout.restore'), $t('tips.sureRestore')).then(() => {
        loading.value = true
        // 提醒其他组件刷新
        viewsTaskAfterRoutingStore.setBashboardRecords('refresh')
        viewsTaskAfterRoutingStore.setBashboardAuthors('refresh')

        return window.dataAPI.batchProcessingRecord(activeLibrary.value, 'recover', ids)
    }).then(() => {
        handleDataChange()
    }).finally(() => {
        loading.value = false
    })
}

const removeRecordFromSeries = function (recordId: number) {
    if (!route.query.seriesId) return

    const seriesId = Number(route.query.seriesId)
    MessageBox.confirm($t('tips.dangerousOperation'), $t('tips.sureRemoveFromSeries'), 'warning').then(() =>
        window.dataAPI.removeRecordFromSeries(activeLibrary.value, recordId, seriesId
        ).then(handleDataChange)
    )
    emit('removeRecordFromSeries', recordId, seriesId)
}

const queryRecords = debounce(() => {
    if (!activeLibrary.value) return
    loading.value = true
    window.dataAPI.queryRecordRecmds(
        activeLibrary.value,
        {
            type: props.type,
            keyword: keyword.value,
            authorId: props.type === 'author' ? Number(route.params.authorId) : 0,
            seriesId: props.type === 'series' ? Number(route.query.seriesId) : 0,
            filters: toRaw(recordsDashStore.filter),
            sortField: recordsDashStore.sortField,
            order: recordsDashStore.order,
            pn: currentPage.value,
            ps: pageSize
        }
    ).then((res) => {
        recordRecmds.value = res.results
        total.value = res.page.total_count
        currentPage.value = res.page.pn
    }).catch(() => {
    }).finally(() => {
        loading.value = false
    })
}, 200)
const handlePageChange = function (pn: number) {
    selectedSet.clear() // 清空选中
    isSelectedAll.value = false // 取消全选
    scrollbarRef.value?.setScrollPosition(0) // 恢复滚动条位置
    if (pn) {
        currentPage.value = pn // 重置页码
    }
    queryRecords() // 重新查询
}
const handleQueryParamsChange = function () {
    handlePageChange(1)
}
const init = function () {
    keyword.value = ''
    isBatch.value = false
    handleQueryParamsChange()
}
// 2. 请求参数改变，要跳到第一页
watch(() => [
    recordsDashStore.filter,
    recordsDashStore.sortField,
    recordsDashStore.order
], handleQueryParamsChange, { deep: true })
const handleViewTask = () => {
    if (props.type === 'common') {
        switch (viewsTaskAfterRoutingStore.bashboardRecords) {
            case 'init':
                init()
                break
            case 'refresh':
                queryRecords()
                break
        }
        viewsTaskAfterRoutingStore.setBashboardRecords('none')
    } else if (props.type === 'author') {
        switch (viewsTaskAfterRoutingStore.authorRecords) {
            case 'init':
                init()
                break
            case 'refresh':
                queryRecords()
                break
        }
        viewsTaskAfterRoutingStore.setAuthorRecords('none')
    } else if (props.type === 'recycled') {
        switch (viewsTaskAfterRoutingStore.bashboardRecycled) {
            case 'init':
                init()
                break
            case 'refresh':
                queryRecords()
                break
        }
        viewsTaskAfterRoutingStore.setBashboardRecycled('none')
    } else if (props.type === 'series') {
        init()
    }
}

onMounted(init)
onActivated(handleViewTask)
onBeforeRouteUpdate(handleViewTask)
</script>

<style scoped>
.batch-processing-btn {
    margin-right: 20px;
    cursor: pointer;
}

.batch-processing-btn:not(.disabled):hover {
    color: var(--echo-theme-color);
}
</style>