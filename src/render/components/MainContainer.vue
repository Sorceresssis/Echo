<template>
    <div class="mainContainer">
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
                <el-input ref="InputSearchRef"
                          v-model="inputValue"
                          class="inputSearch"
                          size="small"
                          @keyup.enter="handleInputConfirm"
                          @blur="handleInputConfirm" />
                <el-dropdown trigger="click">
                    <span class=" rightMenuItem iconfont">
                        &#xe686;
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item class="a">有链接</el-dropdown-item>
                            <el-dropdown-item>有文件夹</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-dropdown trigger="click">
                    <span class=" rightMenuItem iconfont">
                        <span class="iconfont">&#xe81f;</span>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>标题</el-dropdown-item>
                            <el-dropdown-item class="a">点击量</el-dropdown-item>
                            <el-dropdown-item>时间</el-dropdown-item>
                            ——————
                            <el-dropdown-item>升序</el-dropdown-item>
                            <el-dropdown-item>降序</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-dropdown trigger="click">
                    <span class=" rightMenuItem iconfont">
                        <span class="iconfont">&#xe7f4;</span>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item class="a">缩略图</el-dropdown-item>
                            <el-dropdown-item>列表</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div id="keywordList"
             v-show="dynamicTags.length != 0 && componentID != TagList">
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
        <component id="Items"
                   :is="componentID">
        </component>
    </div>
</template>
  
<script lang="ts" setup>
/* 组件 */
import Items from './Items.vue'
import ItemsAuthor from './ItemsAuthor.vue'
import ItemsFav from './ItemsFav.vue'
import TagList from './TagList.vue'
/* vue */
import { nextTick, ref, shallowReactive, shallowRef } from 'vue';
/* elementplus */
import { ElInput } from 'element-plus'

/* 组件切换 */
const componentID = shallowRef(Items)
const componentActive = ref(0)
const componentData = shallowReactive([
    { name: '资源', component: Items },
    { name: '作者', component: ItemsAuthor },
    { name: '喜欢', component: ItemsFav },
    { name: '标签列表', component: TagList }
])
function switchComponent(index: number) {
    componentID.value = componentData[index].component
    componentActive.value = index
}

/* Keyword List */
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

#menu {
    display: flex;
    margin: 10px;
    justify-content: space-between;
}

#leftMenu {
    display: flex;
    justify-content: left;
}

.leftMenuItem {
    margin-right: 30px;
    cursor: pointer;
}

.leftMenuItem:hover {
    color: #9e94f7;
}

.componentActive {
    color: #9e94f7;
    border-bottom: solid 4px #9e94f7;
}

#rightMenu {
    display: flex;
    width: 50%;
    justify-content: right;
    align-items: center;
}

.rightMenuItem {
    font-size: 14px;
    margin-left: 8px;
    cursor: pointer;
}

.inputSearch {
    width: 60%;
    min-width: 130px;
    max-width: 250px;
    height: 24px;
    font-size: 14px;
    margin: 5px 8px 5px 0;
}

.inputSearch :deep(.el-input__wrapper) {
    border-radius: 12px;
    font-size: 14px;
    background-color: #f0f0f0;
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