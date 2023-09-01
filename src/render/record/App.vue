<template>
    <div class="flex-1 flex-col overflow-hidden">
        <title-bar></title-bar>
        <router-view class="">
        </router-view>
        <!-- <div class="flex-1 flex-row overflow-hidden box-shadow-1"
             style="margin:10px 20px;
               background-color: #fff;
               border-radius: 5px;">

            <div style="width: 250px;
                        margin: 10px;">

            </div>
            <div class="flex-1 "
                 style="width: 250px;
                        margin: 10px;">

            </div>
            <div style="width: 250px;
                        margin: 10px;">

            </div>
        </div> -->
    </div>
</template>

<script setup lang='ts'>
import { provide, ref } from 'vue'
import TitleBar from './views/TitleBar.vue';

/* 正在打开的Library */
const activeLibrary = ref<number>(0)
provide('activeLibrary', activeLibrary)

/* 侧边开关 */
const isOpenSideBar = ref<boolean>(true)
</script>

<style scoped>
.slide-track {
    align-items: center;
}

.slide-thumb {
    height: 25px;
    line-height: 25px;
    color: #505050;
    transform: translateY(-25px);
}

.slide-thumb:hover {
    color: var(--echo-theme-color);
}

.slide-enter-from,
.slide-leave-to {
    width: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: 0.5s;
}

.slide-enter-to,
.slide-leave-from {
    width: 230px;
}

.main-container {
    font-size: 14px;
    padding: 0 10px;
}
</style>