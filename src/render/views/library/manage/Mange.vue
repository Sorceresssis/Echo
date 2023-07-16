<template>
    <tabs :component-list="componentList">
        <template v-slot:header>
            这是头
        </template>
    </tabs>
    <!-- <dialog-manage-data></dialog-manage-data> -->
</template>
 
<script lang="ts" setup>
import { shallowReactive } from 'vue';
import Tabs from '../../../components/Tabs.vue';
import DialogManageData from '../DialogManageData.vue';


const componentList = shallowReactive([
    { id: 1, name: '添加记录', component: null },
    { id: 2, name: 'dd', component: null },
    { id: 3, name: 'cc', component: null },
    { id: 4, name: 'dd', component: null },

])  
</script>

<style scoped></style>