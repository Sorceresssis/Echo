<template>
    <!-- 不能用id="" 否则Transition无效 -->
    <div class="sidebar flex-col overflow-hidden">
        <div id="logo"
             class="titlebar">
            <img src="/logo.png"
                 class="icon" />
            <span>Echo</span>
        </div>
        <div id="menu-wrap"
             class="flex-1 scrollbar-y-w4">
            <div>
                <div class="menu__title menu-row flex-row">
                    <div> <span> {{ $t("layout.createdGroup") }} </span> </div>
                    <div>
                        <span class="iconfont"
                              :title="$t('layout.refresh')"
                              @click="getGroups">
                            &#xe61f;
                        </span>
                        <span class="iconfont"
                              :title="$t('layout.addGroup')"
                              @click="openAddGroup">
                            &#xe68c;
                        </span>
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
                                   @blur="createGroup" />
                        </div>
                    </li>
                    <li v-for="(group, idxGroup) in groups"
                        :key="group.id">
                        <div class="menu-item-wrap">
                            <div :class="[
                                expandedGroups[idxGroup] ? 'angle-down' : 'angle-right',
                                groupIdOfRename === group.id ? 'input-wrap' : 'menu-item',
                            ]"
                                 class="menu-row menu-group textover--ellopsis"
                                 @click="expandedGroups[idxGroup] = !expandedGroups[idxGroup]"
                                 @contextmenu="openCtm($event, idxGroup)"
                                 draggable="true"
                                 @dragstart="handleDragstart(idxGroup)"
                                 @dragend="handleDragend()"
                                 @dragenter.prevent="handleDragenter($event, idxGroup)"
                                 @dragleave="handleDragleave($event)">
                                <span v-if="groupIdOfRename !== group.id"
                                      :title="group.name"
                                      class="flex-1 textover--ellopsis">{{ group.name }}</span>
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
                        <el-collapse-transition v-show="expandedGroups[idxGroup]">
                            <ul>
                                <li v-if="idxGroup === idxGroupOfAddLibrary">
                                    <div class="menu-row menu-library input-wrap">
                                        <input v-model="newName"
                                               v-focus
                                               onfocus="this.select();"
                                               maxlength="255"
                                               spellcheck="false"
                                               @keyup.enter="($event.target as HTMLInputElement).blur()"
                                               @blur="handleAddLibrary" />
                                    </div>
                                </li>
                                <li v-for="(library, idxLibrary) in group.librarys"
                                    :key="library.id">
                                    <div class="menu-item-wrap">
                                        <div :class="[
                                            library.id === activeLibrary ? 'active-library' : '',
                                            libraryIdOfRename === library.id
                                                ? 'input-wrap'
                                                : 'menu-item']"
                                             class="menu-row menu-library"
                                             draggable="true"
                                             @click="openLibrary(library.id)"
                                             @contextmenu="openCtm($event, idxGroup, idxLibrary)"
                                             @dragstart="handleDragstart(idxGroup, idxLibrary)"
                                             @dragend="handleDragend()"
                                             @dragenter.prevent="handleDragenter($event, idxGroup, idxLibrary)"
                                             @dragleave="handleDragleave($event)">
                                            <span v-if="libraryIdOfRename !== library.id"
                                                  :title="library.name"
                                                  class="flex-1 textover--ellopsis">{{ library.name }}</span>
                                            <input v-else
                                                   v-model="newName"
                                                   onfocus="this.select()"
                                                   v-focus
                                                   maxlength="255"
                                                   spellcheck="false"
                                                   @dragstart.prevent
                                                   @click.prevent
                                                   @keyup.enter="($event.target as HTMLInputElement).blur()"
                                                   @blur="handleRename" />
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </el-collapse-transition>
                    </li>
                </ul>
            </div>
        </div>
        <dialog-delete-menu-item :delete-info="deleteDialogInfo"
                                 @handle-delete="handleDelete" />
        <context-menu v-model:show="showGroupCtm"
                      :options="ctmOptions">
            <context-menu-item :label="$t('layout.addLibrary')"
                               @click="openAddLibrary">
                <template #icon> <span class="iconfont">&#xe68c;</span> </template>
            </context-menu-item>
            <context-menu-item :label="$t('layout.rename')"
                               @click="openRename">
                <template #icon> <span class="iconfont">&#xe7fb;</span> </template>
            </context-menu-item>
            <context-menu-item :label="$t('layout.delete')"
                               @click="openDeleteDialog">
                <template #icon> <span class="iconfont">&#xe636;</span> </template>
            </context-menu-item>
            <context-menu-item :label="$t('layout.importLibrary')"
                               @click="importLibrary">
                <template #icon> <span class="iconfont">&#xe655;</span> </template>
            </context-menu-item>
        </context-menu>
        <context-menu v-model:show="showLibraryCtm"
                      :options="ctmOptions">
            <context-menu-item :label="$t('layout.panel')"
                               @click="router.push(RouterPathGenerator.libraryBashboard(getCurrentCtmLibrary().id))">
                <template #icon> <span class="iconfont">&#xe69c;</span> </template>
            </context-menu-item>
            <context-menu-item :label="$t('layout.manageData')"
                               @click="router.push(RouterPathGenerator.libraryManage(getCurrentCtmLibrary().id))">
                <template #icon> <span class="iconfont">&#xe617;</span> </template>
            </context-menu-item>
            <context-menu-item :label="$t('layout.openInNewWindow')"
                               @click="openLibraryInNewWindow">
                <template #icon><span class="iconfont">&#xe7e9;</span></template>
            </context-menu-item>
            <context-menu-sperator />
            <context-menu-item :label="$t('layout.rename')"
                               @click="openRename">
                <template #icon> <span class="iconfont">&#xe7fb;</span> </template>
            </context-menu-item>
            <context-menu-group :label="$t('layout.moveTo')">
                <context-menu-item v-for="(group, idxGroup) in groups"
                                   :key="group.id"
                                   :label="group.name"
                                   @click="moveLibrary(idxGroup)">
                </context-menu-item>
            </context-menu-group>
            <context-menu-item :label="$t('layout.delete')"
                               @click="openDeleteDialog">
                <template #icon> <span class="iconfont">&#xe636;</span> </template>
            </context-menu-item>
            <context-menu-item :label="$t('layout.openDataLocation')"
                               @click="openInExplorer(getCurrentCtmLibrary().dataPath)">
                <template #icon> <span class="iconfont">&#xe73e;</span> </template>
            </context-menu-item>
            <context-menu-item :label="$t('layout.export')"
                               @click="exportLibrary">
                <template #icon> <span class="iconfont">&#xe654;</span> </template>
            </context-menu-item>
        </context-menu>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch, inject, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { $t } from "@/locale";
import RouterPathGenerator from '@/router/router_path_generator';
import { debounce, throttle } from "@/util/common";
import { vFocus } from "@/util/directive";
import LocalStorage from "@/util/LocalStorage";
import CrosTabBroadcast from "@/util/CrosTabBroadcast";
import { VueInjectKey, LocalStorageKey, CrosTabBroadcastKey } from "@/constant/channel_key";
import { openInExplorer } from "@/util/systemUtil";
import { ElCollapseTransition } from "element-plus";
import DialogDeleteMenuItem from "./dialog/DialogDeleteMenuItem.vue";

const tabBroadcast = new CrosTabBroadcast(CrosTabBroadcastKey.CHANNEL.mainTab)
const tabBroadcastMsg = {
    type: CrosTabBroadcastKey.MSG_TYPE.reloadGroups,
    payload: void 0
}
const router = useRouter();

const activeLibrary = inject<Ref<number>>(VueInjectKey.ACTIVE_LIBRARY)!;
const activeLibraryDetail = inject<VO.LibraryDetail>(VueInjectKey.ACTIVE_LIBRARY_DETAIL)!;

const groups = ref<VO.Group[]>([]);
const expandedGroups = ref<boolean[]>([]);

// 请求groups
const getGroups = async () => {
    groups.value = await window.dataAPI.getGroups();
}

// 在本窗口打开library
const openLibrary = (id: number) => {
    if (id !== activeLibrary.value) {
        router.push(RouterPathGenerator.libraryBashboard(id));
    }
};

// 在新窗口中打开library
const openLibraryInNewWindow = () => {
    window.electronAPI.createMainWindow(getCurrentCtmLibrary().id);
};

/******************** 右键菜单Ctm ********************/
const ctmOptions = {
    zIndex: 3000,
    minWidth: 220,
    x: 500,
    y: 200,
};
// 操作的菜单项索引 Operation Index of Menu Item
const ctmOpIdx = {
    cg: -1, // current group
    cl: -1, // current library
    tg: -1, // target group
    tl: -1, // target library
};
const getCurrentCtmGroup = (idxG?: number): VO.Group => {
    return groups.value[idxG || ctmOpIdx.cg];
};
const getCurrentCtmLibrary = (idxG?: number, idxL?: number): VO.Library => {
    return groups.value[idxG || ctmOpIdx.cg].librarys[idxL || ctmOpIdx.cl];
};
const showGroupCtm = ref(false);
const showLibraryCtm = ref(false);
const openCtm = (e: MouseEvent, idxGroup: number, idxLibrary: number = -1) => {
    ctmOptions.x = e.x;
    ctmOptions.y = e.y;
    ctmOpIdx.cg = idxGroup;
    ctmOpIdx.cl = idxLibrary;
    if (idxLibrary == -1) showGroupCtm.value = true;
    else showLibraryCtm.value = true;
};

/******************** 添加 & 重命名 ********************/
const newName = ref<string>("");
const isVisAddGroup = ref(false);
const openAddGroup = throttle(() => {
    newName.value = $t("layout.newGroup");
    isVisAddGroup.value = true;
}, 500);
const createGroup = async () => {
    isVisAddGroup.value = false;
    if (newName.value.trim() === "") return;
    await window.dataAPI.createGroup(newName.value.trim());
    expandedGroups.value.unshift(true);
    getGroups();
    tabBroadcast.sendMsg<void>(tabBroadcastMsg)

};
const idxGroupOfAddLibrary = ref<number>(-1);
const openAddLibrary = () => {
    newName.value = $t("layout.newLibrary");
    idxGroupOfAddLibrary.value = ctmOpIdx.cg;
    expandedGroups.value[idxGroupOfAddLibrary.value] = true;
};
const handleAddLibrary = async () => {
    const gId = groups.value[idxGroupOfAddLibrary.value].id;
    idxGroupOfAddLibrary.value = -1;
    if (newName.value.trim() === "") return;
    await window.dataAPI.createLibrary(gId, newName.value.trim());
    getGroups();
    tabBroadcast.sendMsg(tabBroadcastMsg)
};
const groupIdOfRename = ref<number>(0);
const libraryIdOfRename = ref<number>(0);
// 开启重命名
const openRename = () => {
    // 重命名的对象是group还是library
    if (ctmOpIdx.cl == -1) {
        groupIdOfRename.value = getCurrentCtmGroup().id;
        newName.value = getCurrentCtmGroup().name;
    } else {
        libraryIdOfRename.value = getCurrentCtmLibrary().id;
        newName.value = getCurrentCtmLibrary().name;
    }
};
const handleRename = async () => {
    if (newName.value.trim() === "") {
        groupIdOfRename.value = 0;
        libraryIdOfRename.value = 0;
        return;
    }
    // 异步方法，保存operation的索引，防止在异步过程中，用户又进行了操作
    const cg = ctmOpIdx.cg;
    const cl = ctmOpIdx.cl;
    if (groupIdOfRename.value) {
        const result: boolean = await window.dataAPI.renameGroup(
            groupIdOfRename.value,
            newName.value
        );
        if (result) groups.value[cg].name = newName.value; // 重命名成功，更新group的名字
        groupIdOfRename.value = 0; // 重置
    } else if (libraryIdOfRename.value) {
        activeLibraryDetail.name = newName.value;
        const result: boolean = await window.dataAPI.renameLibrary(
            libraryIdOfRename.value,
            newName.value
        );
        if (result) groups.value[cg].librarys[cl].name = newName.value;
        libraryIdOfRename.value = 0;
    }
    tabBroadcast.sendMsg(tabBroadcastMsg)
};

/******************** 删除 ********************/
const deleteDialogInfo = reactive({
    show: false,
    confirmName: "",
    confirmInput: "",
});
const openDeleteDialog = () => {
    // 显示删除对话框，重置信息
    deleteDialogInfo.confirmInput = "";
    deleteDialogInfo.confirmName = ctmOpIdx.cl === -1 ? getCurrentCtmGroup().name : getCurrentCtmLibrary().name;
    deleteDialogInfo.show = true;
};
const handleDelete = async () => {
    if (deleteDialogInfo.confirmInput !== deleteDialogInfo.confirmName) return;
    const cg = ctmOpIdx.cg, cl = ctmOpIdx.cl;
    if (cl === -1) {
        // 如果正在打开的library在删除的group中，关闭
        getCurrentCtmGroup(cg).librarys.forEach((l) => {
            if (l.id === activeLibrary.value) {
                router.push(RouterPathGenerator.welcome());
            }
        });
        window.dataAPI.deleteGroup(getCurrentCtmGroup(cg).id).then(() => {
            expandedGroups.value.splice(cg, 1);
            getGroups();
            tabBroadcast.sendMsg(tabBroadcastMsg)
        })
    } else {
        if (getCurrentCtmLibrary(cg, cl).id === activeLibrary.value) {
            router.push(RouterPathGenerator.welcome());
        }
        window.dataAPI.deleteLibrary(getCurrentCtmLibrary(cg, cl).id).then(() => {
            getGroups();
            tabBroadcast.sendMsg(tabBroadcastMsg)
        })
    }

    deleteDialogInfo.show = false;
};

/******************** 移动和拖动 ********************/
const handleDragstart = (idxGroup: number, idxLibrary: number = -1) => {
    ctmOpIdx.cg = idxGroup;
    ctmOpIdx.cl = idxLibrary;
};
/**
 * 把current向上拖动到target,current代替target的位置，target的位置后移
 * 把current向下拖动到target,current代替target的位置，target的位置前移
 */
const handleDragend = async () => {
    const cg = ctmOpIdx.cg,
        cl = ctmOpIdx.cl,
        tg = ctmOpIdx.tg,
        tl = ctmOpIdx.tl;
    if (cl === -1) {
        // 拖动的是group
        if (tl !== -1 || tg === cg) return; // 如果进入的是library或者是自己，不进行操作
        const sourceGroup = groups.value.splice(cg, 1)[0]; // 提出拖动的Group
        expandedGroups.value.splice(tg, 0, ...expandedGroups.value.splice(cg, 1)); // 展开情况
        await window.dataAPI.changeGroupOrder(
            sourceGroup.id,
            groups.value[tg]?.id || 0
        );
    } else {
        // 拖动的是library
        if ((tg === cg && tl === cl) || (tl === -1 && cg === tg)) return; // 拖入自己的位置或者拖入当前的group, 不操作
        const sourceLibrary = groups.value[cg].librarys.splice(cl, 1)[0];
        tl === -1 // 拖入的是group : 拖入的是library
            ? await window.dataAPI.changeLibraryOrder(
                sourceLibrary.id,
                groups.value[tg].librarys[0]?.id || 0,
                groups.value[tg].id
            ) // 默认插入到组的第一个位置
            : await window.dataAPI.changeLibraryOrder(
                sourceLibrary.id,
                groups.value[tg].librarys[tl]?.id || 0,
                groups.value[tg].id
            );
    }
    getGroups();
    tabBroadcast.sendMsg(tabBroadcastMsg)
};
const handleDragenter = (
    e: MouseEvent,
    idxGroup: number,
    idxLibrary: number = -1
) => {
    ctmOpIdx.tg = idxGroup;
    ctmOpIdx.tl = idxLibrary;
    // 把组拖入库，不改变样式
    if (ctmOpIdx.cl === -1 && idxLibrary !== -1) return;
    // 拖入组#409eff，拖入库#f77c7c
    (e.currentTarget as HTMLElement).style.borderBottom = `2px solid ${idxLibrary === -1 ? "#409eff" : "#f77c7c"}`;
};
const handleDragleave = (e: MouseEvent) => {
    (e.currentTarget as HTMLElement).style.borderBottom = "none";
};

/******************** 移动 ********************/
const moveLibrary = async (idxGroup: number) => {
    const cg = ctmOpIdx.cg, cl = ctmOpIdx.cl;
    // 如果是移动到自己的组，不进行操作
    if (cg === idxGroup) return;
    // 把library移动到groupId组的第一个位置
    await window.dataAPI.changeLibraryOrder(
        groups.value[cg].librarys[cl].id,
        groups.value[idxGroup].librarys[0]?.id || 0,
        groups.value[idxGroup].id
    );
    getGroups();
    tabBroadcast.sendMsg(tabBroadcastMsg)
};

const importLibrary = () => {
    const groupId = getCurrentCtmGroup().id;
    window.electronAPI.openDialog("file", true, $t("layout.selectImportData"))
        .then((paths) => {
            if (!paths.length) return;
            window.dataAPI.importLibrary(groupId, paths);
        });
};

const exportLibrary = () => {
    const libraryId = getCurrentCtmLibrary().id;
    window.electronAPI
        .openDialog("dir", false, $t("layout.selectExportLocation"))
        .then((paths) => {
            if (!paths.length) return;
            window.dataAPI.exportLibrary(libraryId, paths[0]);
        });
};

// 监听groups和expandedGroups的变化，保存到localStorage
watch(expandedGroups, debounce((data) => {
    LocalStorage.set(LocalStorageKey.EXPANDED_GROUPS, data)
}, 500), { deep: true });
watch(activeLibrary, debounce((n) => {
    LocalStorage.set(LocalStorageKey.PREVIOUS_ACTIVE_LIBRARY, n)
}, 500));

// 获取优先打开的library
const getPrimaryOpenLibrary = async (): Promise<number | undefined> => {
    return new Promise<number | undefined>((resolve) => {
        window.dataAPI.getPrimaryOpenLibrary((e: any, libraryId: number) => {
            resolve(libraryId);
        });
    });
};

onMounted(async () => {
    tabBroadcast.onMessage((e: MessageEvent) => {
        if (e.data.type === CrosTabBroadcastKey.MSG_TYPE.reloadGroups) {
            getGroups();
        }
    });


    // 获取groups, 首要打开的library
    const firstOpenLibrary: number =
        (await Promise.all([getGroups(), getPrimaryOpenLibrary()]))[1] ||
        LocalStorage.get(LocalStorageKey.PREVIOUS_ACTIVE_LIBRARY) || 0;

    // 为0到欢迎页，否则打开library页
    if (firstOpenLibrary !== 0) {
        openLibrary(firstOpenLibrary);
    }

    // 获取group的展开信息，
    expandedGroups.value = LocalStorage.get(LocalStorageKey.EXPANDED_GROUPS) ?? [];

    // 检查expandedGroups和groups的对应情况,少就补上false,
    if (expandedGroups.value.length < groups.value.length) {
        expandedGroups.value.concat(
            Array(groups.value.length - expandedGroups.value.length).fill(false)
        );
    }
});
</script>

<style scoped>
.sidebar {
    width: var(--echo-sidebar-width);
    background-color: #fff;
    border-right: 2px solid #eeeeed;
}

#logo {
    padding: 0 20px;
    font-size: 30px;
    display: flex;
    justify-content: start;
    align-items: center;
}

#logo .icon {
    margin-right: 10px;
    width: 40px;
    height: 40px;
}

#menu-wrap {
    width: var(--echo-sidebar-width);
    box-sizing: border-box;
    padding: 0 10px;
    font-size: 13px;
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
    color: var(--echo-theme-color);
}

.menu-item-wrap {
    padding: 5px 0;
}

.menu-row {
    display: flex;
    height: 32px;
    padding: 0 10px;
    line-height: 32px;
    box-sizing: border-box;
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
    content: "\e608";
    font-family: "iconfont" !important;
    transition: all 0.3s;
    font-weight: 700;
    margin-right: 10px;
}

.angle-right::before {
    transform: rotateZ(0deg);
}

.angle-down::before {
    transform: rotateZ(90deg);
}

.menu-library::before {
    display: inline-block;
    content: "";
    width: 26px;
}

.input-wrap {
    border: 1px solid #929292;
    background-color: #fff;
}

.input-wrap input {
    width: 100%;
    border: none;
    outline: none;
}
</style>
