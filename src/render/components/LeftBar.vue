<template>
    <div class="leftBar">
        <div id="logo">echo</div>
        <div class="groupList"></div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

</script>

<style scoped>
.leftBar {
    display: flex;
    width: 230px;
    height: 100%;
    flex-direction: column;
    background-color: #f0f0f0;
}

#logo {
    height: 50px;
    -webkit-app-region: drag;
}

.groupList {
    flex: 1;
}
</style>