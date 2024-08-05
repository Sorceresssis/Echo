<template>
    <div class="tab-nav flex-row">
        <div v-for="(tab, idx) in tabs"
             :key="tab.id"
             class="tab-label"
             :class="[modelValue == idx ? 'tab-label-active' : '', tab.disabled ? 'disabled' : '']"
             @click="changeTab(idx)">
            {{ tab.label }}
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    tabs: Tabs[],
    modelValue: number
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>()

const changeTab = (idx: number) => {
    if (props.tabs[idx].disabled) return
    emit('update:modelValue', idx)
}
</script>

<style scoped>
.tab-nav {
    padding: 10px 0;
}

.tab-label {
    position: relative;
    height: 22px;
    margin-right: 40px;
    cursor: pointer;
}

.tab-label:not(.disabled):hover {
    color: var(--echo-theme-color);
}

.tab-label-active {
    color: var(--echo-theme-color);
}

.tab-label-active::after {
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