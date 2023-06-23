<template>
    <div>
        <div id="menu"
             class="flex-row">
            <div v-for="(component, idx) in componentList"
                 :key="component.id"
                 class="menu-item"
                 :class="[idx_activeComponent == idx ? 'componentActive' : '']"
                 @click="switchComponent(idx)">
                {{ component.name }}
            </div>
        </div>
        <!-- <Suspense> -->
        <!-- <KeepAlive> -->
        <component class="flex-1 overflow-hidden"
                   :is="componentList[idx_activeComponent].component">
        </component>
        <!-- </KeepAlive> -->
        <!-- </Suspense> -->
    </div>
</template>
  
<script lang="ts" setup>
import { ref, shallowReactive } from 'vue';
import { t } from '../../locales'
import Records from './Records.vue';
import Authors from './Authors.vue';
import Series from './Series.vue';
import Info from './Info.vue';
import Mange from './Mange.vue';


const componentList = shallowReactive([
    { id: 1, name: '记录', component: Records },
    { id: 2, name: '作者', component: Authors },
    { id: 3, name: '系列', component: Series },
    { id: 4, name: '信息表', component: Info },
    { id: 5, name: '管理', component: Mange }
])
const idx_activeComponent = ref<number>(0)
const switchComponent = (idx: number) => {
    idx_activeComponent.value = idx
}
</script>

<style scoped>
#menu {
    margin: 6px 10px;
}

.menu-item {
    height: 22px;
    margin-right: 40px;
    cursor: pointer;
}

.menu-item:hover {
    color: #9e94f7;
}

.componentActive {
    color: #9e94f7;
    border-bottom: solid 3px #9e94f7;
}



.rightMenuItem {
    background-color: #fff;
    padding: 4px;
    margin: 3px;
    border-radius: 4px;
    border: 2px solid #dedee0;
    cursor: pointer;
    font-size: 16px;
}

.rightMenuItem:hover {
    background-color: #d9d9d9;
}
</style>