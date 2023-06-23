<template>
    <div class="flex-col">
        <div>
            <div>
                fgf

            </div>
            <div id="rightMenu">
                <el-autocomplete class="inputSearch"
                                 size="small"
                                 :placeholder="t('mainContainer.universalSearch')"
                                 clearable
                                 v-model="searchWord_all"
                                 :disabled="componentActiveIndex == 3"
                                 :trigger-on-focus="false"
                                 :fetch-suggestions="autoCompSug_all"
                                 @keyup.enter="search"
                                 onfocus="this.select()">
                    <template #default="{ item }">
                        <AutoCompleteSuggestion :item="item"></AutoCompleteSuggestion>
                    </template>
                </el-autocomplete>
                <div :title="t('mainContainer.advancedSearch')"
                     class="el-dropdown">
                    <span class="rightMenuItem iconfont"
                          @click="isVisibleAdvancedSearch = true">
                        &#xe66b;
                    </span>
                </div>
                <div :title="t('mainContainer.manageData')"
                     class="el-dropdown">
                    <span class="rightMenuItem iconfont"
                          @click="isVisibleManageData = true">
                        &#xe7f4;
                    </span>
                </div>
                <el-dropdown :title="t('mainContainer.filter')"
                             trigger="click"
                             popper-class="dropdown">
                    <span class="rightMenuItem iconfont">
                        &#xe7e6;
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="getItemsOption.filterOption[0] = !getItemsOption.filterOption[0]">
                                <span :class="[getItemsOption.filterOption[filterIndex.noHyperlink] ? 'dot' : 'no-dot']">
                                    {{ $t('mainContainer.noHyperlink') }}
                                </span>
                            </el-dropdown-item>
                            <el-dropdown-item @click="getItemsOption.filterOption[1] = !getItemsOption.filterOption[1]">
                                <span :class="[getItemsOption.filterOption[filterIndex.noFile] ? 'dot' : 'no-dot']">
                                    {{ $t('mainContainer.noFile') }}
                                </span>
                            </el-dropdown-item>
                            <el-dropdown-item @click="getItemsOption.filterOption[2] = !getItemsOption.filterOption[2]">
                                <span :class="[getItemsOption.filterOption[filterIndex.noImage] ? 'dot' : 'no-dot']">
                                    {{ $t('mainContainer.noImage') }}
                                </span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-dropdown :title="t('mainContainer.sort')"
                             trigger="click"
                             popper-class="dropdown">
                    <span class="rightMenuItem iconfont">
                        &#xe81f;
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="getItemsOption.orderBy = orderField.time">
                                <span :class="[getItemsOption.orderBy == orderField.time ? 'dot' : 'no-dot']">
                                    {{ $t('mainContainer.time') }}
                                </span>
                            </el-dropdown-item>
                            <el-dropdown-item @click="getItemsOption.orderBy = orderField.hits">
                                <span :class="[getItemsOption.orderBy == orderField.hits ? 'dot' : 'no-dot']">
                                    {{ $t('mainContainer.hits') }}
                                </span>
                            </el-dropdown-item>
                            <el-dropdown-item @click="getItemsOption.orderBy = orderField.title">
                                <span :class="[getItemsOption.orderBy == orderField.title ? 'dot' : 'no-dot']">
                                    {{ $t('mainContainer.title') }}
                                </span>
                            </el-dropdown-item>
                            <el-dropdown-item divided
                                              @click="getItemsOption.isAscending = true">
                                <span :class="[getItemsOption.isAscending ? 'dot' : 'no-dot']">
                                    {{ $t('mainContainer.ascending') }}
                                </span>
                            </el-dropdown-item>
                            <el-dropdown-item @click="getItemsOption.isAscending = false">
                                <span :class="[!getItemsOption.isAscending ? 'dot' : 'no-dot']">
                                    {{ $t('mainContainer.descending') }}
                                </span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-dropdown :title="t('mainContainer.display')"
                             trigger="click"
                             popper-class="dropdown">
                    <span class=" rightMenuItem iconfont">
                        &#xe6c7;
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="displayMode = display.thumbnail">
                                <span :class="[displayMode == display.thumbnail ? 'dot' : 'no-dot']">
                                    {{ $t('mainContainer.thumbnail') }}
                                </span>
                            </el-dropdown-item>
                            <el-dropdown-item @click="displayMode = display.extended">
                                <span :class="[displayMode == display.extended ? 'dot' : 'no-dot']">
                                    {{ $t('mainContainer.extended') }}
                                </span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div id="keywordList"
             v-show="dynamicTags.length != 0 && componentActiveIndex != 3">
            <el-button class="button-new-tag ml-1"
                       size="small"
                       @click="dynamicTags.splice(0)">
                {{ $t('mainContainer.clear') }}
            </el-button>
            <div v-for="tag in dynamicTags"
                 :key="tag"
                 class="keyword">
                {{ tag }}
            </div>
        </div>
        <div class="flex-1">
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, shallowReactive, provide } from 'vue'



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

// /* queryWord列表 */
// let dynamicTags = shallowReactive<string[]>([])
// const handleClose = (tag: string) => {
//     dynamicTags.splice(dynamicTags.indexOf(tag), 1)
// }


// /******************** Items的筛选和展示方式 ********************/
// /* display */
// enum display { thumbnail, extended }
// const displayMode = ref<number>(display.thumbnail)
// provide('displayMode', displayMode)


// /* getItems */
// enum queryType { noQuery = 0, commonQuery, advancedQuery }
// enum filterIndex { noHyperlink = 0, noFile, noImage }
// enum orderField { time = 0, hits, title }
// const getItemsOption = ref<getItemsOption>({
//     queryType: 0,
//     queryWords: '',
//     filterOption: [false, false, false],
//     orderBy: orderField.title,
//     isAscending: true,
//     pageno: 0
// })


// /******************** 对话框 ********************/
// const isVisibleManageData = ref(false)


// const isVisibleAdvancedSearch = ref(false)

</script>

<style scoped>
:deep(.inputSearch) {
    width: 60%;
    min-width: 130px;
    max-width: 320px;
    margin-right: 5px;
}

.input {
    height: 24px;
    border-radius: 12px;
    width: 100px;
    margin: 5px 8px 5px 0;
    background-color: #f0f0f0;
}

.no-dot::before {
    display: inline-block;
    content: " ";
    min-width: 13px;
    margin-right: 3px;
}

.dot::before {
    display: inline-block;
    content: "\e60a";
    font-family: "iconfont" !important;
    min-width: 13px;
    font-size: 13px;
    margin-right: 3px;
    line-height: 13px;
}

#keywordList {
    display: flex;
    /* max-height: 40px; */
    justify-content: left;
    margin: 5px 10px;
    flex-wrap: wrap;
}

.keyword {
    padding: 0 10px;
    line-height: 20px;
    margin: 3px 8px;
    border-radius: 10px;
    background-color: #9e94f7;
    font-size: 13px;
    color: #fff;
}
</style>