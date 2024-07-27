<template>
    <el-config-provider :locale="getElLang()">
        <div v-loading="winowLoading"
             class="flex-1 flex-row overflow-hidden">
            <Transition name="collapse">
                <sidebar v-show="isOpenSideBar" />
            </Transition>
            <div class="flex-col">
                <div class="titlebar" />
                <div class="collapse-thumb-track">
                    <span @click="isOpenSideBar = !isOpenSideBar"
                          class="collapse-thumb iconfont"> &#xe653; </span>
                </div>
            </div>
            <div class="flex-1 flex-col overflow-hidden">
                <titlebar />
                <router-view v-slot="{ Component }"
                             class="main-container flex-1 flex-col overflow-hidden">
                    <keep-alive>
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </div>
        </div>
    </el-config-provider>
</template>

<script setup lang='ts'>
import { provide, reactive, ref } from 'vue'
import { getElLang } from '@/locale';
import InitialValue from '@/constant/Initial_value';
import { VueInjectKey } from '@/constant/channel_key';
import Sidebar from './Sidebar.vue'
import Titlebar from './Titlebar.vue'

const winowLoading = ref<boolean>(false)

// 正在使用的库, 只能在Titlebar.vue中修改, 其他地方只能读取
const activeLibrary = ref<number>(0)
const activeLibraryDetail = reactive<VO.LibraryDetail>(InitialValue.getLibraryDetail())


provide(VueInjectKey.WINDOW_LOADING, winowLoading)
provide(VueInjectKey.ACTIVE_LIBRARY, activeLibrary)
provide(VueInjectKey.ACTIVE_LIBRARY_DETAIL, activeLibraryDetail)


const isOpenSideBar = ref<boolean>(true)

</script>

<style scoped>
.main-container {
    font-size: 14px;
    padding: 0 10px;
}

.collapse-thumb-track {
    display: flex;
    flex: 1;
    align-items: center;
}

.collapse-thumb {
    height: 25px;
    line-height: 25px;
    color: #505050;
    transform: translateY(-25px);
    cursor: pointer;
}

.collapse-thumb:hover {
    color: var(--echo-theme-color);
}

.collapse-enter-from,
.collapse-leave-to {
    width: 0;
}

.collapse-enter-active,
.collapse-leave-active {
    transition: 0.5s;
}

.collapse-enter-to,
.collapse-leave-from {
    width: var(--echo-sidebar-width);
}
</style>