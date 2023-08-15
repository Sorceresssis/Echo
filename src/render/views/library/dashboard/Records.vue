<template>
    <div class="flex-col">
        <div v-if="isBatchOperation"
             class="dashboard__header">
            <div>
                <span @click="isBatchOperation = false">退出,返回</span>
                全选，删除
            </div>
            <div>
            </div>
        </div>
        <div v-else
             class="dashboard__header">
            <div class="left-menu">
                <div @click="isBatchOperation = true">批量操作</div>
            </div>
            <div class="right-menu">
                <echo-autocomplete class="menu-item"
                                   v-model="s"
                                   :placeholder="'搜索'" />
                <dash-drop-menu v-for="menu in dropdownMenus"
                                :menu="menu"
                                class="menu-item" />
            </div>
        </div>
        <div class="dashboard__content scrollbar-y-w8">
            <records-container :records="records"
                               :view="recordsDashStore.view" />
        </div>
        <el-pagination v-model:current-page="currentPage"
                       class="dashboard__footer"
                       background
                       small
                       :page-size="pageSize"
                       layout="prev, pager, next, jumper"
                       :total="total"
                       @current-change="" />
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref, } from 'vue'
import { $t } from '@locales/index'
import { useRoute } from 'vue-router'
import useRecordsDashStore from '@/store/useRecordsDashStore'
import EchoAutocomplete from '@components/EchoAutocomplete.vue'
import DashDropMenu from '@/components/DashDropMenu.vue'
import RecordsContainer from './RecordsContainer.vue'

const enum FilterKey {
    cover = 0,
    hyperlink,
    basename,
}
const pageSize = 20
const total = ref(200)
const recordsDashStore = useRecordsDashStore()
const route = useRoute()
const dropdownMenus: DashDropMenu[] = [
    {
        HTMLElementTitle: $t('mainContainer.filter'),
        title: '&#xe7e6;',
        items: [
            {
                title: '有封面',
                divided: false,
                click: () => recordsDashStore.handleFilter(FilterKey.cover),
                dot: () => recordsDashStore.filter[FilterKey.cover]
            },
            {
                title: '有链接',
                divided: false,
                click: () => recordsDashStore.handleFilter(FilterKey.hyperlink),
                dot: () => recordsDashStore.filter[FilterKey.hyperlink]
            },
            {
                title: '有文件',
                divided: false,
                click: () => recordsDashStore.handleFilter(FilterKey.basename),
                dot: () => recordsDashStore.filter[FilterKey.basename]
            },
        ]
    },
    {
        HTMLElementTitle: $t('mainContainer.sort'),
        title: '&#xe81f;',
        items: [
            {
                title: $t('mainContainer.time'),
                divided: false,
                click: () => recordsDashStore.handleSortField('date'),
                dot: () => recordsDashStore.sortField === 'date'
            },
            {
                title: '名称',
                divided: false,
                click: () => recordsDashStore.handleSortField('title'),
                dot: () => recordsDashStore.sortField === 'title'
            },
            {
                title: '评分',
                divided: false,
                click: () => recordsDashStore.handleSortField('rate'),
                dot: () => recordsDashStore.sortField === 'rate'
            },
            {
                title: $t('mainContainer.ascending'),
                divided: true,
                click: () => recordsDashStore.handleAsc(true),
                dot: () => recordsDashStore.asc
            },
            {
                title: $t('mainContainer.descending'),
                divided: false,
                click: () => recordsDashStore.handleAsc(false),
                dot: () => !recordsDashStore.asc
            },
        ]
    },
    {
        HTMLElementTitle: '视图',
        title: '&#xe6c7;',
        items: [
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
onMounted(() => {
    // 读取作者参数 id
})
// sort attribute order

// 开启批量操作
const isBatchOperation = ref(false)
// /******************** 搜索 autoComplete querywords列表********************/
const s = ref<string>('')
/******************** Items的筛选和展示方式 ********************/

const records = ref<any[]>([
    {
        id: 1,
        title: '1',
        rate: 5,
        hyperlink: 'www',
        imag: 'file://F:/Desktop/images/2.jpg',
        tags: [
            'fdf',
            'fdf',
            'fdf',
        ],
        authors: {
            id: 1,
            name: 'fdf',
        }
    },
])


const currentPage = ref(5)
const handleCurrentChange = (val: number) => {
}
</script>

<style scoped></style>