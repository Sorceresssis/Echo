<template>
    <main-container :component-list="componentList"></main-container>
    <!-- <dialog-manage-data></dialog-manage-data> -->
</template>
 
<script lang="ts" setup>
import { shallowReactive } from 'vue';
import MainContainer from '../../../components/MainContainer.vue';
import DialogManageData from '../DialogManageData.vue';


const componentList = shallowReactive([
    { id: 1, name: 'f4f', component: null },
    { id: 2, name: 'dd', component: null },
    { id: 3, name: 'cc', component: null },
    { id: 4, name: 'dd', component: null },

])  
</script>

<style scoped></style>