<template>
    <div class="flex-col overflow-hidden">
        <div class="records-header flex-row">
            <div class="flex-row">
                批量操作
            </div>
            <div class="flex-row">
                <el-autocomplete>
                    <template #default="{ item }">
                        <AutoCompleteSuggestion :item="item"></AutoCompleteSuggestion>
                    </template>
                </el-autocomplete>
                <button1 :title="t('mainContainer.advancedSearch')"
                         class="menuItem menuItem-marginLeft">
                    <span class="iconfont">
                        &#xe66b;
                    </span>
                </button1>
                <el-dropdown v-for="dropdown in menuDropdowns"
                             :title="dropdown.HTMLElementTitle"
                             class="menuItem"
                             trigger="click"
                             popper-class="dropdown">
                    <button-1><span class="iconfont"
                              v-html="dropdown.title"></span></button-1>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="item in dropdown.menu"
                                              @click="item.click"
                                              :divided="item.divided">
                                <span :class="[true ? 'dot' : '']"
                                      class="beforeIcon">
                                    {{ item.title }}
                                </span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <span class="menuItem iconfont">&#xe6c7;</span>
                <span class="menuItem iconfont">&#xe81f;</span>
                <div class="menuItem">
                    <span class="iconfont"
                          style="background-color: #9999;">&#xe7e6;</span>
                </div>
            </div>
        </div>
        <records-container class="flex-1"
                           :records="records"
                           :view="'thumbnail'" />
        <div class="flex-center">
            <el-pagination v-model:current-page="currentPage1"
                           :page-size="10"
                           :small="small"
                           layout="prev, pager, next"
                           :total="10000"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, } from 'vue'
import { t } from '../../../locales'
import Button1 from '../../../components/Button1.vue'
import RecordsCommon from './RecordsCommon.vue'
import RecordsByAuthor from './RecordsByAuthor.vue'
import RecordsContainer from './RecordsContainer.vue'

const menuDropdowns = [
    {
        HTMLElementTitle: t('mainContainer.filter'),
        title: '&#xe7e6;',
        menu: [
            { title: t('mainContainer.noHyperlink'), divided: false, click: 1 },
            { title: t('mainContainer.noFile'), divided: false, click: 1 },
            { title: t('mainContainer.noImage'), divided: false, click: 1 },
        ]
    },
    {
        HTMLElementTitle: t('mainContainer.sort'),
        title: '&#xe81f;',
        menu: [
            { title: t('mainContainer.time'), divided: false, click: 1 },
            { title: t('mainContainer.hits'), divided: false, click: 1 },
            { title: t('mainContainer.title'), divided: false, click: 1 },
            { title: t('mainContainer.ascending'), divided: true, click: 1 },
            { title: t('mainContainer.descending'), divided: false, click: 1 },
        ]
    },
    {
        HTMLElementTitle: t('mainContainer.display'),
        title: '&#xe6c7;',
        menu: [
            { title: t('mainContainer.thumbnail'), divided: false, click: 1 },
            { title: t('mainContainer.extended'), divided: false, click: 1 },
        ]
    }
]



const currentPage1 = ref(5)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
}
const handleCurrentChange = (val: number) => {
}
// /******************** 搜索 autoComplete querywords列表********************/
// /* 通用搜索 */
// const searchWord_all = ref<string>('')
// const autoCompSug_all = (queryString: string, cb: any) => { window.electronAPI.libraryAutoComplete(activeLibrary.value.id, autoCompleteType.ALL, queryString, 20).then((a) => { cb(a) }) }

// /* 高级搜索 */
// const searchWord_title = ref<string>('')
// const autoCompSug_title = (queryString: string, cb: any) => { window.electronAPI.libraryAutoComplete(activeLibrary.value.id, autoCompleteType.ITEM_TITLE, queryString, 20).then((a) => { cb(a) }) }
// const searchWord_author = ref<string>('')
// const autoCompSug_author = (queryString: string, cb: any) => { window.electronAPI.libraryAutoComplete(activeLibrary.value.id, autoCompleteType.AUTHOR_NAME, queryString, 20).then((a) => { cb(a) }) }
// const searchWord_tag = ref<string>('')
// const autoCompSug_tag = (queryString: string, cb: any) => { window.electronAPI.libraryAutoComplete(activeLibrary.value.id, autoCompleteType.TAG_TITLE, queryString, 20).then((a) => { cb(a) }) }

// const search = async (type: number) => {
//     if (searchWord_all.value != '') {
//         dynamicTags.splice(0, dynamicTags.length, ...searchWord_all.value.trim().split(/\s+/))
//     }
// }


/******************** Items的筛选和展示方式 ********************/

const records = ref<RecordProfile[]>([
    {
        id: 1,
        title: 'title',
        rate: 4,
        hyperlink: 'fdfdf',
        hasCoverImage: true,
        tags: ['tag1', 'tag2'],
        authors: [
            { id: 1, name: 'author1' },
            { id: 2, name: 'author2' },
        ]
    },
    {
        id: 2,
        title: 'title',
        rate: 4,
        hyperlink: 'fdfdf',
        hasCoverImage: true,
        tags: ['tag1', 'tag2'],
        authors: [
            { id: 1, name: 'author1' },
            { id: 2, name: 'author2' },
        ]
    },
    {
        id: 3,
        title: 'title',
        rate: 4,
        hyperlink: 'fdfdf',
        hasCoverImage: true,
        tags: ['tag1', 'tag2'],
        authors: [
            { id: 1, name: 'author1' },
            { id: 2, name: 'author2' },
        ]
    },
    {
        id: 4,
        title: 'title',
        rate: 4,
        hyperlink: 'fdfdf',
        hasCoverImage: true,
        tags: ['tag1', 'tag2'],
        authors: [
            { id: 1, name: 'author1' },
            { id: 2, name: 'author2' },
        ]
    },
    {
        id: 5,
        title: 'title',
        rate: 4,
        hyperlink: 'fdfdf',
        hasCoverImage: true,
        tags: ['tag1', 'tag2'],
        authors: [
            { id: 1, name: 'author1' },
            { id: 2, name: 'author2' },
        ]
    },
    {
        id: 6,
        title: 'title',
        rate: 4,
        hyperlink: 'fdfdf',
        hasCoverImage: true,
        tags: ['tag1', 'tag2'],
        authors: [
            { id: 1, name: 'author1' },
            { id: 2, name: 'author2' },
        ]
    },
    {
        id: 7,
        title: 'title',
        rate: 4,
        hyperlink: 'fdfdf',
        hasCoverImage: true,
        tags: ['tag1', 'tag2'],
        authors: [
            { id: 1, name: 'author1' },
            { id: 2, name: 'author2' },
        ]
    },
    {
        id: 8,
        title: 'title',
        rate: 4,
        hyperlink: 'fdfdf',
        hasCoverImage: true,
        tags: ['tag1', 'tag2'],
        authors: [
            { id: 1, name: 'author1' },
            { id: 2, name: 'author2' },
        ]
    }
])

</script>

<style scoped>
.records-header {
    height: 36px;
    line-height: 36px;
    margin: 6px 0;
    justify-content: space-between;
}

.flex-row {
    align-items: center;
}

.menuItem {
    margin: 0 3px;
}

.menuItem-marginLeft {
    margin-left: 10px;
}

.dot::before {
    content: '\e60a';
    font-family: "iconfont" !important;
    font-size: 13px;
    line-height: 13px;
}


:deep(.el-pager li) {
    font-size: 14px;
}
</style>