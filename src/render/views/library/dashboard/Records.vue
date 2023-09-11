<template>
    <div class="flex-col">
        <div v-if="isBatchOperation"
             class="dashboard__header divider">
            <div class="left-menu">
                <span class="batch-processing-btn"
                      @click="isBatchOperation = false">返回</span>
            </div>
            <div class="right-menu">
                <span class="batch-processing-btn menu-item">全选</span>
                <span class="batch-processing-btn menu-item">删除</span>
            </div>
        </div>
        <div v-else
             class="dashboard__header">
            <div class="left-menu">
                <div class="batch-processing-btn"
                     @click="isBatchOperation = true">批量操作</div>
            </div>
            <div class="right-menu">
                <echo-autocomplete class="menu-item search"
                                   v-model="keyword"
                                   :placeholder="'搜索'"
                                   @keyup.enter="handleQueryParamsChange" />
                <dash-drop-menu v-for="menu in dropdownMenus"
                                :menu="menu"
                                class="menu-item" />
            </div>
        </div>
        <scrollbar v-loading="loading"
                   ref="scrollbarRef"
                   class="dashboard__content scrollbar-y-w8">
            <empty v-if="recordRecmds.length == 0" />
            <div v-else
                 class="record-recommendations adaptive-grid"
                 :class="[`${recordsDashStore.view}-grid`]">
                <record-card v-for="recmd in recordRecmds"
                             :key="recmd.id"
                             :recmd="recmd">
                </record-card>
            </div>
        </scrollbar>
        <el-pagination v-model:current-page="currentPage"
                       class="dashboard__footer"
                       background
                       small
                       :page-size="pageSize"
                       layout="prev, pager, next, jumper, total"
                       :total="total"
                       @current-change="handlePageChange" />
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref, Ref, onActivated, inject, watch, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { $t } from '@/locales/index'
import { debounce } from '@/util/debounce'
import useRecordsDashStore from '@/store/recordsDashStore'
import Empty from '@/components/Empty.vue'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import DashDropMenu from '@/components/DashDropMenu.vue'
import Scrollbar from '@/components/Scrollbar.vue'
import RecordCard from '@/components/RecordCard.vue'

const props = withDefaults(defineProps<{
    type?: 'common' | 'author' | 'recycled'
}>(), {
    type: 'common'
})

const enum FilterKey {
    cover = 0,
    hyperlink,
    basename,
}
const route = useRoute()

const recordsDashStore = useRecordsDashStore()
const dropdownMenus: DashDropMenu[] = [
    {
        HTMLElementTitle: $t('mainContainer.filter'),
        title: '&#xe7e6;',
        items: [
            {
                title: '有封面', divided: false,
                click: () => recordsDashStore.handleFilter(FilterKey.cover), dot: () => recordsDashStore.filter[FilterKey.cover]
            },
            {
                title: '有链接', divided: false,
                click: () => recordsDashStore.handleFilter(FilterKey.hyperlink), dot: () => recordsDashStore.filter[FilterKey.hyperlink]
            },
            {
                title: '有文件', divided: false,
                click: () => recordsDashStore.handleFilter(FilterKey.basename), dot: () => recordsDashStore.filter[FilterKey.basename]
            },
        ]
    },
    {
        HTMLElementTitle: $t('mainContainer.sort'),
        title: '&#xe81f;',
        items: [
            {
                title: $t('mainContainer.time'), divided: false,
                click: () => recordsDashStore.handleSortField('time'), dot: () => recordsDashStore.sortField === 'time'
            },
            {
                title: '名称', divided: false,
                click: () => recordsDashStore.handleSortField('title'), dot: () => recordsDashStore.sortField === 'title'
            },
            {
                title: '评分', divided: false,
                click: () => recordsDashStore.handleSortField('rate'), dot: () => recordsDashStore.sortField === 'rate'
            },
            {
                title: $t('mainContainer.ascending'), divided: true,
                click: () => recordsDashStore.handleOrder('ASC'), dot: () => recordsDashStore.order === 'ASC'
            },
            {
                title: $t('mainContainer.descending'), divided: false,
                click: () => recordsDashStore.handleOrder('DESC'), dot: () => recordsDashStore.order === 'DESC'
            },
        ]
    },
    {
        HTMLElementTitle: '视图',
        title: '&#xe6c7;',
        items: [
            {
                title: '紧凑',
                divided: false,
                click: () => recordsDashStore.handleView('compact'),
                dot: () => recordsDashStore.view === 'compact'
            },
            {
                title: $t('mainContainer.thumbnail'),
                divided: false,
                click: () => recordsDashStore.handleView('thumbnail'),
                dot: () => recordsDashStore.view === 'thumbnail'
            },
            {
                title: $t('mainContainer.extended'),
                divided: false,
                click: () => recordsDashStore.handleView('extended'),
                dot: () => recordsDashStore.view === 'extended'
            },
        ]
    }
]
const scrollbarRef = ref()
const loading = ref<boolean>(false)

const recordRecmds = ref<VO.RecordRecommendation[]>([])
const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>
const keyword = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = 50
const total = ref<number>(200)

// 开启批量操作
const isBatchOperation = ref(false)
const isVisibleCtmItem = ref(false)
const contextMenuOptions = {
    zIndex: 3,
    minWidth: 300,
    x: 500,
    y: 200
}
const openCtm = (e: MouseEvent) => {
    contextMenuOptions.x = e.x
    contextMenuOptions.y = e.y
    isVisibleCtmItem.value = true
}
// 复制信息 复制标题，全部信息，编辑， 删除

const queryRecords = debounce(async () => {
    loading.value = true
    const page = await window.electronAPI.queryRecordRecmds(
        activeLibrary.value,
        {
            type: props.type,
            keyword: keyword.value,
            authorId: route.query.id ? Number(route.query.id) : 0,
            filters: toRaw(recordsDashStore.filter),
            sortField: recordsDashStore.sortField,
            order: recordsDashStore.order,
            pn: currentPage.value,
            ps: pageSize
        }
    )
    recordRecmds.value = page.rows
    total.value = page.total
    loading.value = false
}, 100)
const handlePageChange = (page: number) => {
    currentPage.value = page
    queryRecords()
}
// 由于参数的变化，需要重新查询
const handleQueryParamsChange = function () {
    scrollbarRef.value?.setScrollPosition(0)
    currentPage.value = 1
    queryRecords()
}
// 路由变化，用户可能对记录进行了修改，需要重新查询
watch(route, queryRecords)
watch(() => [recordsDashStore.filter, recordsDashStore.sortField, recordsDashStore.order],
    handleQueryParamsChange,
    { deep: true }
)
watch(() => activeLibrary.value, () => {
    keyword.value = ''
    handleQueryParamsChange()
})
onMounted(handleQueryParamsChange)
</script>

<style scoped>
.batch-processing-btn {
    cursor: pointer;
}

.batch-processing-btn:hover {
    color: var(--echo-theme-color);
}
</style>