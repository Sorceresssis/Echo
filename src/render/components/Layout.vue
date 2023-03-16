<template>
    <div class="layout">
        <Transition name="slide">
            <LeftBar v-show="flag"></LeftBar>
        </Transition>
        <div id="slideTrack">
            <div></div>
            <div>
                <span @click="flag = !flag"
                      id="slideButton"
                      class="iconfont">&#xe653;</span>
            </div>
        </div>
        <div class="rightContainer">
            <TitleBar></TitleBar>
            <MainContainer></MainContainer>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import LeftBar from './LeftBar.vue'
import TitleBar from './TitleBar.vue';
import MainContainer from './MainContainer.vue';

const flag = ref<boolean>(true)
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
    background-color: #fff;
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
    width: 200px;
}

.rightContainer {
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>