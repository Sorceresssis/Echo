<template>
    <div class="mainContainer">
        <div id="menu">
            <div id="leftMenu">
                <div v-for="(item, index) in componentData" :class="[active == index ? 'active' : '']" class="leftMenuItem"
                    @click="switchComponent(index)">{{
                        item.name
                    }}</div>
            </div>
            <div id="rightMenu">
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                        Dropdown List
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item class="a">Action 1</el-dropdown-item>
                            <el-dropdown-item>Action 2</el-dropdown-item>
                            <el-dropdown-item>Action 3</el-dropdown-item>
                            <el-dropdown-item disabled>Action 4</el-dropdown-item>
                            <el-dropdown-item divided>Action 5</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <div class="rightMenuItem">搜索</div>
                <div class="rightMenuItem">筛选</div>
                <div class="rightMenuItem">添加</div>
                <div class="rightMenuItem">排序</div>
                <div class="rightMenuItem">视图</div>
            </div>
        </div>
        <div id="keywordList">
            <div class="keyword"></div>
        </div>
        <component id="Items" :is="componentID"></component>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, shallowReactive, shallowRef } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue'
import Items from './Items.vue'
import ItemsAuthor from './ItemsAuthor.vue'
import ItemsFav from './ItemsFav.vue'
import TagList from './TagList.vue'

const componentData = shallowReactive([
    { name: '资源', component: Items },
    { name: '作者', component: ItemsAuthor },
    { name: '喜欢', component: ItemsFav },
    { name: '标签列表', component: TagList }
])
const componentID = shallowRef(Items)
const active = ref(0)

function switchComponent(index: number) {
    componentID.value = componentData[index].component
    active.value = index
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
    color: #1ecd9a;
}

#rightMenu {
    display: flex;
    justify-content: right;
}

:deep(.a) {
    color: pink;
}


.active {
    color: #1ecd9a;
    border-bottom: solid 4px #1ecd9a;
}

.rightMenuItem {
    margin-left: 10px;
    cursor: pointer;
}

#keywordList {

    margin: 10px;
}

.keyword {
    background-color: #fff;
    padding: 2px 5px;
}
</style>