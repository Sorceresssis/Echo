<template>
    <div>
        <div>
            <slot name="header"></slot>
        </div>
        <div id="menu"
             class="flex-row">
            <div v-for="(component, idx) in componentList"
                 :key="component.id"
                 class="menu-item"
                 :class="[idxActiveComponent == idx ? 'menu-avtive' : '']"
                 @click="switchComponent(idx)">
                {{ component.name }}
            </div>
        </div>
        <component class="flex-1 overflow-hidden"
                   :is="componentList[idxActiveComponent].component">
        </component>
    </div>
</template>
 
<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
    componentList: {
        id: number;
        name: string;
        component: any
    }[];
}>()

const idxActiveComponent = ref<number>(0)
const switchComponent = (idx: number) => {
    idxActiveComponent.value = idx
}
</script>

<style scoped> #menu {
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