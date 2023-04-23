<template>
    <!-- 不能用id="" 否则Transition无效 -->
    <div class="leftBar">
        <div id="logo">Echo</div>
        <div id="menuWrapper">
            <div>
                <div class="menuTitle">{{ $t('siderBar.workbench') }}</div>
                <div>
                    <ul>
                        <li :class="{ active: activeLibrary.id == -1 }"
                            class="menuItem "
                            @click="openLibrary({ id: -1, name: i18n.global.t('siderBar.watchLater') })">
                            <span class="iconfont">&#xe6bb;</span>
                            {{ $t('siderBar.watchLater') }}
                        </li>
                        <li :class="{ active: activeLibrary.id == -2 }"
                            class="menuItem "
                            @click="openLibrary({ id: -2, name: i18n.global.t('siderBar.recycleBin') })">
                            <span class="iconfont">&#xe61a;</span>
                            {{ $t('siderBar.recycleBin') }}
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <div class="menuTitle spaceBetween">
                    <span>{{ $t('siderBar.createdGroup') }}</span>
                    <div>
                        <span class="iconfont"
                              @click="startPreparation">&#xe64c;</span>
                        <span class="iconfont"
                              @click="showInputAddGroup">&#xe68c;</span>
                    </div>
                </div>
                <div>
                    <ul>
                        <!-- 添加Group输入框 -->
                        <li>
                            <div class="input-wrapper"
                                 v-if="isVisibleInputAddGroup">
                                <input v-model="inputModelAddGroup"
                                       type="text"
                                       maxlength="255"
                                       v-focus="isVisibleInputAddGroup"
                                       @keyup.enter="($event.target as HTMLInputElement)?.blur()"
                                       @blur="handleInputAddGroup"
                                       onfocus="this.select()">
                            </div>
                        </li>
                        <li v-for="(group, groupIndex) in groups"
                            :key="group.id">
                            <!-- 重命名输入框 -->
                            <div v-if="inputRenameGroupId == group.id"
                                 class="input-wrapper">
                                <span :class="{ rotateZ: isExpandGroup[groupIndex] }"
                                      class="iconfont angle">&#xe608;</span>
                                <input type="text"
                                       v-model="group.name"
                                       onfocus="this.select()"
                                       v-focus="inputRenameGroupId == group.id"
                                       @keyup.enter="($event.target as HTMLInputElement)?.blur()"
                                       @blur="renameGroup(group.id, group.name)">
                            </div>
                            <div v-else
                                 class="menuItem"
                                 @contextmenu="openCtm($event, groupIndex)"
                                 @click="isExpandGroup[groupIndex] = !isExpandGroup[groupIndex]"
                                 :draggable="true"
                                 @dragstart="dragstart(groupIndex)"
                                 @dragend="dragend()"
                                 @dragenter="dragenter($event, groupIndex)"
                                 @dragleave="dragleave($event)"
                                 @drop="dragleave($event)">
                                <span :class="{ rotateZ: isExpandGroup[groupIndex] }"
                                      class="iconfont angle">&#xe608;</span>
                                {{ group.name }}
                            </div>
                            <div class="contant"
                                 v-show="isExpandGroup[groupIndex]">
                                <ul>
                                    <!-- 添加library输入框 -->
                                    <li>
                                        <div v-if="addLibraryGroupIndex == groupIndex"
                                             class="input-wrapper ">
                                            <!-- onfocus写在v-focus前面  -->
                                            <input type="text"
                                                   v-model="inputModelAddLibrary"
                                                   onfocus="this.select()"
                                                   v-focus="true"
                                                   @keyup.enter="($event.target as HTMLInputElement)?.blur()"
                                                   @blur="handleInputAddLibrary(group.id)">
                                        </div>
                                    </li>
                                    <li v-for="(library, libraryIndex) in group.librarys"
                                        :key="library.id">
                                        <!-- 重命名输入框 -->
                                        <div v-if="inputRenameLibraryId == library.id"
                                             class="input-wrapper">
                                            <input v-model="library.name"
                                                   onfocus="this.select()"
                                                   type="text"
                                                   class="input"
                                                   v-focus="inputRenameLibraryId == library.id"
                                                   @keyup.enter="($event.target as HTMLInputElement)?.blur()"
                                                   @blur="renameLibrary(library.id, library.name)">
                                        </div>
                                        <div v-else
                                             @contextmenu="openCtm($event, groupIndex, libraryIndex)"
                                             class="menuItem"
                                             :class="{ active: activeLibrary.id == library.id }"
                                             style="text-indent: 2em;"
                                             @click.stop="openLibrary(library)"
                                             :draggable="true"
                                             @dragstart="dragstart(groupIndex, libraryIndex)"
                                             @dragend="dragend()"
                                             @dragenter="dragenter($event, groupIndex, libraryIndex)"
                                             @dragleave="dragleave($event)"
                                             @drop="dragleave($event)">
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
            <context-menu-item :label="i18n.global.t('ctm.addLibrary')"
                               @click="showInputAddLibrary" />
            <context-menu-item :label="i18n.global.t('ctm.rename')"
                               @click="inputRenameGroupId = groups[_FocusGroupIndex].id" />
            <context-menu-item label="删除"
                               @click="openDeleteDialog">
                <template #icon>
                    <span class="iconfont">&#xe61a;</span>
                </template>
            </context-menu-item>
        </context-menu>
        <context-menu v-model:show="isVisibleCtmLibrary"
                      :options="contextMenuOptions">
            <context-menu-item label="在新窗口中打开"
                               @click="openLibraryNewWindow(groups[_FocusGroupIndex].librarys[_FocusLibraryIndex])" />
            <context-menu-item label="重命名"
                               @click="inputRenameLibraryId = groups[_FocusGroupIndex].librarys[_FocusLibraryIndex].id" />
            <context-menu-item label="删除"
                               @click="openDeleteDialog">
                <template #icon>
                    <span class="iconfont">&#xe61a;</span>
                </template>
            </context-menu-item>
            <context-menu-sperator />
            <context-menu-group label="移动到">
                <context-menu-item v-for="(group, groupIndex) in groups"
                                   :key="group.id"
                                   :label="group.name"
                                   @click="moveLibrary(groupIndex)" />
            </context-menu-group>
            <context-menu-item label="导出" />
        </context-menu>
        <el-dialog v-model="deleteDialogInfo.isVisibleDialog"
                   align-center
                   title="你确定要这样做吗"
                   width="350px"
                   class="dialog">
            <p>此操作<span style="font-weight: 700;">无法</span>撤销。这将永久删除数据
            </p>
            <p>请输入 <span style="font-weight: 700; user-select: text;">{{ deleteDialogInfo.deleteItemName }}</span> 进行确认。</p>
            <el-input class="diaglog-input"
                      v-model="deleteDialogInfo.confirmInputName"></el-input>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary"
                               :class="{ 'confirmed': deleteDialogInfo.confirmInputName == deleteDialogInfo.deleteItemName }"
                               @click="handleDeleteDialog">
                        我明白后果，确认删除这个{{ deleteDialogInfo.deleteType }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { Ref, inject, ref, watch } from 'vue';
import type { Directive } from 'vue';
import { useRouter } from 'vue-router'
import i18n from '../locales/index'
import { debounce } from '../util/debounce'
import { ElMessage } from 'element-plus'

const router = useRouter()

/******************** 启动准备 ********************/
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
const activeLibrary = inject<Ref<library>>('activeLibrary') as Ref<library>
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
    groups.value = await window.electronAPI.getGroups()
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
    if (library != activeLibrary?.value) {
        // 改网页标题
        document.title = library.name == '' ? 'Echo' : library.name + " - Echo";
        activeLibrary.value = library
        router.push({
            path: '/',
            query: {
                id: library.id,
                name: library.name
            }
        })
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


let _FocusGroupIndex = -1
let _FocusLibraryIndex = -1
let _ToGroupIndex = -1
let _ToLibraryIndex = -1
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
const openCtm = (e: MouseEvent, groupIndex: number, libraryIndex: number = -1) => {
    contextMenuOptions.x = e.x
    contextMenuOptions.y = e.y
    if (libraryIndex == -1) {
        isVisibleCtmGroup.value = true
    }
    else {
        isVisibleCtmLibrary.value = true
    }
    _FocusGroupIndex = groupIndex
    _FocusLibraryIndex = libraryIndex
}


/******************** 输入框 ********************/
// 添加v-focus指令，自动聚焦到input，注意！，v-focus要写在onfocus="this.select()"下面，先全选再聚焦
const vFocus: Directive = (el, bingding) => {
    if (bingding) {
        el.focus()
    }
}
/* group添加 */
const isVisibleInputAddGroup = ref(false)
const inputModelAddGroup = ref("新建组")
const showInputAddGroup = () => {
    inputModelAddGroup.value = "新建组"
    isVisibleInputAddGroup.value = true
}
const handleInputAddGroup = async () => {
    // 关闭输入框
    isVisibleInputAddGroup.value = false
    // 写入数据库
    if (inputModelAddGroup.value === "") return
    let newGroupId: number | null = await window.electronAPI.addGroup(inputModelAddGroup.value)
    if (newGroupId) {
        // 发出提示
        ElMessage.success('添加组成功')
        groups.value.unshift({ id: newGroupId, name: inputModelAddGroup.value, librarys: [] })
        if (isExpandGroup.value.length < groups.value.length) {
            isExpandGroup.value.unshift(false)
        }
        // 重新写入顺序
        updataGroupOrder()
    }
    else {
        ElMessage.error('添加组失败')
    }
}
/* group重命名 */
const inputRenameGroupId = ref<number>(0)
const renameGroup = async (groupId: number, rename: string) => {
    // 取消显示
    inputRenameGroupId.value = 0
    // 写入数据库
    if (await window.electronAPI.renameGroup(groupId, rename)) {
        ElMessage.success('重命名成功')
    }
    else {
        ElMessage.error('重命名失败')
    }
}
/* library添加 */
const addLibraryGroupIndex = ref(-1)
const inputModelAddLibrary = ref("新建库")
const showInputAddLibrary = () => {
    // 先展开group
    inputModelAddLibrary.value = "新建库"
    isExpandGroup.value[_FocusGroupIndex] = true
    addLibraryGroupIndex.value = _FocusGroupIndex
}
const handleInputAddLibrary = async (groupId: number) => {
    let addGroupIndex = addLibraryGroupIndex.value
    // 关闭输入框
    addLibraryGroupIndex.value = -1
    if (inputModelAddLibrary.value === "") return
    let newlibraryId: number | null = await window.electronAPI.addLibrary(groupId, inputModelAddLibrary.value)
    if (newlibraryId) {
        ElMessage.success('添加库成功')
        groups.value[addGroupIndex].librarys.unshift({ id: newlibraryId, name: inputModelAddLibrary.value })
        // 重新写入顺序
        updataLibraryOrder(addGroupIndex)
    } else {
        ElMessage.error('添加库失败')
    }
}
/* library重命名 */
const inputRenameLibraryId = ref<number>(0)
const renameLibrary = async (libraryId: number, rename: string) => {
    inputRenameLibraryId.value = 0
    if (await window.electronAPI.renameLibrary(libraryId, rename)) {
        ElMessage.success('重命名成功')
    }
    else {
        ElMessage.error('重命名失败')
    }
}

/******************** 在数据库更新顺序 ********************/
const updataGroupOrder = debounce(async () => {
    let groupsId: number[] = []
    groups.value.forEach(element => {
        groupsId.push(element.id)
    });
    await window.electronAPI.updataOrderGroup(groupsId);
}, 200)

const updataLibraryOrder = debounce(async (groupIndex: number) => {
    let librarysId: number[] = []
    groups.value[groupIndex].librarys.forEach(element => {
        librarysId.push(element.id)
    })
    await window.electronAPI.updataOrderLibrary(groups.value[groupIndex].id, librarysId)
}, 200)

/******************** 删除group和library ********************/
const deleteDialogInfo = ref({
    isVisibleDialog: false,
    deleteType: "",
    deleteItemName: "",
    confirmInputName: "",
})
const openDeleteDialog = () => {
    // 删除旧数据
    deleteDialogInfo.value.confirmInputName = ""
    deleteDialogInfo.value.isVisibleDialog = true
    if (_FocusLibraryIndex == -1) {
        deleteDialogInfo.value.deleteType = "组Group"
        deleteDialogInfo.value.deleteItemName = groups.value[_FocusGroupIndex].name
    }
    else {
        deleteDialogInfo.value.deleteType = "库Library"
        deleteDialogInfo.value.deleteItemName = groups.value[_FocusGroupIndex].librarys[_FocusLibraryIndex].name
    }
}
const handleDeleteDialog = async () => {
    // 输入完整的名字才能删除
    if (deleteDialogInfo.value.confirmInputName != deleteDialogInfo.value.deleteItemName) return
    // 删除的library如果是正在被打开的，就传一个{id:0,name:""}
    if (_FocusLibraryIndex == -1) {
        groups.value[_FocusGroupIndex].librarys.forEach(element => {
            if (element.id == activeLibrary.value.id) {
            }
        });
        if (await window.electronAPI.deleteGroup(groups.value[_FocusGroupIndex].id)) {
            groups.value.splice(_FocusGroupIndex, 1)
            isExpandGroup.value.splice(_FocusGroupIndex, 1)
        }

    } else {
        if (groups.value[_FocusGroupIndex].librarys[_FocusLibraryIndex].id == activeLibrary.value.id) {
        }
        if (await window.electronAPI.deleteLibrary(groups.value[_FocusGroupIndex].librarys[_FocusLibraryIndex].id)) {
            groups.value[_FocusGroupIndex].librarys.splice(_FocusLibraryIndex, 1)
        }
    }
    deleteDialogInfo.value.isVisibleDialog = false
}
/******************** 右键菜单移动library ********************/
const moveLibrary = async (groupIndex: number) => {
    if (groupIndex == _FocusGroupIndex) {
        ElMessage.error('已在该组')
        return
    }
    // 删除拖动元素,添加到group第一个的位置
    let sourceLibrary: library = groups.value[_FocusGroupIndex].librarys.splice(_FocusLibraryIndex, 1)[0]
    groups.value[groupIndex].librarys.unshift(sourceLibrary)
    _FocusLibraryIndex = _ToLibraryIndex
    await window.electronAPI.moveLibrary(groups.value[groupIndex].id, sourceLibrary.id)
    updataLibraryOrder(groupIndex)
}

/******************** 拖动，移动和排序 ********************/
let dragenterStyle: string | null
const dragstart = (groupIndex: number, libraryIndex: number = -1) => {
    _FocusGroupIndex = groupIndex
    _FocusLibraryIndex = libraryIndex
    // 拖动的是group提示红色，library提示蓝色
    dragenterStyle = libraryIndex == -1 ? "3px solid #f77c7c" : "3px solid #7cccf7"
}
const dragend = async () => {
    // true/false 拖动的是group/library
    if (_FocusLibraryIndex == -1) {
        if (_ToLibraryIndex == -1 && _FocusGroupIndex != _ToGroupIndex) {
            // group改顺序,isExpandGroup顺序也要改
            isExpandGroup.value.splice(_ToGroupIndex, 0, ...isExpandGroup.value.splice(_FocusGroupIndex, 1))
            // 删除拖动元素,添加到拖到的位置
            groups.value.splice(_ToGroupIndex, 0, ...groups.value.splice(_FocusGroupIndex, 1))
            updataGroupOrder()
        }
    }
    else {
        const sourceLibrary: library = groups.value[_FocusGroupIndex].librarys[_FocusLibraryIndex]
        // true/false 进入的是group/library
        if (_ToLibraryIndex == -1) {
            if (_FocusGroupIndex == _ToGroupIndex) {
                ElMessage.error('已在该组')
                return
            }
            else {
                groups.value[_FocusGroupIndex].librarys.splice(_FocusLibraryIndex, 1)
                groups.value[_ToGroupIndex].librarys.splice(0, 0, sourceLibrary)
                isExpandGroup.value[_ToGroupIndex] = true
            }
        }
        else {
            groups.value[_FocusGroupIndex].librarys.splice(_FocusLibraryIndex, 1)
            groups.value[_ToGroupIndex].librarys.splice(_ToLibraryIndex, 0, sourceLibrary)
        }
        // 先移动后删除
        await window.electronAPI.moveLibrary(groups.value[_ToGroupIndex].id, sourceLibrary.id)
        updataLibraryOrder(_ToGroupIndex)
    }
}
const dragenter = (e: any, groupIndex: number, libraryIndex: number = -1) => {
    e.preventDefault()
    _ToGroupIndex = groupIndex
    _ToLibraryIndex = libraryIndex
    // group托入library不显示样式
    if (_FocusLibraryIndex == -1 && _ToLibraryIndex != -1) return
    e.currentTarget.style.borderBottom = dragenterStyle
}
const dragleave = (e: MouseEvent) => {
    (e.currentTarget as HTMLDivElement).style.borderBottom = ""
}
</script>

<style scoped>
.leftBar {
    width: 230px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    overflow: hidden;
    border-right: 2px solid #eeeeed;
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
    height: 20px;
    margin-top: 20px;
    line-height: 20px;
    font-size: 13px;
    color: #787878;
}

.menuTitle .iconfont {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 2px;
    text-align: center;
}

.menuTitle .iconfont:hover {
    background-color: #d9d9d9;
}

.iconfont {
    font-size: 13px;
    font-weight: 700;
    margin-right: 5px;
}

.spaceBetween {
    display: flex;
    justify-content: space-between;
}

.contant {
    transform: all 0.3s;
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

:deep(.diaglog-input .is-focus) {
    box-shadow: 0 0 0 1px #9e94f7 inset;
}

.dialog-footer {
    display: flex;
    justify-content: center;
}

.dialog-footer button {
    width: 100%;
    background-color: #f6f8fa;
    border-color: #d5d8da;
    color: #e68d94;
}

.dialog-footer .confirmed {
    color: #cf222e;
}

.dialog-footer .confirmed:hover {
    background-color: #a40e26;
    color: #fff;
}
</style>
<style>
.dialog .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
}

.dialog .el-dialog__body p {
    color: #24292f;
    margin: 5px 0;
}

.dialog .el-dialog__body .el-input {
    margin-top: 5px;
}
</style>