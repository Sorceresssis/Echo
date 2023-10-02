<template>
    <div class="flex-col">
        <div class="dashboard__header">
            <div class="right-menu">
                <echo-autocomplete v-model="keyword"
                                   type="tag"
                                   class="menu-item search"
                                   :placeholder="'搜索'"
                                   @keyup.enter="handleQueryParamsChange" />
                <dash-drop-menu v-for="menu in dropdownMenus"
                                class="menu-item"
                                :menu="menu" />
            </div>
        </div>
        <scrollbar v-loading="loading"
                   ref="scrollbarRef"
                   class="dashboard__content scrollbar-y-w8">
            <empty v-if="tags.length === 0" />
            <ul v-else
                class="adaptive-grid">
                <li class="dashboard-text-card"
                    v-for="tag in tags"
                    :key="tag.id">
                    <div>
                        <span>{{ tag.title }}</span>
                        <span class="count">{{ tag.recordCount }}</span>
                    </div>
                    <div class="operate">
                        <span class="iconfont"
                              :title="'复制到剪贴板'"
                              @click="writeClibboard(tag.title)">&#xe85c;</span>
                        <span class="iconfont"
                              :title="'编辑'"
                              @click="editTag(tag.id, tag.title)">&#xe722;</span>
                        <span class="iconfont"
                              :title="'删除'"
                              @click="deleteTag(tag.id)">&#xe636;</span>
                    </div>
                </li>
            </ul>
        </scrollbar>
        <el-pagination v-model:current-page="currentPage"
                       class="dashboard__footer"
                       background
                       small
                       layout="prev, pager, next, jumper, total"
                       :page-size="pageSize"
                       :total="total"
                       @current-change="handlePageChange" />
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, watch, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { $t } from '@/locale'
import { debounce } from '@/util/common'
import { writeClibboard } from '@/util/systemUtil'
import MessageBox from '@/util/MessageBox'
import useTagsDashStore from '@/store/tagsDashStore'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import DashDropMenu from '@/components/DashDropMenu.vue'
import Scrollbar from '@/components/Scrollbar.vue'
import Empty from '@/components/Empty.vue'

const route = useRoute()

const tagsDashStore = useTagsDashStore()
const dropdownMenus = [{
    HTMLElementTitle: $t('mainContainer.sort'),
    title: '&#xe81f;',
    items: [
        {
            title: '标题',
            divided: false,
            click: () => tagsDashStore.handleSortField('title'),
            dot: () => tagsDashStore.sortField === 'title'
        },
        {
            title: $t('mainContainer.time'),
            divided: false,
            click: () => tagsDashStore.handleSortField('time'),
            dot: () => tagsDashStore.sortField === 'time'
        },
        {
            title: $t('mainContainer.ascending'),
            divided: true,
            click: () => tagsDashStore.handleOrder('ASC'),
            dot: () => tagsDashStore.order === 'ASC'
        },
        {
            title: $t('mainContainer.descending'),
            divided: false,
            click: () => tagsDashStore.handleOrder('DESC'),
            dot: () => tagsDashStore.order === 'DESC'
        },
    ]
}]
const scrollbarRef = ref()
const loading = ref<boolean>(false)

const tags = ref<VO.TagDetail[]>([])
const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>
const keyword = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = 50
const total = ref<number>(0)

const deleteTag = (id: number) => {
    MessageBox.deleteConfirm(async () => {
        await window.electronAPI.deleteTag(activeLibrary.value, id)
        queryTags()
    })
}
// TODO 在修改标签时，添加loading, 防止用户操作
const editTag = (id: number, oldValue: string) => {
    MessageBox.editPrompt(async (value: string) => {
        const trimValue = value.trim()
        if (trimValue === '' || trimValue === oldValue) return
        await window.electronAPI.editTag(activeLibrary.value, id, value)
        queryTags()
    }, oldValue)
}
const queryTags = debounce(async () => {
    loading.value = true
    const page = await window.electronAPI.queryTagDetails(
        activeLibrary.value,
        {
            keyword: keyword.value,
            sortField: tagsDashStore.sortField,
            order: tagsDashStore.order,
            pn: currentPage.value,
            ps: pageSize
        }
    )
    total.value = page.total
    tags.value = page.rows
    loading.value = false
}, 100)
const handlePageChange = function (pn: number) {
    scrollbarRef.value?.setScrollPosition(0)
    currentPage.value = pn
    queryTags()
}
const handleQueryParamsChange = function () {
    handlePageChange(1)
}
const init = function () {
    keyword.value = ''
    handleQueryParamsChange()
}
watch(route, queryTags)
watch(() => [tagsDashStore.sortField, tagsDashStore.order], handleQueryParamsChange)
watch(() => activeLibrary.value, init)
onMounted(init)
</script>

<style scoped>
.adaptive-grid {
    row-gap: 8px;
    grid-template-columns: repeat(auto-fill, 350px);
}
</style>