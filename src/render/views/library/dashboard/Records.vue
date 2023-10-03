<template>
    <div class="flex-col">
        <div v-if="isBatch"
             class="dashboard__header divider">
            <div class="left-menu">
                <span class="batch-processing-btn"
                      @click="closeBatch"> 返回 </span>
            </div>
            <div class="right-menu">
                <el-checkbox v-model="isSelectedAll"
                             label="全选"
                             class="batch-processing-btn"
                             @click.prevent="handleCheckAll" />
                <span v-if="props.type !== 'recycled'"
                      class="batch-processing-btn"
                      :class="[selectedSet.size === 0 ? 'disabled' : '']"
                      @click="recycleRecord(...selectedSet)">放入回收站</span>
                <span v-if="props.type === 'recycled'"
                      class="batch-processing-btn"
                      :class="[selectedSet.size === 0 ? 'disabled' : '']"
                      @click="recoverRecord(...selectedSet)"> 恢复 </span>
                <span v-if="props.type === 'recycled'"
                      class="batch-processing-btn"
                      :class="[selectedSet.size === 0 ? 'disabled' : '']"
                      @click="deleteRecord(...selectedSet)"> 删除 </span>
            </div>
        </div>
        <div v-else
             class="dashboard__header">
            <div class="left-menu">
                <div class="batch-processing-btn"
                     @click="isBatch = true">批量操作</div>
                <div v-if="props.type === 'recycled'"
                     class="batch-processing-btn"
                     :class="[recordRecmds.length === 0 ? 'disabled' : '']"
                     @click="deleteAllRecycled">清空回收站</div>
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
                 :class="[`${recordsDashStore.view}-grid`, isBatch ? 'is-batch' : '']">
                <record-card v-for="(recmd, idxRecmd) in recordRecmds"
                             :key="recmd.id"
                             :recmd="recmd"
                             :selected="selectedSet.has(recmd.id)"
                             @contextmenu="openCtm($event, idxRecmd)"
                             @select="handleSelect(recmd.id)">
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
        <context-menu v-model:show="isVisCtm"
                      :options="ctmOptions">
            <context-menu-item :label="'复制标题'"
                               @click="writeClibboard(recordRecmds[idxFocusRecord].title)">
                <template #icon> <span class="iconfont">&#xe85c;</span> </template>
            </context-menu-item>
            <context-menu-item :label="'复制全部信息'"
                               @click="writeClibboard(recordRecmds[idxFocusRecord].title
                                   + '\n' + recordRecmds[idxFocusRecord].authors.map(author => author.name).join(',')
                                   + '\n' + recordRecmds[idxFocusRecord].tags.map(tag => tag.title).join(','))" />
            <context-menu-item :label="'编辑'"
                               @click="router.push(hrefGenerator.libraryEditRecord(activeLibrary, recordRecmds[idxFocusRecord].id))">
                <template #icon> <span class="iconfont">&#xe722;</span> </template>
            </context-menu-item>
            <context-menu-item v-if="props.type !== 'recycled'"
                               label="放入回收站"
                               @click="recycleRecord(recordRecmds[idxFocusRecord].id)">
                <template #icon> <span class="iconfont">&#xe636;</span> </template></context-menu-item>
            <context-menu-item v-if="props.type === 'recycled'"
                               label="恢复"
                               @click="recoverRecord(recordRecmds[idxFocusRecord].id)" />
            <context-menu-item v-if="props.type === 'recycled'"
                               label="删除"
                               @click="deleteRecord(recordRecmds[idxFocusRecord].id)" />
        </context-menu>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref, Ref, inject, watch, toRaw, reactive, onActivated, readonly } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
import hrefGenerator from '@/router/hrefGenerator'
import { $t } from '@/locale'
import { debounce } from '@/util/common'
import { writeClibboard } from '@/util/systemUtil'
import MessageBox from '@/util/MessageBox'
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

const router = useRouter()
const route = useRoute()

const enum FilterKey {
    cover = 0,
    hyperlink,
    basename,
}

const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()
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
                title: '紧凑', divided: false,
                click: () => recordsDashStore.handleView('compact'), dot: () => recordsDashStore.view === 'compact'
            },
            {
                title: $t('mainContainer.thumbnail'), divided: false,
                click: () => recordsDashStore.handleView('thumbnail'), dot: () => recordsDashStore.view === 'thumbnail'
            },
            {
                title: $t('mainContainer.extended'), divided: false,
                click: () => recordsDashStore.handleView('extended'), dot: () => recordsDashStore.view === 'extended'
            },
        ]
    }
]
const scrollbarRef = ref()
const loading = ref<boolean>(false)


const activeLibrary = readonly(inject<Ref<number>>('activeLibrary')!)
const recordRecmds = ref<VO.RecordRecommendation[]>([])
const keyword = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = 50
const total = ref<number>(200)

// ANCHOR 右键菜单
const isVisCtm = ref(false)
const idxFocusRecord = ref(-1)
const ctmOptions = {
    zIndex: 3000,
    minWidth: 300,
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
    MessageBox.confirm(async () => {
        // 提醒其他组件刷新
        viewsTaskAfterRoutingStore.setBashboardRecycled('refresh')

        await window.electronAPI.batchProcessingRecord(activeLibrary.value, 'recycle', ids)
        handleDataChange()
    }, '放入回收站', '确定要放入回收站吗？')
}
// 彻底删除
const deleteRecord = (...ids: number[]) => {
    if (ids.length === 0) return
    MessageBox.deleteConfirm(async () => {
        await window.electronAPI.batchProcessingRecord(activeLibrary.value, 'delete_recycled', ids)
        handleDataChange()
    })
}
const deleteAllRecycled = () => {
    if (recordRecmds.value.length === 0) return
    MessageBox.deleteConfirm(async () => {
        await window.electronAPI.batchProcessingRecord(activeLibrary.value, 'delete_recycled_all')
        handleDataChange()
    })
}
// 恢复
const recoverRecord = (...ids: number[]) => {
    if (ids.length === 0) return
    MessageBox.confirm(async () => {
        // 提醒其他组件刷新
        viewsTaskAfterRoutingStore.setBashboardRecords('refresh')
        viewsTaskAfterRoutingStore.setBashboardAuthors('refresh')

        await window.electronAPI.batchProcessingRecord(activeLibrary.value, 'recover', ids)
        handleDataChange()
    }, '恢复', '确定要恢复吗？')
}
const queryRecords = debounce(async () => {
    loading.value = true
    const page = await window.electronAPI.queryRecordRecmds(
        activeLibrary.value,
        {
            type: props.type,
            keyword: keyword.value,
            authorId: props.type === 'author' ? Number(route.params.authorId) : 0,
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
watch(() => [recordsDashStore.filter, recordsDashStore.sortField, recordsDashStore.order], handleQueryParamsChange, { deep: true })
watch(route, () => {
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
    }
})
onActivated(() => {
    if (props.type === 'common') {
        if (viewsTaskAfterRoutingStore.bashboardRecords === 'refresh') {
            queryRecords()
        }
        viewsTaskAfterRoutingStore.setBashboardRecords('none')
    } else if (props.type === 'author') {
        if (viewsTaskAfterRoutingStore.authorRecords === 'refresh') {
            queryRecords()
        }
        viewsTaskAfterRoutingStore.setAuthorRecords('none')
    } else if (props.type === 'recycled') {
        if (viewsTaskAfterRoutingStore.bashboardRecycled === 'refresh') {
            queryRecords()
        }
        viewsTaskAfterRoutingStore.setBashboardRecycled('none')
    }
})
onMounted(init)
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