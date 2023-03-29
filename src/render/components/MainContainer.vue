<template>
    <div class="mainContainer">
        <div id="libraryName">{{ activeLibrary.name }}</div>
        <div id="menu">
            <div id="leftMenu">
                <div v-for="(item, index) in componentData"
                     :class="[componentActive == index ? 'componentActive' : '']"
                     class="leftMenuItem"
                     @click="switchComponent(index)">{{
                         item.name
                     }}</div>
            </div>
            <div id="rightMenu">
                <el-autocomplete class="inputSearch"
                                 size="small"
                                 placeholder="通用搜索"
                                 clearable
                                 v-model="searchWord"
                                 value-key="suggest"
                                 :trigger-on-focus="false"
                                 :fetch-suggestions="querySearchAsync" />

                <span class="iconfont rightMenuItem ">
                    &#xe66b;
                </span>
                <span class="iconfont rightMenuItem ">
                    &#xe68c;
                </span>
                <el-dropdown trigger="click"
                             popper-class="dropdown">
                    <span class=" rightMenuItem iconfont">
                        &#xe686;
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="itemSelect.filter[0] = !itemSelect.filter[0]">
                                <span v-if="itemSelect.filter[0]"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                有链接
                            </el-dropdown-item>
                            <el-dropdown-item @click="itemSelect.filter[1] = !itemSelect.filter[1]">
                                <span v-if="itemSelect.filter[1]"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                有源文件
                            </el-dropdown-item>
                            <el-dropdown-item @click="itemSelect.filter[2] = !itemSelect.filter[2]">
                                <span v-if="itemSelect.filter[2]"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                有封面
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-dropdown trigger="click"
                             popper-class="dropdown">
                    <span class=" rightMenuItem iconfont">
                        <span class="iconfont">&#xe81f;</span>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="itemSelect.orderBy = OrderBy.title">
                                <span v-if="itemSelect.orderBy == OrderBy.title"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                标题
                            </el-dropdown-item>
                            <el-dropdown-item @click="itemSelect.orderBy = OrderBy.clickCount">
                                <span v-if="itemSelect.orderBy == OrderBy.clickCount"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                点击量
                            </el-dropdown-item>
                            <el-dropdown-item @click="itemSelect.orderBy = OrderBy.Date">
                                <span v-if="itemSelect.orderBy == OrderBy.Date"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                时间
                            </el-dropdown-item>
                            <el-dropdown-item divided
                                              @click="itemSelect.ascending = 0">
                                <span v-if="itemSelect.ascending == 0"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                降序 </el-dropdown-item>
                            <el-dropdown-item @click="itemSelect.ascending = 1">
                                <span v-if="itemSelect.ascending == 1"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                升序</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-dropdown trigger="click"
                             popper-class="dropdown">
                    <span class=" rightMenuItem iconfont">
                        <span class="iconfont">&#xe7f4;</span>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="viewInfo = View.thumbnail">
                                <span v-if="viewInfo == View.thumbnail"
                                      class="iconfont">&#xe60a;</span>
                                <span v-else
                                      class="iconfont"></span>
                                缩略图
                            </el-dropdown-item>
                            <el-dropdown-item @click="viewInfo = View.extended">
                                <span v-if="viewInfo == View.extended"
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
             v-show="dynamicTags.length != 0 && componentID != InfoList">
            <!-- 输入框 -->
            <el-input v-if="inputVisible"
                      ref="InputRef"
                      v-model="inputValue"
                      class="inputSearch"
                      size="small"
                      @keyup.enter="handleInputConfirm"
                      @blur="handleInputConfirm" />
            <!-- 添加按钮 -->
            <el-button v-else
                       class="button-new-tag ml-1 input"
                       size="small"
                       @click="showInput">
                + New Tag
            </el-button>
            <!-- Tag列表 -->
            <el-tag v-for="tag in dynamicTags"
                    :key="tag"
                    class="keyword"
                    closable
                    round
                    @close="handleClose(tag)">
                {{ tag }}
            </el-tag>
        </div>
        <component :is="componentID"
                   :activeLibrary="activeLibrary"
                   :itemSelect="itemSelect"
                   :viewInfo="viewInfo">
        </component>
    </div>
</template>
  
<script lang="ts" setup>
import Items from './Items.vue'
import ItemsAuthor from './ItemsAuthor.vue'
import ItemsFav from './ItemsFav.vue'
import InfoList from './InfoList.vue'
import { nextTick, ref, shallowReactive, shallowRef, watch } from 'vue';
import { ElInput } from 'element-plus'

const props = defineProps<{
    activeLibrary: library
}>()


/* 组件切换 */
const componentID = shallowRef<any>(Items)
const componentActive = ref(0)
const componentData = shallowReactive([
    { name: '资源', component: Items },
    { name: '作者', component: ItemsAuthor },
    { name: '喜欢', component: ItemsFav },
    { name: '信息列表', component: InfoList }
])
function switchComponent(index: number) {
    componentID.value = componentData[index].component
    componentActive.value = index
}


/******************** 通用搜索 ********************/
enum AttributeItem {
    // ALL 不包含folder_path
    item_title, author_name, tag_title, folder_path, All
}
const searchWord = ref('')
const querySearchAsync = (queryString: string, cb: any) => {
    window.electronAPI.getAttributeItem(1, AttributeItem.All, 0, 12, queryString.split(' ')).then((a) => {
        cb(a)
    })
}


/******************** Items的筛选和展示方式 ********************/
enum OrderBy { title, clickCount, Date }
const itemSelect = ref({
    filter: [false, false, false],
    orderBy: OrderBy.title,
    ascending: 0
})
// ViewInfo
enum View { extended, thumbnail }
const viewInfo = ref(View.extended)


/******************** keywords列表 ********************/
const dynamicTags = shallowReactive(['Tag 1', 'Tag 2', 'Tag 3'])
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()
const handleClose = (tag: string) => {
    dynamicTags.splice(dynamicTags.indexOf(tag), 1)
}

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}
const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.push(inputValue.value)
    }
    inputVisible.value = false
    inputValue.value = ''
    // 跟新 items

}
</script>
  
<style scoped>
.mainContainer {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    padding-right: 16px;
    background-color: #fff;
    overflow: hidden;
}

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
    width: 50%;
    min-width: 130px;
    max-width: 250px;
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
</style>