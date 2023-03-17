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
                            @click="openDatabase(-2)">回收站
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
                                 @contextmenu="contextMenuOpenGP($event, indexGP)"
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
                                    <li>
                                        <input v-show=false
                                               v-model="inputNameDB"
                                               type="text"
                                               class="input"
                                               onfocus="this.select()">
                                    </li>
                                    <li v-for="(database, indexDB) in group.databases"
                                        :key="database.id">
                                        <div v-if="inputRenameIDDB === database.id">
                                            <input v-show=true
                                                   v-focus="inputRenameIDDB === database.id"
                                                   v-model="database.name"
                                                   type="text"
                                                   class="input"
                                                   @keyup.enter="($event.target as HTMLInputElement)?.blur()"
                                                   @blur="inputRenameHandleDB"
                                                   onfocus="this.select()">
                                        </div>
                                        <div v-else
                                             @contextmenu="contextMenuOpenDB($event, indexGP, indexDB)"
                                             class="menuItem "
                                             :class="{ active: activeDatabaseId == database.id }"
                                             style="text-indent: 2em;"
                                             @click.stop="openDatabase(database.id)"
                                             :draggable="true"
                                             @dragstart="dragstartDB(indexGP, indexDB)"
                                             @dragend="dragendDB()"
                                             @dragenter="dragenterDB($event, indexGP, indexDB)"
                                             @dragleave="dragleaveDB($event)"
                                             @drop="dragleaveDB($event)">
                                            {{ database.name }}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <context-menu v-model:show="contextMenushowGP"
                      :options="contextMenuOptions">
            <context-menu-item label="添加数据库"
                               @click="" />
            <context-menu-item label="重命名"
                               @click="" />
            <context-menu-item label="删除"
                               @click="" />
        </context-menu>
        <context-menu v-model:show="contextMenushowDB"
                      :options="contextMenuOptions">
            <context-menu-item label="打开"
                               @click="openDatabase(Alldatabase[contextMenuIndexGP].databases[contextMenuIndexDB].id)" />
            <context-menu-item label="在新窗口中打开"
                               @click="openDatabaseNewWindow(Alldatabase[contextMenuIndexGP].databases[contextMenuIndexDB].id)" />
            <context-menu-item label="重命名"
                               @click="inputRenameIDDB = Alldatabase[contextMenuIndexGP].databases[contextMenuIndexDB].id" />
            <context-menu-item label="删除"
                               @click="" />
            <context-menu-sperator />
            <context-menu-item label="添加记录"
                               @click="">
                <template #icon>
                    <span class="iconfont"
                          style="width:20px;height:20px">&#xe6e6;</span>
                </template>
            </context-menu-item>
            <context-menu-group label="移动到">
                <context-menu-item v-for="(group, index) in Alldatabase"
                                   :key="index"
                                   :label="group.name"
                                   @click="" />
            </context-menu-group>
        </context-menu>
    </div>
</template>


<script setup lang='ts'>
import { ref } from 'vue';
import type { Directive } from 'vue';
import { ContextMenu, ContextMenuItem, ContextMenuGroup } from '@imengyu/vue3-context-menu';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'


/******************** 获得数据库数据 ********************/
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


/******************** 打开和展示 ********************/
/* GP */
// 展开group
function toggleExend(index: number) {
    Alldatabase.value[index].isOpen = Alldatabase.value[index].isOpen === 1 ? 0 : 1
}
/* DB */
let activeDatabaseId = ref(1)
// 普通打开
function openDatabase(databaseID: number) {
    // 改样式
    activeDatabaseId.value = databaseID
    // 传递数据获得数据
}
// 新建窗口打开数据库
function openDatabaseNewWindow(databaseID: number) {
    console.log("新建窗口", databaseID);
}


/******************** 右键菜单 ********************/
const contextMenushowGP = ref(false)
const contextMenushowDB = ref(false)
const contextMenuIndexGP = ref(0)
const contextMenuIndexDB = ref(0)
const contextMenuOptions = {
    zIndex: 3,
    minWidth: 300,
    x: 500,
    y: 200
}
const contextMenuOpenGP = (e: MouseEvent, indexGP: number) => {
    contextMenuOptions.x = e.x
    contextMenuOptions.y = e.y
    contextMenushowGP.value = true
    contextMenuIndexGP.value = indexGP
}
const contextMenuOpenDB = (e: MouseEvent, indexGP: number, indexDB: number) => {
    contextMenuOptions.x = e.x
    contextMenuOptions.y = e.y
    contextMenushowDB.value = true
    contextMenuIndexGP.value = indexGP
    contextMenuIndexDB.value = indexDB
}


/******************** 添加组和数据库 ********************/
// 添加v-focus指令，自动聚焦到input
const vFocus: Directive = (el, bingding) => {
    if (bingding) {
        el.focus()
    }
}
/* 添加GP */
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
/* 添加DB */
const inputNameDB = ref("新建数据库")




/******************** 重命名 ********************/
/* 重命名GP */
const inputRenameIDGP = ref(0)



/* 重命名DB */
const inputRenameIDDB = ref(0)
const inputRenameHandleDB = () => {
    // 取消显示
    let tmpID = inputRenameIDDB.value
    inputRenameIDDB.value = 0
    // 写入数据库

}





/******************** 拖动排序 ********************/
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

/* 顺序写入数据库 */

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