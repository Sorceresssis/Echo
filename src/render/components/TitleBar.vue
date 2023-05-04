<template>
    <div class="titleBar">
        <div>
            <span class="iconfont"
                  @click="router.go(-1)">&#xe66d;</span>
            <span class="iconfont"
                  @click="router.go(1)">&#xe66c;</span>
        </div>
        <div>
            <span class="iconfont"
                  @click="router.push('/setting')">&#xe657;</span>
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
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/******************** 窗口 ********************/
let isMaxmize = ref<boolean>();
window.electronAPI.windowIsMaxmize((e: any, value: boolean) => {
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
</script>

<style scoped>
.titleBar {
    display: flex;
    height: 50px;
    justify-content: space-between;
    align-items: center;
    line-height: 40px;
    padding: 0 8px;
    -webkit-app-region: drag;
}

span,
i {
    color: #7b7b7b;
    height: 30px;
    margin-right: 14px;
    padding: 0 5px;
    -webkit-app-region: no-drag;
}

span:hover {
    color: #887cf7;
}
</style>