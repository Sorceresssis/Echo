<template>
    <div class="leftBar">
        <div id="logo">Echo</div>
        <div id="menuWrapper">
            <div>
                <div class="menuTitle">工作台</div>
                <div>
                    <ul>
                        <li :class="{ active: activeDatabaseId == -1 }"
                            class="menuItem "
                            @click="openDatabase(-1)">
                            <span class="iconfont">&#xe6bb;</span>
                            稍后再看
                        </li>
                        <li :class="{ active: activeDatabaseId == -2 }"
                            class="menuItem "
                            @click="openDatabase(-2)">反对法
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <div class="menuTitle spaceBetween"><span>创建的组</span> <span class="iconfont"
                          @click="showInput">&#xe68c;</span>
                </div>
                <div>
                    <ul>
                        <li>
                            <input v-show="inputAddGroupVisible"
                                   v-model="inputGroupName"
                                   type="text"
                                   class="input"
                                   v-focus="inputAddGroupVisible"
                                   @keyup.enter="($event.target as HTMLInputElement)?.blur()"
                                   @blur="handleInput"
                                   onfocus="this.select()">
                        </li>
                        <li v-for="(group, indexGP) in Alldatabase"
                            :key="group.id">
                            <div class="menuItem"
                                 @click="toggleExend(indexGP)"
                                 :draggable="true"
                                 @dragstart="dragstartGP(indexGP)"
                                 @dragend="dragendGP()"
                                 @dragenter="dragenterGP($event, indexGP)"
                                 @dragleave="dragleaveGP($event)"
                                 @drop="dragleaveGP($event)">
                                <span :class="{ rotateZ: group.isOpen == 1 }"
                                      class="iconfont angle">&#xe608;</span>
                                {{ group.name }}
                            </div>
                            <div class="contant"
                                 v-show="group.isOpen == 1">
                                <ul>
                                    <li v-for="(database, indexDB) in group.databases"
                                        class="menuItem "
                                        style="text-indent: 2em;"
                                        :key="database.id"
                                        :class="{ active: activeDatabaseId == database.id }"
                                        @click.stop="openDatabase(database.id)"
                                        :draggable="true"
                                        @dragstart="dragstartDB(indexGP, indexDB)"
                                        @dragend="dragendDB()"
                                        @dragenter="dragenterDB($event, indexGP, indexDB)"
                                        @dragleave="dragleaveDB($event)"
                                        @drop="dragleaveDB($event)">
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
import type { Directive } from 'vue';


let dragIndexGP: number
let dragIndexDB: number
let enterIndexGP: number
let enterIndexDB: number
let dragTimeout: any = null
/* 拖动group */
const dragstartGP = (index: number) => {
    dragIndexGP = index
}
const dragendGP = () => {
    if (dragTimeout != null) {
        clearTimeout(dragTimeout)
    }
    dragTimeout = setTimeout(() => {
        if (dragIndexGP != enterIndexGP) {
            const source: group = Alldatabase.value[dragIndexGP]
            // 删除拖动元素
            Alldatabase.value.splice(dragIndexGP, 1)
            // 添加到拖到的位置
            Alldatabase.value.splice(enterIndexGP, 0, source)
            dragIndexGP = enterIndexGP
        }
    }, 100)
}
const dragenterGP = (e: any, index: number) => {
    e.preventDefault()
    enterIndexGP = index
    // 当DB进入GP时,DB添加到该GP的第一位
    enterIndexDB = 0
    e.currentTarget.style.borderBottom = "3px solid #f77c7c"
}
const dragleaveGP = (e: any) => {
    e.currentTarget.style.borderBottom = ""
}

/* 拖动DB */
const dragstartDB = (indexGP: number, indexDB: number) => {
    dragIndexGP = indexGP
    dragIndexDB = indexDB
}
const dragendDB = () => {
    if (dragTimeout != null) {
        clearTimeout(dragTimeout)
    }
    dragTimeout = setTimeout(() => {
        const source: database = Alldatabase.value[dragIndexGP].databases[dragIndexDB]
        // 删除拖动元素
        Alldatabase.value[dragIndexGP].databases.splice(dragIndexDB, 1)
        // 添加到拖到的位置
        Alldatabase.value[enterIndexGP].databases.splice(enterIndexDB, 0, source)
        dragIndexDB = enterIndexDB
    }, 100)
}
const dragenterDB = (e: any, indexGP: number, indexDB: number) => {
    e.preventDefault()
    enterIndexGP = indexGP
    enterIndexDB = indexDB
    e.currentTarget.style.borderBottom = "3px solid #7cccf7"
}
const dragleaveDB = (e: any) => {
    e.currentTarget.style.borderBottom = ""
}

/* 获得数据库数据 */
class group {
    id: number
    name: string
    isOpen: number
    databases: database[]
    constructor(id: number, name: string, isOpen: number, databases: database[]) {
        this.id = id
        this.name = name
        this.isOpen = isOpen
        this.databases = databases
    }
}
class database {
    id: number
    name: string
    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }
}
const Alldatabase = ref<group[]>([])
async function getAllDatabase() {
    Alldatabase.value = [...(await window.electronAPI.getAllDatabase())]
}
getAllDatabase()

/* 展开group */
function toggleExend(index: number) {
    Alldatabase.value[index].isOpen = Alldatabase.value[index].isOpen === 1 ? 0 : 1
}

/* 打开数据库 */
let activeDatabaseId = ref(1)
function openDatabase(databaseID: number) {
    // 改样式
    activeDatabaseId.value = databaseID
    // 传递数据获得数据
}

/* 添加组 */
// 添加v-focus指令，自动聚焦到input
const vFocus: Directive = (el, bingding) => {
    if (bingding) {
        el.focus()
    }
}
const inputAddGroupVisible = ref(false)
const inputGroupName = ref("新建组")
const addGroup = async (groupName: string) => {
    if (groupName === "") return
    // 写入数据库
    let flag: any = await window.electronAPI.addGroup(groupName)

    // Alldatabase.value.unshift(new group(2, inputGroupName.value, 0, []))
    // 改顺序

    // 重新获取数据
    getAllDatabase()

    // 发出提示
    console.log(flag);
}
const showInput = () => {
    inputGroupName.value = "新建组"
    if (!inputAddGroupVisible.value) {
        inputAddGroupVisible.value = true
    }
    else {
        addGroup(inputGroupName.value)
    }
}
const handleInput = () => {
    addGroup(inputGroupName.value)
    inputAddGroupVisible.value = false
}




/* 重置顺序写入数据库 */

</script>

<style scoped>
.leftBar {
    width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f0f0f0;
    overflow: hidden;
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
    flex: 1;
    width: 170px;
    padding: 0 15px;
    overflow-y: scroll;
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
    margin-top: 20px;
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
    margin-right: 5px;
}

.spaceBetween {
    display: flex;
    justify-content: space-between;
}

.contant {
    transform: all 0.3s;
    background-color: #f0f0f0;
}

.input {
    height: 30px;
    width: 144px;
    margin-top: 10px;
    padding: 0 10px;
    font-size: 13px;
    border: solid 1px #767676;
    outline: none;
}

.angle {
    display: inline-block;
    transform: rotateZ(0deg);
    transition: all 0.3s;
}

.rotateZ {
    transform: rotateZ(90deg);
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
    cursor: pointer;
}

.menuItem:hover:not(.active) {
    background-color: #d9d9d9;
}

.active {
    background-color: #887cf7;
    color: #fff;
}
</style>