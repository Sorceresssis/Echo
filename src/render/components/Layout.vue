<template>
    <div class="layout">
        <Transition name="slide">
            <LeftBar v-show="isOpenSideBar"></LeftBar>
        </Transition>
        <div id="slideTrack">
            <div></div>
            <div>
                <span @click="isOpenSideBar = !isOpenSideBar"
                      id="slideButton"
                      class="iconfont">&#xe653;</span>
            </div>
        </div>
        <div class="rightContainer">
            <TitleBar></TitleBar>
            <router-view class="mainContainer"></router-view>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { provide, ref, onMounted } from 'vue'
import LeftBar from './SideBar.vue'
import TitleBar from './TitleBar.vue';

/* 正在打开的Library */
const activeLibrary = ref<library>({ id: 0, name: '' })
provide('activeLibrary', activeLibrary)

/* 侧边开关 */
const isOpenSideBar = ref<boolean>(true)

onMounted(async () => {
    // enum OpenDialogType { DIR, FILE, IMAGE, VIDEO }
    // console.log(await window.electronAPI.openDialog(OpenDialogType.DIR, true));
    // console.log(await window.electronAPI.devTest())
})
</script>

<style scoped>
.layout {
    display: flex;
    height: 100%;
    overflow: hidden;
}

#slideTrack {
    display: flex;
    flex-direction: column;
    background-color: #f6f6f8;
}

#slideTrack>div:nth-child(1) {
    height: 40px;
    -webkit-app-region: drag;
}

#slideTrack>:nth-child(2) {
    flex: 1;
    display: flex;
    align-items: center;
    color: #505050;
}

#slideButton {
    height: 25px;
    line-height: 25px;
}

#slideButton:hover {
    color: #887cf7;
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

.rightContainer {
    flex: 1;
    /* important 防止white-space: no-wrap 打破 flex, 让min-width重新计算 */
    min-width: 0;
    display: flex;
    flex-direction: column;
    background-color: #f6f6f8;
}

.mainContainer {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    padding-right: 16px;
    background-color: #f6f6f8;
    overflow: hidden;
}
</style>

<style>
.button {
    display: inline-block;
    flex-shrink: 0;
    height: 26px;
    padding: 0 15px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    box-shadow: 0 0 4px 1px #eaeaea inset;
    background-color: #fff;
    vertical-align: bottom;
    line-height: 26px;
    font-size: 13px;
}

.button:hover {
    background-color: #e7e7e7;
}

.button span {
    display: inline-block;
    line-height: 24px;
    width: 100%;
    height: 100%;
    vertical-align: top;
    color: #474747;
}

.button span:active {
    transform: translate(.5px, .5px);
}
</style>