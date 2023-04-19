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
                                 placeholder="通用搜索"
                                 clearable
                                 v-model="searchWord"
                                 value-key="suggest"
                                 :disabled="componentActiveIndex == 3"
                                 :trigger-on-focus="false"
                                 :fetch-suggestions="querySearchAsync"
                                 @keyup.enter="search"
                                 onfocus="this.select()" />
                <span class="iconfont rightMenuItem"
                      title="高级搜索">
                    &#xe66b;
                </span>
                <span class="iconfont rightMenuItem"
                      title="添加"
                      @click="isVisibleDialogAdd = true">
                    &#xe68c;
                </span>
                <span class="iconfont rightMenuItem"
                      @click="">
                    &#xe8e2;
                </span>
                <el-dropdown title="筛选"
                             trigger="click"
                             popper-class="dropdown">
                    <span class=" rightMenuItem iconfont">
                        &#xe7e6;
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="getItemsInfo.filter[0] = !getItemsInfo.filter[0]">
                                <span v-if="getItemsInfo.filter[filterIndex.noHyperlink]"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                无链接
                            </el-dropdown-item>
                            <el-dropdown-item @click="getItemsInfo.filter[1] = !getItemsInfo.filter[1]">
                                <span v-if="getItemsInfo.filter[filterIndex.noFile]"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                无源文件
                            </el-dropdown-item>
                            <el-dropdown-item @click="getItemsInfo.filter[2] = !getItemsInfo.filter[2]">
                                <span v-if="getItemsInfo.filter[filterIndex.noImage]"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                无封面
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-dropdown title="排序"
                             trigger="click"
                             popper-class="dropdown">
                    <span class=" rightMenuItem iconfont">
                        <span class="iconfont">&#xe81f;</span>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="getItemsInfo.orderBy = orderField.title">
                                <span v-if="getItemsInfo.orderBy == orderField.title"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                标题
                            </el-dropdown-item>
                            <el-dropdown-item @click="getItemsInfo.orderBy = orderField.click">
                                <span v-if="getItemsInfo.orderBy == orderField.click"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                点击量
                            </el-dropdown-item>
                            <el-dropdown-item @click="getItemsInfo.orderBy = orderField.date">
                                <span v-if="getItemsInfo.orderBy == orderField.date"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                时间
                            </el-dropdown-item>
                            <el-dropdown-item divided
                                              @click="getItemsInfo.ascending = 0">
                                <span v-if="getItemsInfo.ascending == 0"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                降序 </el-dropdown-item>
                            <el-dropdown-item @click="getItemsInfo.ascending = 1">
                                <span v-if="getItemsInfo.ascending == 1"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                升序</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-dropdown title="展示"
                             trigger="click"
                             popper-class="dropdown">
                    <span class=" rightMenuItem iconfont">
                        <span class="iconfont">&#xe7f4;</span>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="displayMode = display.thumbnail">
                                <span v-if="displayMode == display.thumbnail"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                缩略图
                            </el-dropdown-item>
                            <el-dropdown-item @click="displayMode = display.extended">
                                <span v-if="displayMode == display.extended"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span> 扩展列表
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
                清空
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
                           :getItemsInfo="getItemsInfo">
                </component>
            </KeepAlive>
        </Suspense>
        <el-dialog v-model="isVisibleDialogAdd"
                   align-center
                   title="添加"
                   width="500px"
                   class="dialog">
            <DialogAdd></DialogAdd>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary"
                               :class="{}"
                               @click="isVisibleDialogAdd = false">
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
  
<script lang="ts" setup>
import { inject, ref, Ref, shallowReactive, shallowRef, watch, onMounted, provide } from 'vue';
import { useRoute } from 'vue-router'
import { debounce } from '../util/debounce';
import ItemsContainerCommon from './ItemsContainerCommon.vue'
import ItemsContainerByAuthor from './ItemsContainerByAuthor.vue'
import ItemsContainerOfFav from './ItemsContainerOfFav.vue'
import ItemsInfoList from './ItemsInfoList.vue'
import DialogAdd from './DialogAdd.vue';

const route = useRoute()
const activeLibrary = inject<Ref<library>>('activeLibrary') as Ref<library>

// 第一次启动，更新activeLibrary
onMounted(() => {
    activeLibrary.value = { id: parseInt(route.query.id as string), name: route.query.name as string }
})
// 参数变化，跟新activeLibrary
watch(() => route.query.id, () => {
    activeLibrary.value = { id: parseInt(route.query.id as string), name: route.query.name as string }
    switchComponent(0)
    // TODO 清空搜索词
})


/******************** 组件切换 ********************/
const componentActive = shallowRef<any>(ItemsContainerCommon)
const componentActiveIndex = ref(0)
const componentData = shallowReactive([
    { name: '资源', component: ItemsContainerCommon },
    { name: '作者', component: ItemsContainerByAuthor },
    { name: '喜欢', component: ItemsContainerOfFav },
    { name: '信息列表', component: ItemsInfoList }
])
function switchComponent(index: number) {
    componentActive.value = componentData[index].component
    componentActiveIndex.value = index
}

/******************** 通用搜索 ********************/
enum AttributeItem {
    // ALL 不包含folder_path
    item_title, author_name, tag_title, folder_path, All
}
const searchWord = ref('')
const querySearchAsync = (queryString: string, cb: any) => {
    window.electronAPI.getAttributeItem(1, AttributeItem.All, 0, 12, queryString.trim().split(/\s+/)).then((a) => {
        cb(a)
    })
}
const search = async () => {
    if (searchWord.value != '') {
        dynamicTags.splice(0, dynamicTags.length, ...searchWord.value.trim().split(/\s+/))
    }
}

/******************** Items的筛选和展示方式 ********************/
// display
enum display { thumbnail, extended }
const displayMode = ref<number>(display.thumbnail)
provide('displayMode', displayMode)

// getItems
enum getItemsType { noQuery, query, fd }
enum filterIndex { noHyperlink = 0, noFile, noImage }
enum orderField { title, click, date }
const getItemsInfo = ref({
    type: getItemsType.noQuery,
    itemsQuery: [],
    itemsQueryTitle: [],
    itemsQueryAuthor: [],
    itemsQueryTag: [],
    // 有链接，文件夹
    filter: [false, false, false],
    orderBy: orderField.title,
    ascending: 0
})
// TODO 读取记录 display
watch(getItemsInfo, debounce((newValue) => {

}, 200), {
    deep: true
})


/******************** 对话框 ********************/
const isVisibleDialogAdd = ref(false)




/******************** keywords列表 ********************/
let dynamicTags = shallowReactive<string[]>([])
const handleClose = (tag: string) => {
    dynamicTags.splice(dynamicTags.indexOf(tag), 1)
}
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
    font-size: 18px;
    padding: 4px;
    cursor: pointer;
    border-radius: 3px;
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
    margin: 5px 20px 5px 0;
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
</style>

<style>
.dropdown .el-dropdown-menu__item {
    width: 90px;
    padding: 3px 8px;
    font-size: 13px;
}

.dropdown .el-dropdown-menu__item:not(.is-disabled):focus {
    background-color: #eee;
    color: #000;
}

.dropdown .iconfont {
    min-width: 13px;
    margin-right: 3px;
    font-size: 13px;
    line-height: 13px;
}

.dropdown .el-popper__arrow {
    display: none;
}
</style>