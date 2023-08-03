<template>
    <div class="flex-col overflow-hidden">
        <div v-if="isBatchOperation"
             class="records-header flex-row">
            <div>
                <button1 @click="isBatchOperation = false">退出,返回</button1>
                全选，删除
            </div>
            <div>
                已经选择0个记录
            </div>
        </div>
        <div v-else
             class="records-header flex-row">
            <div class="flex-row">
                <button1 @click="isBatchOperation = true">批量操作</button1>
            </div>
            <div class="flex-row"
                 style="width: 60%; justify-content: flex-end;">
                <echo-autocomplete class="menuItem"
                                   style="width: 50%;"
                                   v-model="s" />
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
                <div class="menuItem">
                    <span class="iconfont"
                          style="background-color: #9999;">&#xe7e6;</span>
                </div>
            </div>
        </div>
        <records-container class="flex-1"
                           :records="records"
                           :view="'thumbnail'" />
    </div>
</template>

<script setup lang='ts'>
import { ref, } from 'vue'
import { $t } from '@locales/index'
import Button1 from '@components/Button1.vue'
import EchoAutocomplete from '@components/EchoAutocomplete.vue'
import RecordsCommon from './RecordsCommon.vue'
import RecordsByAuthor from './RecordsByAuthor.vue'
import RecordsContainer from './RecordsContainer.vue'

const menuDropdowns = [
    {
        HTMLElementTitle: $t('mainContainer.filter'),
        title: '&#xe7e6;',
        menu: [
            { title: $t('mainContainer.noHyperlink'), divided: false, click: 1 },
            { title: $t('mainContainer.noFile'), divided: false, click: 1 },
            { title: $t('mainContainer.noImage'), divided: false, click: 1 },
        ]
    },
    {
        HTMLElementTitle: $t('mainContainer.sort'),
        title: '&#xe81f;',
        menu: [
            { title: $t('mainContainer.time'), divided: false, click: 1 },
            { title: $t('mainContainer.hits'), divided: false, click: 1 },
            { title: $t('mainContainer.title'), divided: false, click: 1 },
            { title: $t('mainContainer.ascending'), divided: true, click: 1 },
            { title: $t('mainContainer.descending'), divided: false, click: 1 },
        ]
    },
    {
        HTMLElementTitle: $t('mainContainer.display'),
        title: '&#xe6c7;',
        menu: [
            { title: $t('mainContainer.thumbnail'), divided: false, click: 1 },
            { title: $t('mainContainer.extended'), divided: false, click: 1 },
        ]
    }
]


// 开启批量操作
const isBatchOperation = ref(false)
const currentPage1 = ref(5)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
}
const handleCurrentChange = (val: number) => {
}
// /******************** 搜索 autoComplete querywords列表********************/
const s = ref<string>('')
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

const records = ref<RecordProfile[]>([])


</script>

<style scoped>
.records-header {
    height: 36px;
    line-height: 36px;
    margin-bottom: 6px;
    justify-content: space-between;
}

:deep(.el-input__wrapper) {
    height: 28px !important;
}

.flex-row {
    align-items: center;
}

.menuItem {
    margin-left: 6px;
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