<template>
    <div class="layout">
        <LeftBar></LeftBar>
        <div class="rightContainer">
            <TitleBar></TitleBar>
            <MainContainer></MainContainer>
        </div>
    </div>
</template>

<script setup lang='ts'>
import LeftBar from './LeftBar.vue'
import TitleBar from './TitleBar.vue';
import MainContainer from './MainContainer.vue';


</script>

<style scoped>
.layout {
    display: flex;
    height: 100%;
    overflow: hidden;
}

.rightContainer {
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>