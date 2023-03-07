<template>
    <div class="leftBar">
        <div id="logo">Echo</div>
        <div id="menuWrapper">
            <div>
                <div class="menuTitle">工作台</div>
                <div>
                    <ul>
                        <li :class="{ active: activeDatabaseId == -1 }" class="menuItem " @click="openDatabase(-1)">稍后再看
                        </li>
                        <li :class="{ active: activeDatabaseId == -2 }" class="menuItem " @click="openDatabase(-2)">反对法</li>
                    </ul>
                </div>
            </div>
            <div>
                <div class="menuTitle spaceBetween"><span>创建的组</span> <span class="iconfont" @click="">&#xe68c;</span>
                </div>
                <div>
                    <ul>
                        <li v-for="(group, index) in Alldatabase" :draggable="true">
                            <div class="menuItem" @click="toggleExend(index)">{{ group.name }}</div>
                            <div class="contant" v-show="group.isOpen == 1">
                                <ul>
                                    <li v-for="(database, index) in group.databases" :draggable="true" class="menuItem "
                                        :class="{ active: activeDatabaseId == database.id }"
                                        @click.stop="openDatabase(database.id)">
                                        {{ database.name }}
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
// 获得数据库数据
const Alldatabase = ref<any>([])
async function getAllDatabase() {
    Alldatabase.value.push(...(await window.electronAPI.getAllDatabase()))
}
getAllDatabase()

function toggleExend(index: number) {
    Alldatabase.value[index].isOpen = Alldatabase.value[index].isOpen === 1 ? 0 : 1
}

let activeDatabaseId = ref(1)
function openDatabase(databaseID: number) {
    activeDatabaseId.value = databaseID
    // 加载数据库
}
</script>

<style scoped>
.leftBar {
    display: flex;
    width: 230px;
    height: 100%;
    flex-direction: column;
    background-color: #f0f0f0;
}

#logo {
    height: 40px;
    padding: 0 20px;
    line-height: 40px;
    text-align: left;
    font-size: 30px;
    font-weight: 200;
    -webkit-app-region: drag;
}

#menuWrapper {
    height: 100%;
    padding: 0 15px;
    overflow-y: auto;
}

#menuWrapper::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
}

#menuWrapper::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: #cfcfcf;
}

.menuTitle {
    margin-top: 40px;
    font-size: 13px;
    color: #787878;
}

.menuTitle>span:hover {
    color: #000000;
}

.iconfont {
    font-size: 13px;
    font-weight: 700;
    line-height: 16px;
}

.spaceBetween {
    display: flex;
    justify-content: space-between;
}

.contant {
    transition: height 0.3s;
}

.menuItem {
    height: 32px;
    margin: 10px 0;
    padding: 0 10px;
    font-size: 13px;
    line-height: 32px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 5px;
}

.menuItem:hover:not(.active) {
    background-color: #d9d9d9;
}

.active {
    background-color: #1ecd9a;
    color: #fff;
}
</style>