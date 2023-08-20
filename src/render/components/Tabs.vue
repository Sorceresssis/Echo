<template>
    <div>
        <div>
            <slot name="header"></slot>
        </div>
        <div class="tab-menu flex-row">
            <div v-for="(component, idx) in components"
                 :key="component.id"
                 class="menu-item"
                 :class="[modelValue == idx ? 'menu-avtive' : '', component.disabled ? 'disabled' : '']"
                 @click="changeTab(idx)">
                {{ component.name }}
            </div>
        </div>
        <keep-alive>
            <component class="flex-1 overflow-hidden"
                       :is="components[modelValue].component">
            </component>
        </keep-alive>
    </div>
</template>
 
<script lang="ts" setup>
const props = defineProps<{
    components: TabsComponent[],
    modelValue: number
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>()



const changeTab = (idx: number) => {
    if (props.components[idx].disabled) return
    emit('update:modelValue', idx)
}
</script>

<style scoped>
.tab-menu {
    margin: 6px 0;
}

.menu-item {
    position: relative;
    height: 22px;
    margin-right: 40px;
    cursor: pointer;
}

.menu-item:not(.disabled):hover {
    color: var(--echo-theme-color);
}

.menu-avtive {
    color: var(--echo-theme-color);
}

.disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
</style>