<template>
    <div class="flex-col">
        <div class="dashboard__header">
            <div class="right-menu">
                <echo-autocomplete v-model="search"
                                   type="tag"
                                   class="menu-item"
                                   :placeholder="'搜索'" />
                <dash-drop-menu :menu="dropdownMenu"
                                class="menu-item" />
            </div>
        </div>
        <div class="dashboard__content scrollbar-y-w8">
            <empty v-if="tags.length === 0" />
            <ul v-else
                class="adaptive-grid">
                <li class="dashboard-text-card"
                    v-for="tag in tags"
                    :key="tag.id">
                    <div>
                        <span>{{ tag.value }}</span>
                        <span class="count">{{ tag.count }}</span>
                    </div>
                    <div class="operate">
                        <span class="iconfont"
                              :title="'复制到剪贴板'"
                              @click="writeClibboard(tag.value)">&#xe85c;</span>
                        <span class="iconfont"
                              :title="'编辑'"
                              @click="editTag(tag.id, tag.value)">&#xe722;</span>
                        <span class="iconfont"
                              :title="'删除'"
                              @click="deleteTag(tag.id)">&#xe636;</span>
                    </div>
                </li>
            </ul>
        </div>
        <el-pagination v-model:current-page="currentPage"
                       class="dashboard__footer"
                       background
                       small
                       :page-size="pageSize"
                       layout="prev, pager, next, jumper, total"
                       :total="total" />
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, watch, onMounted, inject } from 'vue'
import { writeClibboard } from '@/util/systemUtil'
import { deleteConfirm, editPrompt } from '@/util/ADEMessageBox'
import { $t } from '@/locales/index'
import useTagsDashStore from '@/store/useTagsDashStore'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import DashDropMenu from '@/components/DashDropMenu.vue'
import Empty from '@/components/Empty.vue'

const tagsDashStore = useTagsDashStore()
const dropdownMenu = {
    HTMLElementTitle: $t('mainContainer.sort'),
    title: '&#xe81f;',
    items: [
        {
            title: $t('mainContainer.time'),
            divided: false,
            click: () => tagsDashStore.handleSortField('date'),
            dot: () => tagsDashStore.sortField === 'date'
        },
        {
            title: '文本',
            divided: false,
            click: () => tagsDashStore.handleSortField('text'),
            dot: () => tagsDashStore.sortField === 'text'
        },
        {
            title: $t('mainContainer.ascending'),
            divided: true,
            click: () => tagsDashStore.handleAsc(true),
            dot: () => tagsDashStore.asc
        },
        {
            title: $t('mainContainer.descending'),
            divided: false,
            click: () => tagsDashStore.handleAsc(false),
            dot: () => !tagsDashStore.asc
        },
    ]
}
const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>
const pageSize = 50
const tags = ref<VO.TextAttribute[]>([])

const search = ref<string>('')
const currentPage = ref<number>(1)
const total = ref<number>(0)
watch(() => [activeLibrary.value, currentPage.value, tagsDashStore.sortField, tagsDashStore.asc], () => {
    queryTags()
})
const deleteTag = (id: number) => {
    deleteConfirm(async () => {
        await window.electronAPI.deleteTag(activeLibrary.value, id)
        queryTags()
    })
}
const editTag = (id: number, oldValue: string) => {
    editPrompt(async (value: string) => {
        await window.electronAPI.editTag(activeLibrary.value, id, value)
        queryTags()
    }, oldValue)
}
const queryTags = async () => {
    const resp = await window.electronAPI.queryTags(
        activeLibrary.value,
        {
            queryWork: search.value,
            sortField: tagsDashStore.sortField,
            asc: tagsDashStore.asc,
            pn: currentPage.value,
            ps: pageSize
        }
    )
    tags.value = resp.data
    total.value = resp.total
    // 滚动到顶部
    document.querySelector('.dashboard__content')?.scrollTo(0, 0)
}

onMounted(() => {
    queryTags()
})
</script>

<style scoped>
.adaptive-grid {
    row-gap: 8px;
    grid-template-columns: repeat(auto-fill, 350px);
}
</style>