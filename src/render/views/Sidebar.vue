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
                    <li v-for="(group, idx_group) in groups"
                        :key="group.id">
                        <div v-if="true"
                             :class="[isExpandGroup[idx_group] ? 'angle-down' : 'angle-right']"
                             class="menu-item menu-row menu-group textover--ellopsis"
                             @click="isExpandGroup[idx_group] = !isExpandGroup[idx_group]">
                            {{ group.name }}
                        </div>
                        <el-input v-else />
                        <ul>
                            <li></li>
                            <li v-for="(library, idx_library) in group.librarys"
                                :key="library.id">
                                <div v-if="true"
                                     :class="{ 'active-library': library.id === activeLibrary.id }"
                                     class="menu-item menu-row menu-library textover--ellopsis"
                                     @click="openLibrary(library)">
                                    {{ library.name }}
                                </div>
                                <el-input v-else />
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div>

        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, watch, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

// 和展开的情况
const groups = ref<IGroup[]>([])
const isExpandGroup = ref<boolean[]>([false, false, false, false, false, false])
const getGroups = () => {
    // window.electronAPI.getGroups().then((res: IGroup[]) => {
    //     groups.value = res
    // })
}

// 正在打开的Library
const activeLibrary = inject<Ref<Library>>('activeLibrary') as Ref<Library>
const openLibrary = (l: Library) => {
    if (l.id !== activeLibrary.value.id) {
        activeLibrary.value = l
        router.push(`/library/${l.id}`)
    }
}

watch(isExpandGroup, (newVal: boolean[]) => {
}, { deep: true })
watch(activeLibrary, (newVal: Library) => {
})

onMounted(() => {
    groups.value = [
        { id: 1, name: 'ACG', librarys: [{ id: 1, name: 'Comic', }, { id: 2, name: 'game' }, { id: 15, name: '的烦烦烦烦烦烦烦烦烦烦烦烦反对法放发达发达反对法' }] },
        { id: 2, name: 'Art', librarys: [{ id: 3, name: '油画' }, { id: 4, name: '电影' }, { id: 14, name: '照片' }] },
        { id: 3, name: 'Music', librarys: [{ id: 5, name: '古典' }, { id: 6, name: '流行' }] },
        { id: 4, name: 'Life', librarys: [{ id: 7, name: '旅游' }, { id: 8, name: '美食' }, { id: 13, name: '宠物' }] },
        { id: 5, name: 'Tech', librarys: [{ id: 9, name: '前端' }, { id: 10, name: '后端' }, { id: 12, name: 'AI' }] },
        { id: 6, name: 'Others', librarys: [{ id: 11, name: '其他' }] },
    ]
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
    margin: 10px 0;
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