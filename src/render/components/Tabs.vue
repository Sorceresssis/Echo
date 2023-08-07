<template>
    <div>
        <div>
            <slot name="header"></slot>
        </div>
        <div id="menu"
             class="flex-row">
            <div v-for="(component, idx) in components"
                 :key="component.id"
                 class="menu-item"
                 :class="[idxActiveComponent == idx ? 'menu-avtive' : '']"
                 @click="switchComponent(idx)">
                {{ component.name }}
            </div>
        </div>
        <keep-alive>
            <component class="flex-1 overflow-hidden tab-content"
                       :is="components[idxActiveComponent].component">
            </component>
        </keep-alive>
    </div>
</template>
 
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const props = defineProps<{
    components: {
        id: number,
        name: string,
        component: any,
    }[],
    activeComponentId?: number
}>()

const idxActiveComponent = ref<number>(0)
const switchComponent = (idx: number) => {
    idxActiveComponent.value = idx
}

onMounted(() => {
    if (props.activeComponentId) {
        const idx = props.components.findIndex(component => component.id === props.activeComponentId)
        if (idx !== -1) {
            switchComponent(idx)
        }
    }
})
</script>

<style scoped>
#menu {
    margin: 6px 0;
}

.menu-item {
    position: relative;
    height: 22px;
    margin-right: 40px;
    cursor: pointer;
}

.menu-item:hover {
    color: var(--echo-theme-color);
}

.menu-avtive {
    color: var(--echo-theme-color);
}

.menu-avtive::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: translate(-50%, 0);
    height: 3px;
    width: 25px;
    border-radius: 1.5px;
    background-color: var(--echo-theme-color);
}

.scrollbar-y::-webkit-scrollbar {
    width: 8px;
}

.scrollbar-y::-webkit-scrollbar-thumb {
    border-radius: 4px;
}

.tab-content {
    /* padding-right: 8px; */
    padding-top: 8px;
}
</style>