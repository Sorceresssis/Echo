<template>
    <!-- 不能用id="" 否则Transition无效 -->
    <div class="leftBar">
        <div id="logo">Echo</div>
        <div id="menuWrapper">
            <div>
                <div class="menuTitle">工作台</div>
                <div>
                    <ul>
                        <li :class="{ active: activeLibrary.id == -1 }"
                            class="menuItem "
                            @click="openLibrary({ id: -1, name: '稍后再看' })">
                            <span class="iconfont">&#xe6bb;</span>
                            稍后再看
                        </li>
                        <li :class="{ active: activeLibrary.id == -2 }"
                            class="menuItem "
                            @click="openLibrary({ id: -2, name: '回收站' })">
                            <span class="iconfont">&#xe61a;</span>
                            回收站
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <div class="menuTitle spaceBetween"><span>创建的组</span> <span class="iconfont"
                          @click="showAddGroupInput">&#xe68c;</span>
                </div>
                <div>
                    <ul>
                        <!-- 添加Group输入框 -->
                        <li>
                            <div class="input-wrapper"
                                 v-if="inputAddGroupVisible">
                                <input v-model="inputGroupName"
                                       type="text"
                                       maxlength="255"
                                       v-focus="inputAddGroupVisible"
                                       @keyup.enter="($event.target as HTMLInputElement)?.blur()"
                                       @blur="handleAddGroupInput"
                                       onfocus="this.select()">
                            </div>
                        </li>
                        <li v-for="(group, groupIndex) in groups"
                            :key="group.id">
                            <!-- 重命名输入框 -->
                            <div v-if="inputRenameIDGP == group.id"
                                 class="input-wrapper">
                                <span :class="{ rotateZ: isExpandGroup[groupIndex] }"
                                      class="iconfont angle">&#xe608;</span>
                                <input type="text"
                                       v-model="group.name"
                                       onfocus="this.select()"
                                       v-focus="inputRenameIDGP == group.id"
                                       @keyup.enter="($event.target as HTMLInputElement)?.blur()"
                                       @blur="inputRenameHandleGP(group.id, group.name)">
                            </div>
                            <div v-else
                                 class="menuItem"
                                 @contextmenu="openCtm($event, userMenuEnum.group, groupIndex)"
                                 @click="isExpandGroup[groupIndex] = !isExpandGroup[groupIndex]"
                                 :draggable="true"
                                 @dragstart="dragstartGP(groupIndex)"
                                 @dragend="dragendGP()"
                                 @dragenter="dragenterGP($event, groupIndex)"
                                 @dragleave="dragleaveGP($event)"
                                 @drop="dragleaveGP($event)">
                                <span :class="{ rotateZ: isExpandGroup[groupIndex] }"
                                      class="iconfont angle">&#xe608;</span>
                                {{ group.name }}
                            </div>
                            <div class="contant"
                                 v-show="isExpandGroup[groupIndex]">
                                <ul>
                                    <!-- 添加database输入框 -->
                                    <li>
                                        <div v-if=false
                                             class="input-wrapper ">
                                            <input v-model="inputNameDB"
                                                   type="text"
                                                   class="input inputTemp"
                                                   onfocus="this.select()">
                                        </div>
                                    </li>
                                    <li v-for="(library, libraryIndex) in group.librarys"
                                        :key="library.id">
                                        <!-- 重命名输入框 -->
                                        <div v-if="inputRenameIDDB == library.id"
                                             class="input-wrapper">
                                            <input v-model="library.name"
                                                   onfocus="this.select()"
                                                   type="text"
                                                   class="input"
                                                   v-focus="inputRenameIDDB == library.id"
                                                   @keyup.enter="($event.target as HTMLInputElement)?.blur()"
                                                   @blur="inputRenameHandleDB(library.id, library.name)">
                                        </div>
                                        <div v-else
                                             @contextmenu="openCtm($event, userMenuEnum.library, groupIndex, libraryIndex)"
                                             class="menuItem"
                                             :class="{ active: activeLibrary.id == library.id }"
                                             style="text-indent: 2em;"
                                             @click.stop="openLibrary(library)"
                                             :draggable="true"
                                             @dragstart="dragstartDB(groupIndex, libraryIndex)"
                                             @dragend="dragendDB()"
                                             @dragenter="dragenterDB($event, groupIndex, libraryIndex)"
                                             @dragleave="dragleaveDB($event)"
                                             @drop="dragleaveDB($event)">
                                            {{ library.name }}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <context-menu v-model:show="isVisibleCtmGroup"
                      :options="contextMenuOptions">
            <context-menu-item label="添加数据库"
                               @click="" />
            <context-menu-item label="重命名"
                               @click="inputRenameIDGP = groups[focusGroupIndex].id" />
            <context-menu-item label="删除"
                               @click="">
                <template #icon>
                    <span class="iconfont">&#xe61a;</span>
                </template>
            </context-menu-item>
            <context-menu-item label="刷新"
                               @click="" />
        </context-menu>
        <context-menu v-model:show="isVisibleCtmLibrary"
                      :options="contextMenuOptions">
            <context-menu-item label="在新窗口中打开"
                               @click="openLibraryNewWindow(groups[focusGroupIndex].librarys[focusLibraryIndex])" />
            <context-menu-item label="重命名"
                               @click="inputRenameIDDB = groups[contextMenuIndexGP].librarys[contextMenuIndexDB].id" />
            <context-menu-item label="删除"
                               @click="">
                <template #icon>
                    <span class="iconfont">&#xe61a;</span>
                </template>
            </context-menu-item>
            <context-menu-sperator />
            <context-menu-group label="移动到">
                <context-menu-item v-for="(group, groupIndex) in groups"
                                   :key="group.id"
                                   :label="group.name"
                                   @click="moveDB(groupIndex)" />
            </context-menu-group>
        </context-menu>
    </div>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import type { Directive } from 'vue';
import { debounce } from '../util/debounce'
import { ElMessage } from 'element-plus'


/******************** 组件传参 ********************/
const emit = defineEmits<{
    (e: "openLibrary", library: library): void
}>()


/******************** 启动准备 ********************/
enum userMenuEnum { group, library }
interface group {
    id: number
    name: string
    librarys: library[]
}
interface library {
    id: number
    name: string
}
// 用户group和library的全部信息
const groups = ref<group[]>([])
// group的展开情况
const isExpandGroup = ref<boolean[]>([])
// 正在打开的Library
const activeLibrary = ref<library>({ id: 0, name: "" })
// 获取后台要求打开的library(新建窗口打开)
function getStartOpenDB() {
    return new Promise<library | null>((resolve) => {
        window.electronAPI.startOpenDB((e: any, library: library) => {
            if (library) {
                resolve(library);
            }
            else {
                resolve(null)
            }
        })
    })
}
async function startPreparation() {
    // 获取group是否展开数据，
    isExpandGroup.value = JSON.parse(window.localStorage.getItem('isExpandGroup') || "[]")
    // 获取groups
    groups.value.push(... await window.electronAPI.getGroups())
    // 检查isExpandGroup和groups的对应情况,少就补上false,
    while (isExpandGroup.value.length < groups.value.length) {
        isExpandGroup.value.push(false)
    }
    // 获取并打开要打开的library; 后台要求打开的(新建窗口打开) --> 上一次打开的library --> id=0 不打开任何library
    openLibrary((await getStartOpenDB()) || JSON.parse(window.localStorage.getItem('lastActiveLibrary') || `{"id":0,"name":""}`))
}
startPreparation()

/******************** 监听保存到localStorage ********************/
watch(isExpandGroup, debounce((newValue) => {
    window.localStorage.setItem('isExpandGroup', JSON.stringify(newValue))
}, 200), {
    deep: true
})
watch(activeLibrary, debounce((newValue) => {
    window.localStorage.setItem('lastActiveLibrary', JSON.stringify(newValue))
}, 200))


/******************** 打开Library ********************/
const openLibrary = function (library: library) {
    if (library != activeLibrary.value) {
        activeLibrary.value = library
        emit("openLibrary", library)
    }
}
// 新建窗口打开数据库
function openLibraryNewWindow(library: library) {
    /* electron的ipcRenderer.invoke直接接受 JS对象会报错Uncaught Error: An object could not be cloned.
    原因：
    https://github.com/electron/electron/issues/26338
    https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrenderersendchannel-args
    发送非标准的 JavaScript 类型，例如 DOM 对象或特殊的 Electron 对象将抛出异常。
    解决方法：ipcRenderer 传入JSON.stringifing()，再用JSON.parse()解出来
    */
    window.electronAPI.createMainWindow(JSON.parse(JSON.stringify(library)))
}


const focusGroupIndex = ref<number>(-1)
const focusLibraryIndex = ref<number>(-1)
/******************** 右键菜单Ctm ********************/
// Ctm是ContextMenu
const isVisibleCtmGroup = ref(false)
const isVisibleCtmLibrary = ref(false)
const contextMenuOptions = {
    zIndex: 3,
    minWidth: 300,
    x: 500,
    y: 200
}
const openCtm = (e: MouseEvent, userMenu: number, groupIndex: number, libraryIndex: number = -1) => {
    contextMenuOptions.x = e.x
    contextMenuOptions.y = e.y
    if (userMenu == userMenuEnum.group) {
        isVisibleCtmGroup.value = true
    }
    else {
        isVisibleCtmLibrary.value = true
    }
    focusGroupIndex.value = groupIndex
    focusLibraryIndex.value = libraryIndex
}


/******************** 添加组和数据库 ********************/
// 添加v-focus指令，自动聚焦到input，注意！，v-focus要写在onfocus="this.select()"下面，先全选再聚焦
const vFocus: Directive = (el, bingding) => {
    if (bingding) {
        el.focus()
    }
}
/* 添加GP */
const isVisibleInputAddGroup = ref(false)
const inputModelAddGroup = ref("新建组")
const showAddInput = async (userMenu: number) => {
    inputModelAddGroup.value = "新建组"
    // 如果输入框已经打开且输入框里不为空就加入group
    if (isVisibleInputAddGroup.value && inputModelAddGroup.value != "") {
        let flag: any = await window.electronAPI.addGroup(inputModelAddGroup.value)
        console.log(flag);
    }
    else {
        inputAddGroupVisible.value = true
    }
    inputModelAddGroup.value = "新建组"
}
const handleAddInput = (userMenu: number) => {

}


const addGroup = async (groupName: string) => {
    if (groupName === "") return
    // 写入数据库
    // groups.value.unshift(new group(2, inputGroupName.value, 0, []))
    // 改顺序
    // 重新获取数据
    // 发出提示
}
const inputAddGroupVisible = ref(false)
const inputGroupName = ref("新建组")
const showAddGroupInput = () => {
    inputGroupName.value = "新建组"
    if (!inputAddGroupVisible.value) {
    }
    else {
        addGroup(inputGroupName.value)
    }
}
const handleAddGroupInput = () => {
    addGroup(inputGroupName.value)
    inputAddGroupVisible.value = false
}
/* 添加DB */
const inputNameDB = ref("新建数据库")
const addDBGroupIndex = ref(false)
const addDB = async (DBName: string) => {

}



/******************** 重命名 ********************/
/* 重命名GP */
const inputRenameIDGP = ref(0)
const inputRenameHandleGP = async (groupID: number, rename: string) => {
    inputRenameIDGP.value = 0
    // 写入数据库
    if (await window.electronAPI.renameGroup(groupID, rename)) {
        ElMessage.success('重命名成功')
    }
    else {
        ElMessage.error('重命名失败')
    }
}
/* 重命名DB */
const inputRenameIDDB = ref(0)
const inputRenameHandleDB = async (databaseID: number, rename: string) => {
    // 取消显示
    inputRenameIDDB.value = 0
    // 写入数据库
    if (await window.electronAPI.renameDatabase(databaseID, rename)) {
        ElMessage.success('重命名成功')
    }
    else {
        ElMessage.error('重命名失败')
    }
}

/******************** 拖动，移动和排序 ********************/
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

const moveDB = (indexGP: number) => {
    if (dragTimeout != null) {
        clearTimeout(dragTimeout)
    }
    dragTimeout = setTimeout(() => {
        const source: database = Alldatabase.value[dragIndexGP].databases[dragIndexDB]
        // 删除拖动元素
        Alldatabase.value[dragIndexGP].databases.splice(dragIndexDB, 1)
        // 添加到拖到的位置
        Alldatabase.value[indexGP].databases.splice(0, 0, source)
        dragIndexDB = enterIndexDB
    }, 100)
}

/* 顺序写入数据库 */







// 删除library时 要注意 是不是正在被打开
    //FIXME 要注意删除的library 要去掉


</script>

<style scoped>
.leftBar {
    width: 230px;
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
    width: 200px;
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
    /* line-height: 16px; */
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

.angle {
    display: inline-block;
    transform: rotateZ(0deg);
    transition: all 0.3s;
}

.rotateZ {
    transform: rotateZ(90deg);
}

.input-wrapper {
    display: flex;
    height: 30px;
    margin: 10px 0;
    padding: 0 10px;
    font-size: 13px;
    line-height: 30px;
    border: 1px solid #929292;
    background-color: #fff;
}

.input-wrapper input {
    border: none;
    outline: none;
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