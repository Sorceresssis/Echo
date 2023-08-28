<template>
    <!-- 不能用id="" 否则Transition无效 -->
    <div class="sidebar flex-col overflow-hidden">
        <div id="logo"
             class="titlebar">
            Echo
        </div>
        <div id="menu-wrap"
             class="flex-1 scrollbar-y-w4">
            <div>
                <div class="menu__title menu-row flex-row">
                    <div>
                        <span>{{ $t('siderBar.createdGroup') }}</span>
                    </div>
                    <div>
                        <span class="iconfont"
                              @click="getGroups">&#xe632;</span>
                        <span class="iconfont"
                              @click="openAddGroup">&#xe68c;</span>
                    </div>
                </div>
                <ul>
                    <li v-if="isVisAddGroup">
                        <div class="menu-row menu-group input-wrap">
                            <input v-model="newName"
                                   onfocus="this.select();"
                                   v-focus
                                   maxlength="255"
                                   spellcheck="false"
                                   @keyup.enter="($event.target as HTMLInputElement).blur()"
                                   @blur="handleAddGroup">
                        </div>
                    </li>
                    <li v-for="(group, idxGroup) in groups"
                        :key="group.id">
                        <div class="menuItem-wrap">
                            <div :class="[isExpandGroup[idxGroup] ? 'angle-down' : 'angle-right', groupIdOfRename === group.id ? 'input-wrap' : 'menu-item']"
                                 class="menu-row menu-group textover--ellopsis"
                                 @click="isExpandGroup[idxGroup] = !isExpandGroup[idxGroup]"
                                 @contextmenu="openCtm($event, idxGroup)"
                                 draggable="true"
                                 @dragstart="handleDragstart(idxGroup)"
                                 @dragend="handleDragend()"
                                 @dragenter.prevent="handleDragenter($event, idxGroup)"
                                 @dragleave="handleDragleave($event)">
                                <span v-if="groupIdOfRename !== group.id">{{ group.name }}</span>
                                <input v-else
                                       v-model="newName"
                                       onfocus="this.select();"
                                       v-focus
                                       maxlength="255"
                                       spellcheck="false"
                                       @keyup.enter="($event.target as HTMLInputElement).blur()"
                                       @blur="handleRename" />
                            </div>
                        </div>
                        <collapse-transition v-show="isExpandGroup[idxGroup]">
                            <ul>
                                <li v-if="idxGroup === idxGroupOfAddLibrary">
                                    <div class="menu-row  menu-library input-wrap">
                                        <input v-model="newName"
                                               onfocus="this.select();"
                                               v-focus
                                               maxlength="255"
                                               spellcheck="false"
                                               @keyup.enter="($event.target as HTMLInputElement).blur()"
                                               @blur="handleAddLibrary">
                                    </div>
                                </li>
                                <li v-for="(library, idxLibrary) in group.librarys"
                                    :key="library.id">
                                    <div class="menuItem-wrap">
                                        <div :class="[library.id === activeLibrary ? 'active-library' : '', libraryIdOfRename === library.id ? 'input-wrap' : 'menu-item']"
                                             class="menu-row menu-library textover--ellopsis"
                                             draggable="true"
                                             @click="openLibrary(library.id)"
                                             @contextmenu="openCtm($event, idxGroup, idxLibrary)"
                                             @dragstart="handleDragstart(idxGroup, idxLibrary)"
                                             @dragend="handleDragend()"
                                             @dragenter.prevent="handleDragenter($event, idxGroup, idxLibrary)"
                                             @dragleave="handleDragleave($event)">
                                            <span v-if="libraryIdOfRename !== library.id"
                                                  :title="library.name">{{ library.name }}</span>
                                            <input v-else
                                                   v-model="newName"
                                                   onfocus="this.select()"
                                                   v-focus
                                                   maxlength="255"
                                                   spellcheck="false"
                                                   @keyup.enter="($event.target as HTMLInputElement).blur()"
                                                   @blur="handleRename" />
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </collapse-transition>
                    </li>
                </ul>
            </div>
        </div>
        <dialog-delete-menu-item v-model="deleteDialogInfo"
                                 @handle-delete="handleDelete" />
        <context-menu v-model:show="isVisCtmGroup"
                      :options="ctmOptions">
            <context-menu-item :label="$t('ctm.addLibrary')"
                               @click="openAddLibrary" />
            <context-menu-item :label="$t('ctm.rename')"
                               @click="openRename" />
            <context-menu-item label="删除"
                               @click="openDelete">
                <template #icon>
                    <span class="iconfont">&#xe61a;</span>
                </template>
            </context-menu-item>
        </context-menu>
        <context-menu v-model:show="isVisCtmLibrary"
                      :options="ctmOptions">
            <context-menu-item label="面板"
                               @click="router.push(`/library/${ctmCurLib().id}`)" />
            <context-menu-item label="管理数据"
                               @click="router.push(`/library/${ctmCurLib().id}/manage`)">
                <template #icon> <span class="iconfont"></span> </template>
            </context-menu-item>
            <context-menu-sperator />
            <context-menu-item label="在新窗口中打开"
                               @click="openLibraryInNewWindow">
                <template #icon><span class="iconfont">&#xe7e9;</span></template>
            </context-menu-item>
            <context-menu-item label="重命名"
                               @click="openRename" />
            <context-menu-item label="删除"
                               @click="openDelete">
                <template #icon> <span class="iconfont">&#xe636;</span> </template>
            </context-menu-item>
            <context-menu-group label="移动到">
                <context-menu-item v-for="(group, idxGroup) in groups"
                                   :key="group.id"
                                   :label="group.name"
                                   @click="moveLibrary(idxGroup)" />
            </context-menu-group>
            <context-menu-item label="导出" />
        </context-menu>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, watch, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { $t } from '@/locales/index'
import { debounce } from '@/util/debounce'
import { throttle } from '@/util/throttle'
import { vFocus } from '@/util/directive'
import { sendCrosTabMsg, listenCrosTabMsg } from "@/util/CrosTabMsg"
import CollapseTransition from '@/components/CollapseTransition.vue'
import DialogDeleteMenuItem from './dialog/DialogDeleteMenuItem.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const bc = new BroadcastChannel('sideBar')
const bcMsg = 'getGroups'

onMounted(async () => {
    // 监听background发来的消息
    listenCrosTabMsg(bc, (e: MessageEvent) => {
        switch (e.data) {
            case 'getGroups':
                getGroups()
                break
        }
    })

    // 获取groups和启动就要打开的library。后台发送来的library(新建窗口打开) --> 上一次打开的library --> id=0 不打开任何library
    const firstOpenLibrary: number = (await Promise.all([getGroups(), getPrimaryOpenLibrary()]))[1] || JSON.parse(window.localStorage.getItem('lastActiveLibrary') || '0')

    // 为0到欢迎页，否则打开library页 
    if (firstOpenLibrary !== 0) {
        openLibrary(firstOpenLibrary)
    }

    // 获取group的展开信息，
    isExpandGroup.value = JSON.parse(window.localStorage.getItem('isExpandGroup') || "[]")

    // 检查isExpandGroup和groups的对应情况,少就补上false,
    if (isExpandGroup.value.length < groups.value.length) {
        isExpandGroup.value.concat(Array(groups.value.length - isExpandGroup.value.length).fill(false))
    }
})

/******************** 页面数据 ********************/
const groups = ref<Group[]>([])
const isExpandGroup = ref<boolean[]>([]) // 是否展开Group
const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number> // 正在打开的Library

// 保存侧边栏的group的展开信息
watch(isExpandGroup, debounce((newVal: boolean[]) => {
    window.localStorage.setItem('isExpandGroup', JSON.stringify(newVal))
}, 200), { deep: true })
// 保存最后打开的library
watch(activeLibrary, debounce((newVal: number) => {
    window.localStorage.setItem('lastActiveLibrary', newVal.toString())
}, 200))

// 获取侧边栏的group
const getGroups = throttle(async () => {
    groups.value = await window.electronAPI.getGroups()
}, 200)
// 获取优先打开的library
const getPrimaryOpenLibrary = async (): Promise<number | null> => {
    return new Promise<number | null>((resolve) => {
        window.electronAPI.getPrimaryOpenLibrary((e: any, libraryId: number) => {
            resolve(libraryId ? libraryId : null)
        })
    })
}
// 在本窗口打开library
const openLibrary = (id: number) => {
    if (id !== activeLibrary.value) {
        router.push(`/library/${id}`) // params 不能与 path 一起使用, 所以要自己补齐
    }
}
// 在新窗口中打开library
const openLibraryInNewWindow = () => {
    window.electronAPI.createMainWindow(ctmCurLib().id)
}

/******************** 右键菜单Ctm ********************/

// 操作的菜单项索引 Operation Index of Menu Item
const ctmOpIdx = {
    cg: -1, // current group
    cl: -1, // current library
    tg: -1, // target group
    tl: -1, // target library
}
const ctmCurGrp = (idxG?: number): Group => {
    return groups.value[idxG || ctmOpIdx.cg]
}
const ctmCurLib = (idxG?: number, idxL?: number): LibraryProfile => {
    return groups.value[idxG || ctmOpIdx.cg].librarys[idxL || ctmOpIdx.cl]
}
const ctmOptions = {
    zIndex: 3000,
    minWidth: 300,
    x: 500,
    y: 200
}
const isVisCtmGroup = ref(false)
const isVisCtmLibrary = ref(false)
const openCtm = (e: MouseEvent, idxGroup: number, idxLibrary: number = -1) => {
    ctmOptions.x = e.x
    ctmOptions.y = e.y
    if (idxLibrary == -1)
        isVisCtmGroup.value = true
    else
        isVisCtmLibrary.value = true
    ctmOpIdx.cg = idxGroup
    ctmOpIdx.cl = idxLibrary
}

/******************** 添加 & 重命名 ********************/
const newName = ref<string>('')
const isVisAddGroup = ref(false)
const openAddGroup = throttle(() => {
    newName.value = '新建组'
    isVisAddGroup.value = true
}, 500)
const handleAddGroup = async () => {
    isVisAddGroup.value = false
    if (newName.value.trim() === '') return
    const result = await window.electronAPI.addGroup(newName.value.trim())
    if (result) isExpandGroup.value.unshift(false)
    getGroups()
    sendCrosTabMsg(bc, bcMsg)
}
const idxGroupOfAddLibrary = ref<number>(-1)
const openAddLibrary = () => {
    newName.value = '新建库'
    idxGroupOfAddLibrary.value = ctmOpIdx.cg
    isExpandGroup.value[idxGroupOfAddLibrary.value] = true
}
const handleAddLibrary = async () => {
    const gId = groups.value[idxGroupOfAddLibrary.value].id
    idxGroupOfAddLibrary.value = -1
    if (newName.value.trim() === '') return
    await window.electronAPI.addLibrary(gId, newName.value.trim())
    getGroups()
    sendCrosTabMsg(bc, bcMsg)
}
const groupIdOfRename = ref<number>(0)
const libraryIdOfRename = ref<number>(0)
// 开启重命名
const openRename = () => {
    // 重命名的对象是group还是library
    if (ctmOpIdx.cl == -1) {
        groupIdOfRename.value = ctmCurGrp().id
        newName.value = ctmCurGrp().name
    } else {
        libraryIdOfRename.value = ctmCurLib().id
        newName.value = ctmCurLib().name
    }
}
const handleRename = async () => {
    if (newName.value.trim() === '') {
        ElMessage.error('不能为空')
        return
    }
    // 异步方法，保存operation的索引，防止在异步过程中，用户又进行了操作
    const cg = ctmOpIdx.cg
    const cl = ctmOpIdx.cl
    if (groupIdOfRename.value) {
        const result: boolean = await window.electronAPI.renameGroup(groupIdOfRename.value, newName.value)
        if (result) groups.value[cg].name = newName.value // 重命名成功，更新group的名字
        groupIdOfRename.value = 0 // 重置
    } else if (libraryIdOfRename.value) {
        const result: boolean = await window.electronAPI.renameLibrary(libraryIdOfRename.value, newName.value)
        if (result) groups.value[cg].librarys[cl].name = newName.value
        libraryIdOfRename.value = 0
    }
    sendCrosTabMsg(bc, bcMsg)
}

/******************** 删除 ********************/
const deleteDialogInfo = ref({
    isVis: false,
    confirmName: '',
    confirmInput: ''
})
const openDelete = () => {
    // 显示删除对话框，重置信息
    deleteDialogInfo.value.confirmInput = ''
    deleteDialogInfo.value.confirmName = ctmOpIdx.cl === -1
        ? ctmCurGrp().name : ctmCurLib().name
    deleteDialogInfo.value.isVis = true
}
const handleDelete = async () => {
    if (deleteDialogInfo.value.confirmInput !== deleteDialogInfo.value.confirmName) return
    const cg = ctmOpIdx.cg, cl = ctmOpIdx.cl
    if (cl === -1) {
        // 处理展开的问题
        await window.electronAPI.deleteGroup(ctmCurGrp(cg).id)
        isExpandGroup.value.splice(cg, 1)
    } else {
        await window.electronAPI.deleteLibrary(ctmCurLib(cg, cl).id)
    }
    /* TODO: 如果一个库被删除了，用户右打开了这个库，那么应该怎么办？
    * 但是正在打开的是这个库，那么应该怎么办？
    * 如果用户通过后退按钮，返回到了这个库，那么应该怎么办？，对不存在数据的处理
    */
    deleteDialogInfo.value.isVis = false
    getGroups()
    sendCrosTabMsg(bc, bcMsg)
}

/******************** 移动和拖动 ********************/
const handleDragstart = (idxGroup: number, idxLibrary: number = -1) => {
    ctmOpIdx.cg = idxGroup
    ctmOpIdx.cl = idxLibrary
}
/**
 * 把current向上拖动到target,current代替target的位置，target的位置后移  
 * 把current向下拖动到target,current代替target的位置，target的位置前移
 */
const handleDragend = async () => {
    const cg = ctmOpIdx.cg, cl = ctmOpIdx.cl,
        tg = ctmOpIdx.tg, tl = ctmOpIdx.tl
    if (cl === -1) { // 拖动的是group
        if (tl !== -1 || tg === cg) return // 如果进入的是library或者是自己，不进行操作
        const sourceGroup = groups.value.splice(cg, 1)[0] // 提出拖动的Group 
        isExpandGroup.value.splice(tg, 0, ...isExpandGroup.value.splice(cg, 1)) // 展开情况
        await window.electronAPI.sortGroup(sourceGroup.id, groups.value[tg]?.id || 0)
    } else { // 拖动的是library
        if (tg === cg && tl === cl) return
        const sourceLibrary = groups.value[cg].librarys.splice(cl, 1)[0]
        if (tl === -1) { // 拖入的是group
            if (cg === tg) return
            // 默认插入到组的第一个位置
            await window.electronAPI.sortLibrary(sourceLibrary.id,
                groups.value[tg].librarys[0]?.id || 0, groups.value[tg].id)
        } else { // 拖入的是library  
            await window.electronAPI.sortLibrary(sourceLibrary.id,
                groups.value[tg].librarys[tl]?.id || 0, groups.value[tg].id)
        }
    }
    getGroups()
    sendCrosTabMsg(bc, bcMsg)
}
const handleDragenter = (e: MouseEvent, idxGroup: number, idxLibrary: number = -1) => {
    ctmOpIdx.tg = idxGroup
    ctmOpIdx.tl = idxLibrary
    // 把组拖入库，不改变样式
    if (ctmOpIdx.cl === -1 && idxLibrary !== -1) return
    // 拖入组#409eff，拖入库#f77c7c
    (e.currentTarget as HTMLElement).style.borderBottom = `2px solid ${idxLibrary === -1 ? '#409eff' : '#f77c7c'}`
}
const handleDragleave = (e: MouseEvent) => {
    (e.currentTarget as HTMLElement).style.borderBottom = 'none';
}

/******************** 移动 ********************/
const moveLibrary = async (idxGroup: number) => {
    const cg = ctmOpIdx.cg, cl = ctmOpIdx.cl
    // 如果是移动到自己的组，不进行操作
    if (cg === idxGroup) {
        return
    }
    // 把library移动到groupId组的第一个位置
    await window.electronAPI.sortLibrary(
        groups.value[cg].librarys[cl].id,
        groups.value[idxGroup].librarys[0]?.id || 0,
        groups.value[idxGroup].id);
    getGroups()
    sendCrosTabMsg(bc, bcMsg)
}
</script>

<style scoped>
.sidebar {
    width: 230px;
    background-color: #fff;
    border-right: 2px solid #eeeeed;
}

#logo {
    padding: 0 20px;
    font-size: 30px;
}

#menu-wrap {
    width: 230px;
    box-sizing: border-box;
    padding: 0 15px;
    font-size: 13px;
}

.menuItem-wrap {
    padding: 5px 0;
}

.menu-row {
    display: flex;
    height: 32px;
    padding: 0 10px;
    line-height: 32px;
    box-sizing: border-box;
}

.menu__title {
    justify-content: space-between;
    color: #787878;
}

.menu__title .iconfont {
    padding: 4px;
    margin-left: 5px;
    font-size: 14px;
    font-weight: 700;
}

.menu__title .iconfont:hover {
    color: #000;
}

.menu-item {
    border-radius: 5px;
    cursor: pointer;
}

.menu-item:hover:not(.active-library) {
    background-color: var(--echo-theme-color-light6);
}

.active-library {
    color: #fff;
    background-color: var(--echo-theme-color);
}

.menu-group::before {
    display: inline-block;
    content: '\e608';
    font-family: "iconfont" !important;
    transition: all 0.3s;
    font-weight: 700;
    margin-right: 10px;
}

.menu-library::before {
    display: inline-block;
    content: '';
    width: 26px;
}

.angle-right::before {
    transform: rotateZ(0deg);
}

.angle-down::before {
    transform: rotateZ(90deg);
}

.input-wrap {
    border: 1px solid #929292;
    background-color: #fff;
    overflow: hidden;
}

.input-wrap input {
    width: 100%;
    border: none;
    outline: none;
}
</style>