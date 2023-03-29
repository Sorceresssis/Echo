<template>
    <div class="titleBar">
        <span class="iconfont"
              @click="isVisibleSetting = true">&#xe657;</span>
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
        <el-dialog v-model="isVisibleSetting"
                   align-center
                   width="500px"
                   title="设置">
            <div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isVisibleSetting = false">Cancel</el-button>
                    <el-button type="primary"
                               @click="isVisibleSetting = false">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
let isMaxmize = ref<boolean>();

// 监听窗口是否最大化
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


/******************** Dailog ********************/
const isVisibleSetting = ref<boolean>(false)
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