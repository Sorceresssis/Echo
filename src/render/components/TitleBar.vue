<template>
    <div class="titleBar">
        <span class="iconfont"
              @click="">&#xe657;</span>
        <i>|</i>
        <span class="iconfont"
              @click="windowMinmize()">&#xe609;</span>
        <span v-show="isMaxmize"
              class="iconfont"
              @click="windowMaxmize()">&#xe7bf;</span>
        <span v-show="!isMaxmize"
              class="iconfont"
              @click="windowMaxmize()">&#xe606;</span>
        <span class="iconfont"
              @click="windowClose()">&#xebbf;</span>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
let isMaxmize = ref<boolean>();

// 监听窗口是否最大化
window.electronAPI.windowAcceptIsMaxmize((e: any, value: any) => {
    isMaxmize.value = value
})
function windowMinmize() {
    window.electronAPI.windowMinmize()
}
function windowMaxmize() {
    window.electronAPI.windowMaxmize()
}
function windowClose() {
    window.electronAPI.windowClose()
}

function openSetting() {

}
</script>

<style scoped>
.titleBar {
    display: flex;
    height: 40px;
    justify-content: right;
    align-items: center;
    line-height: 40px;
    padding: 0 8px;
    background-color: #fff;
    -webkit-app-region: drag;
}

.iconfont {
    font-weight: 700;
    color: #7b7b7b
}

i {
    height: 34px;
    margin: 0 7px;
    padding: 0 5px;
    color: #7b7b7b;
}

span {
    height: 30px;
    margin: 0 7px;
    padding: 0 5px;
    -webkit-app-region: no-drag;
}

span:hover {
    color: #887cf7;
}
</style>