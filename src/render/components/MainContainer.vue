<template>
    <div>
        <div id="menu">
            <div id="leftMenu">
                <div v-for="(component, index) in componentData"
                     :class="[componentActiveIndex == index ? 'componentActive' : '']"
                     class="leftMenuItem"
                     @click="switchComponent(index)">
                    {{ component.name }}
                </div>
            </div>
            <div id="rightMenu">
                <el-autocomplete class="inputSearch"
                                 size="small"
                                 :placeholder="i18n.global.t('mainContainer.universalSearch')"
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
                <div :title="i18n.global.t('mainContainer.advancedSearch')"
                     class="el-dropdown">
                    <span class="rightMenuItem iconfont"
                          @click="isVisibleAdvancedSearch = true">
                        &#xe66b;
                    </span>
                </div>
                <div :title="i18n.global.t('mainContainer.manageData')"
                     class="el-dropdown">
                    <span class="rightMenuItem iconfont"
                          @click="isVisibleManageData = true">
                        &#xe7f4;
                    </span>
                </div>
                <el-dropdown :title="i18n.global.t('mainContainer.filter')"
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
                <el-dropdown :title="i18n.global.t('mainContainer.sort')"
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
                <el-dropdown :title="i18n.global.t('mainContainer.display')"
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
        <Suspense>
            <KeepAlive>
                <component id="ItemsContainer"
                           :is="componentActive"
                           :getItemsOption="getItemsOption">
                </component>
            </KeepAlive>
        </Suspense>
        <div>
            <el-dialog v-model="isVisibleAdvancedSearch"
                       align-center
                       :title="i18n.global.t('mainContainer.advancedSearch')"
                       width="400px"
                       class="dialog">
                <div>
                    <div class="dialogCol">
                        <div class="col-title">{{ $t('app.title') }}</div>
                        <el-autocomplete class="col-content"
                                         size="small"
                                         style="width: 240px;"
                                         v-model="searchWord_title"
                                         placeholder="搜索标题"
                                         clearable
                                         fit-input-width
                                         :trigger-on-focus="false"
                                         :fetch-suggestions="autoCompSug_title"
                                         onfocus="this.select()">
                            <template #default="{ item }">
                                <AutoCompleteSuggestion :item="item"></AutoCompleteSuggestion>
                            </template>
                        </el-autocomplete>
                    </div>
                    <div class="dialogCol">
                        <div class="col-title">{{ $t('app.author') }}</div>
                        <el-autocomplete class="col-content"
                                         size="small"
                                         style="width: 240px;"
                                         v-model="searchWord_author"
                                         placeholder="输入作者"
                                         clearable
                                         :trigger-on-focus="false"
                                         :fetch-suggestions="autoCompSug_author"
                                         onfocus="this.select()">
                            <template #default="{ item }">
                                <AutoCompleteSuggestion :item="item"></AutoCompleteSuggestion>
                            </template>
                        </el-autocomplete>
                    </div>
                    <div class="dialogCol">
                        <div class="col-title">{{ $t('app.tag') }}</div>
                        <el-autocomplete class="col-content"
                                         size="small"
                                         v-model="searchWord_tag"
                                         placeholder="输入标签"
                                         clearable
                                         :trigger-on-focus="false"
                                         :fetch-suggestions="autoCompSug_tag"
                                         onfocus="this.select()">
                            <template #default="{ item }">
                                <AutoCompleteSuggestion :item="item"></AutoCompleteSuggestion>
                            </template>
                        </el-autocomplete>
                    </div>
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary"
                                   @click="">
                            {{ $t('opr.search') }}
                        </el-button>
                    </span>
                </template>
            </el-dialog>
            <el-dialog v-model="isVisibleManageData"
                       align-center
                       :title="i18n.global.t('mainContainer.manageData')"
                       width="600px"
                       class="dialog">
                <DialogManageData></DialogManageData>
            </el-dialog>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { inject, ref, Ref, shallowReactive, shallowRef, watch, onMounted, provide } from 'vue';
import { useRoute } from 'vue-router'
import i18n from '../locales/index'
import { autoCompleteType } from '../store/enum'
import ItemsContainerCommon from './ItemsContainerCommon.vue'
import ItemsContainerByAuthor from './ItemsContainerByAuthor.vue'
import ItemsContainerOfFav from './ItemsContainerOfFav.vue'
import ItemsTagFolderList from './ItemsTagFolderList.vue'
import AutoCompleteSuggestion from './AutoCompleteSuggestion.vue'
import DialogManageData from './DialogManageData.vue';
const route = useRoute()
const activeLibrary = inject<Ref<library>>('activeLibrary') as Ref<library>

// 第一次启动，更新activeLibrary
onMounted(() => {
    activeLibrary.value = { id: parseInt(route.query.id as string), name: route.query.name as string }
    // 改网页标题
    document.title = activeLibrary.value.name == '' ? 'Echo' : activeLibrary.value.name + " - Echo";
})
// 参数变化，跟新activeLibrary
watch(() => route.query.id, () => {
    activeLibrary.value = { id: parseInt(route.query.id as string), name: route.query.name as string }
    // 改网页标题
    document.title = activeLibrary.value.name == '' ? 'Echo' : activeLibrary.value.name + " - Echo";
    switchComponent(0)
    // TODO 清空搜索词
})

/******************** 组件切换 ********************/
const componentActive = shallowRef<any>(ItemsContainerCommon)
const componentActiveIndex = ref(0)
const componentData = shallowReactive([
    { name: i18n.global.t('app.item'), component: ItemsContainerCommon },
    { name: i18n.global.t('app.author'), component: ItemsContainerByAuthor },
    // { name: i18n.global.t('mainContainer.fav'), component: ItemsContainerOfFav },
    { name: i18n.global.t('mainContainer.infoList'), component: ItemsTagFolderList },
    { name: '回收站', component: '' }
])
function switchComponent(index: number) {
    componentActive.value = componentData[index].component
    componentActiveIndex.value = index
}

/******************** 搜索 autoComplete querywords列表********************/
/* 通用搜索 */
const searchWord_all = ref<string>('')
const autoCompSug_all = (queryString: string, cb: any) => { window.electronAPI.libraryAutoComplete(activeLibrary.value.id, autoCompleteType.ALL, queryString, 20).then((a) => { cb(a) }) }

/* 高级搜索 */
const searchWord_title = ref<string>('')
const autoCompSug_title = (queryString: string, cb: any) => { window.electronAPI.libraryAutoComplete(activeLibrary.value.id, autoCompleteType.ITEM_TITLE, queryString, 20).then((a) => { cb(a) }) }
const searchWord_author = ref<string>('')
const autoCompSug_author = (queryString: string, cb: any) => { window.electronAPI.libraryAutoComplete(activeLibrary.value.id, autoCompleteType.AUTHOR_NAME, queryString, 20).then((a) => { cb(a) }) }
const searchWord_tag = ref<string>('')
const autoCompSug_tag = (queryString: string, cb: any) => { window.electronAPI.libraryAutoComplete(activeLibrary.value.id, autoCompleteType.TAG_TITLE, queryString, 20).then((a) => { cb(a) }) }

const search = async (type: number) => {
    if (searchWord_all.value != '') {
        dynamicTags.splice(0, dynamicTags.length, ...searchWord_all.value.trim().split(/\s+/))
    }
}

/* queryWord列表 */
let dynamicTags = shallowReactive<string[]>([])
const handleClose = (tag: string) => {
    dynamicTags.splice(dynamicTags.indexOf(tag), 1)
}


/******************** Items的筛选和展示方式 ********************/
/* display */
enum display { thumbnail, extended }
const displayMode = ref<number>(display.thumbnail)
provide('displayMode', displayMode)


/* getItems */
enum queryType { noQuery = 0, commonQuery, advancedQuery }
enum filterIndex { noHyperlink = 0, noFile, noImage }
enum orderField { time = 0, hits, title }
const getItemsOption = ref<getItemsOption>({
    queryType: 0,
    queryWords: '',
    filterOption: [false, false, false],
    orderBy: orderField.title,
    isAscending: true,
    pageno: 0
})


/******************** 对话框 ********************/
const isVisibleManageData = ref(false)


const isVisibleAdvancedSearch = ref(false)
</script>

<style scoped>
#menu {
    display: flex;
    margin: 6px 10px;
    justify-content: space-between;
}

#leftMenu {
    display: flex;
    justify-content: left;
    align-items: center;
}

.leftMenuItem {
    height: 22px;
    margin-right: 30px;
    cursor: pointer;
}

.leftMenuItem:hover {
    color: #9e94f7;
}

.componentActive {
    color: #9e94f7;
    border-bottom: solid 3px #9e94f7;
}

#rightMenu {
    display: flex;
    width: 50%;
    justify-content: right;
    align-items: center;
}

.rightMenuItem {
    background-color: #fff;
    padding: 4px;
    margin: 3px;
    border-radius: 4px;
    border: 2px solid #dedee0;
    cursor: pointer;
    font-size: 16px;
}

.rightMenuItem:hover {
    background-color: #d9d9d9;
}

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

#ItemsContainer {
    flex: 1;
    overflow: hidden;
    display: flex;
}
</style>