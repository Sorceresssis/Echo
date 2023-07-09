<template>
    <!-- 不能用id="" 否则Transition无效 -->
    <div class="sidebar flex-col overflow-hidden">
        <div id="logo"
             class="titlebar">
            Echo
        </div>
        <div id="menu-wrap"
             class="flex-1 scrollbar-y">
            <div class="menu">
                <div class="menu__title menu-row flex-row">
                    <div>
                        <span>{{ $t('siderBar.createdGroup') }}</span>
                    </div>
                    <div>
                        <span class="iconfont"
                              @click="">&#xe632;</span>
                        <span class="iconfont"
                              @click="">&#xe68c;</span>
                    </div>
                </div>
                <ul>
                    <li></li>
                    <li v-for="(group, idxGroup) in groups"
                        :key="group.id">
                        <div v-if="true"
                             :class="[isExpandGroup[idxGroup] ? 'angle-down' : 'angle-right']"
                             class="menu-item menu-row menu-group textover--ellopsis"
                             @click="isExpandGroup[idxGroup] = !isExpandGroup[idxGroup]"
                             @contextmenu="openCtm($event, idxGroup)">
                            {{ group.name }}
                        </div>
                        <el-input v-else />
                        <collapse-transition v-show="isExpandGroup[idxGroup]">
                            <ul>
                                <li></li>
                                <li v-for="(library, idxLibrary) in group.librarys"
                                    :key="library.id">
                                    <div v-if="true"
                                         :class="{ 'active-library': library.id === activeLibrary }"
                                         class="menu-item menu-row menu-library textover--ellopsis"
                                         @click="openLibrary(library.id)"
                                         @contextmenu="openCtm($event, idxGroup, idxLibrary)">
                                        {{ library.name }}
                                    </div>
                                    <el-input v-else />
                                </li>
                            </ul>
                        </collapse-transition>
                    </li>
                </ul>
            </div>
        </div>
        <div>
            <context-menu v-model:show="isVisibleCtmGroup"
                          :options="ctmOptions">
                <context-menu-item :label="t('ctm.addLibrary')"
                                   @click="" />
                <context-menu-item :label="t('ctm.rename')"
                                   @click=" " />
                <context-menu-item label="删除"
                                   @click=" ">
                    <template #icon>
                        <span class="iconfont">&#xe61a;</span>
                    </template>
                </context-menu-item>
            </context-menu>
            <context-menu v-model:show="isVisibleCtmLibrary"
                          :options="ctmOptions">
                <context-menu-item label="在新窗口中打开"
                                   @click=" " />
                <context-menu-item label="重命名"
                                   @click=" " />
                <context-menu-item label="删除"
                                   @click=" ">
                    <template #icon>
                        <span class="iconfont">&#xe61a;</span>
                    </template>
                </context-menu-item>
                <context-menu-sperator />
                <context-menu-group label="移动到">
                    <context-menu-item v-for="(group, groupIndex) in groups"
                                       :key="group.id"
                                       :label="group.name"
                                       @click=" " />
                </context-menu-group>
                <context-menu-item label="导出" />
            </context-menu>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ElMessage } from 'element-plus';
import { ref, Ref, watch, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { t } from '../locales'
import { debounce } from '../util/debounce'
import CollapseTransition from '../components/CollapseTransition.vue'

const router = useRouter()

// 和展开的情况
const groups = ref<Group[]>([])
const isExpandGroup = ref<boolean[]>([false, false, false, false, false, false])
// 正在打开的Library
const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>


const getGroups = async () => {
    groups.value = await window.electronAPI.getGroups()
}
const openLibrary = (id: number) => {
    if (id !== activeLibrary.value) {
        router.push(`/library/${id}`)
    }
}

// TODO 修改
const getStartOpenDB = () => {
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

let _CURRENT_IDXGROUP_ = -1, _CURRENT_IDXLIBRARY_ = -1,
    _TARGET_IDXGROUP_ = -1, _TARGET_IDXLIBRARY_ = -1
/******************** 右键菜单Ctm ********************/
const ctmOptions = {
    zIndex: 3000,
    minWidth: 300,
    x: 500,
    y: 200
}
const isVisibleCtmGroup = ref(false)
const isVisibleCtmLibrary = ref(false)
const openCtm = (e: MouseEvent, idxGroup: number, idxLibrary: number = -1) => {
    ctmOptions.x = e.x
    ctmOptions.y = e.y
    if (idxLibrary == -1)
        isVisibleCtmGroup.value = true
    else
        isVisibleCtmLibrary.value = true
    _CURRENT_IDXGROUP_ = idxGroup
    _CURRENT_IDXLIBRARY_ = idxLibrary
}

watch(isExpandGroup, debounce((newVal: boolean[]) => {
    window.localStorage.setItem('isExpandGroup', JSON.stringify(newVal))
}, 200), { deep: true })

watch(activeLibrary, debounce((newVal: number) => {
    window.localStorage.setItem('lastActiveLibrary', JSON.stringify(newVal))
}, 200))

onMounted(async () => {
    // 获取group的展开信息，
    isExpandGroup.value = JSON.parse(window.localStorage.getItem('isExpandGroup') || "[]")

    // 获取groups 
    await getGroups()

    // 检查isExpandGroup和groups的对应情况,少就补上false,
    while (isExpandGroup.value.length < groups.value.length) {
        isExpandGroup.value.push(false)
    }

    // 获取启动就要打开的library。循序为后台发送来的library(新建窗口打开) --> 上一次打开的library --> id=0 不打开任何library
    const firstOpenLibrary: number = (await getStartOpenDB()) || JSON.parse(window.localStorage.getItem('lastActiveLibrary') || '0')

    // 为0到欢迎页，否则打开library页
    if (firstOpenLibrary !== 0) {
        openLibrary(firstOpenLibrary)
    }
})
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
    font-weight: 400;
}

#menu-wrap {
    width: 230px;
    box-sizing: border-box;
    padding: 0 15px;
    font-size: 13px;
}

.scrollbar-y::-webkit-scrollbar {
    width: 4px;
}

.scrollbar-y::-webkit-scrollbar-thumb {
    border-radius: 2px;
}

.menu-row {
    height: 32px;
    margin-bottom: 10px;
    padding: 0 10px;
    line-height: 32px;
    border-radius: 5px;
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
    cursor: pointer;
}

.menu-item:hover:not(.active-library) {
    background-color: #f1f0fe;
}

.active-library {
    background-color: #887cf7;
    color: #fff;
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
</style>