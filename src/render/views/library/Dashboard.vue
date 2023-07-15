<template>
    <main-container :component-list="componentList"></main-container>
</template>
  
<script lang="ts" setup>
import { ref, shallowReactive } from 'vue';
import { t } from '../../locales'
import MainContainer from '../../components/MainContainer.vue'
import Records from './Records.vue'
import Authors from './Authors.vue'
import Series from './Series.vue'
import Info from './Info.vue'


const componentList = shallowReactive([
    { id: 1, name: '记录', component: Records },
    { id: 2, name: '作者', component: Authors },
    { id: 3, name: '系列', component: Series },
    { id: 4, name: '信息表', component: Info },

])
const idxActiveComponent = ref<number>(0)
const switchComponent = (idx: number) => {
    idxActiveComponent.value = idx
}
</script>

<style scoped>
#menu {
    margin: 6px 0;
}

.menu-item {
    height: 22px;
    margin-right: 40px;
    cursor: pointer;
}

.menu-item:hover {
    color: #9e94f7;
}

.menu-avtive {
    color: #9e94f7;
    border-bottom: solid 3px #9e94f7;
}
</style>