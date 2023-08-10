<template>
    <div class="flex-col overflow-hidden">
        <div v-if="isBatchOperation"
             class="dashboard__header">
            <div>
                <button1 @click="isBatchOperation = false">退出,返回</button1>
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
                <el-dropdown v-for="menu in dropdownmenu"
                             :title="menu.HTMLElementTitle"
                             class="menu-item"
                             trigger="click"
                             popper-class="dashboard__dropdown-menu">
                    <button-1><span class="iconfont"
                              v-html="menu.title"></span></button-1>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="item in menu.items"
                                              @click="item.click()"
                                              :divided="item.divided">
                                <span class="emptyFonticon"
                                      :class="[item.dot() ? 'dot' : '']">
                                    {{ item.title }}
                                </span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="dashboard__content scrollbar-y-w8">
            <records-container :records="records"
                               :view="recordsDashStore.view" />
        </div>
        <div class="dashboard__pagination">
            <el-pagination v-model:current-page="currentPage1"
                           layout="prev, pager, next, jumper"
                           :total="200"
                           background
                           small
                           :page-size="20"
                           @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, } from 'vue'
import { $t } from '@locales/index'
import useRecordsDashStore from '@/store/useRecordsDashStore'
import Button1 from '@components/Button1.vue'
import EchoAutocomplete from '@components/EchoAutocomplete.vue'
import RecordsContainer from './RecordsContainer.vue'

const recordsDashStore = useRecordsDashStore()

const enum FilterKey {
    cover = 0,
    hyperlink,
    basename,
}
const dropdownmenu: DashboardDropdownMenu[] = [
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


const currentPage1 = ref(5)
const handleCurrentChange = (val: number) => {
}
</script>

<style scoped></style>