<template>
    <div>
        <div id="libraryName">{{ route.query.name }}</div>
        <div id="menu">
            <div id="leftMenu">
                <div v-for="(component, index) in componentData"
                     :class="[componentActiveIndex == index ? 'componentActive' : '']"
                     class="leftMenuItem"
                     @click="switchComponent(index)">{{
                         component.name
                     }}</div>
            </div>
            <div id="rightMenu">
                <el-autocomplete class="inputSearch"
                                 size="small"
                                 :placeholder="i18n.global.t('mainContainer.universalSearch')"
                                 clearable
                                 v-model="searchWord"
                                 :disabled="componentActiveIndex == 3"
                                 :trigger-on-focus="false"
                                 :fetch-suggestions="querySearchAsync"
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
                          @click="isVisibleDialogAdd = true">
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
                                <span v-if="getItemsOption.filterOption[filterIndex.noHyperlink]"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                {{ $t('mainContainer.noHyperlink') }}
                            </el-dropdown-item>
                            <el-dropdown-item @click="getItemsOption.filterOption[1] = !getItemsOption.filterOption[1]">
                                <span v-if="getItemsOption.filterOption[filterIndex.noFile]"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                {{ $t('mainContainer.noFile') }}
                            </el-dropdown-item>
                            <el-dropdown-item @click="getItemsOption.filterOption[2] = !getItemsOption.filterOption[2]">
                                <span v-if="getItemsOption.filterOption[filterIndex.noImage]"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                {{ $t('mainContainer.noImage') }}
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
                                <span v-if="getItemsOption.orderBy == orderField.time"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                {{ $t('mainContainer.time') }}
                            </el-dropdown-item>
                            <el-dropdown-item @click="getItemsOption.orderBy = orderField.hits">
                                <span v-if="getItemsOption.orderBy == orderField.hits"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                {{ $t('mainContainer.hits') }}
                            </el-dropdown-item>
                            <el-dropdown-item @click="getItemsOption.orderBy = orderField.title">
                                <span v-if="getItemsOption.orderBy == orderField.title"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                {{ $t('mainContainer.title') }}
                            </el-dropdown-item>
                            <el-dropdown-item divided
                                              @click="getItemsOption.isAscending = true">
                                <span v-if="getItemsOption.isAscending"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                升序</el-dropdown-item>
                            <el-dropdown-item @click="getItemsOption.isAscending = false">
                                <span v-if="!getItemsOption.isAscending"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                降序 </el-dropdown-item>
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
                                <span v-if="displayMode == display.thumbnail"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                {{ $t('mainContainer.thumbnail') }}
                            </el-dropdown-item>
                            <el-dropdown-item @click="displayMode = display.extended">
                                <span v-if="displayMode == display.extended"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                {{ $t('mainContainer.extended') }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div id="keywordList"
             v-show="dynamicTags.length != 0 && componentActiveIndex != 3">
            <el-button class="button-new-tag ml-1 input"
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
                       width="500px"
                       class="dialog">
                <div id="advancedSearch">
                    <div>
                        <div>item标题</div>
                        <el-autocomplete class="inputSearch"
                                         size="small"
                                         placeholder="输入啊"
                                         clearable
                                         v-model="searchWord"
                                         :disabled="componentActiveIndex == 3"
                                         :trigger-on-focus="false"
                                         :fetch-suggestions="querySearchAsync"
                                         @keyup.enter="search"
                                         onfocus="this.select()">
                            <template #default="{ item }">
                                <AutoCompleteSuggestion :item="item"></AutoCompleteSuggestion>
                            </template>
                        </el-autocomplete>
                    </div>
                    <div>
                        <div>作者</div>
                        <el-autocomplete class="inputSearch"
                                         size="small"
                                         placeholder="输入啊"
                                         clearable
                                         v-model="searchWord"
                                         :disabled="componentActiveIndex == 3"
                                         :trigger-on-focus="false"
                                         :fetch-suggestions="querySearchAsync"
                                         @keyup.enter="search"
                                         onfocus="this.select()">
                            <template #default="{ item }">
                                <AutoCompleteSuggestion :item="item"></AutoCompleteSuggestion>
                            </template>
                        </el-autocomplete>
                    </div>
                    <div>
                        <div>标签</div>
                        <el-autocomplete class="inputSearch"
                                         size="small"
                                         placeholder="输入啊"
                                         clearable
                                         v-model="searchWord"
                                         :disabled="componentActiveIndex == 3"
                                         :trigger-on-focus="false"
                                         :fetch-suggestions="querySearchAsync"
                                         @keyup.enter="search"
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
                            反对法
                        </el-button>
                    </span>
                </template>
            </el-dialog>
            <el-dialog v-model="isVisibleDialogAdd"
                       align-center
                       :title="i18n.global.t('mainContainer.manageData')"
                       width="500px"
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
    { name: i18n.global.t('mainContainer.item'), component: ItemsContainerCommon },
    { name: i18n.global.t('mainContainer.author'), component: ItemsContainerByAuthor },
    { name: i18n.global.t('mainContainer.fav'), component: ItemsContainerOfFav },
    { name: i18n.global.t('mainContainer.infoList'), component: ItemsTagFolderList }
])
function switchComponent(index: number) {
    componentActive.value = componentData[index].component
    componentActiveIndex.value = index
}

/******************** 搜索 autoComplete querywords列表********************/
/* 通用搜索 */

// ALL 不包含Folder
enum getAttributeType { ITEM_TITLE = 0, AUTHOR_NAME, TAG_TITLE, FOLDER_PATH, ALL }
const searchWord = ref('')
const querySearchAsync = (queryString: string, cb: any) => {
    window.electronAPI.getAttribute(activeLibrary.value.id, getAttributeType.ALL, queryString, 0, 20).then((a) => {
        cb(a)
    })
}
const search = async () => {
    if (searchWord.value != '') {
        dynamicTags.splice(0, dynamicTags.length, ...searchWord.value.trim().split(/\s+/))
    }
}
/* 高级搜索 */


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
const isVisibleDialogAdd = ref(false)


const isVisibleAdvancedSearch = ref(false)
</script>

<style scoped>
#libraryName {
    margin: 0 10px;
    font-size: 30px;
    font-weight: 700;
}

#menu {
    display: flex;
    margin: 10px;
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
    padding-right: 8px;
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
    height: 24px;
    font-size: 14px;
    margin: 5px 10px 5px 0;
}

:deep(.inputSearch .el-input__wrapper) {
    border-radius: 5px;
    font-size: 14px;
    background-color: #f0f0f0;
}

:deep(.inputSearch .is-focus) {
    box-shadow: 0 0 0 1px #9e94f7 inset;
}

.input {
    height: 24px;
    border-radius: 12px;
    width: 100px;
    margin: 5px 8px 5px 0;
    background-color: #f0f0f0;
}

#keywordList {
    display: flex;
    justify-content: left;
    margin: 5px 10px;
    flex-wrap: wrap;
}

.keyword {
    background-color: #9e94f7;
    font-size: 14px;
    margin: 5px 8px;
    color: #fff;
}

#ItemsContainer {
    flex: 1;
    overflow: hidden;
    display: flex;
}

#advancedSearch {
    padding: 20px 0;
}
</style>