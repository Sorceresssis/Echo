<template>
    <el-autocomplete :model-value="modelValue"
                     @input="(value) => emit('update:modelValue', value)"
                     clearable
                     :trigger-on-focus="false"
                     :fetch-suggestions="querySearch"
                     @select="item => emit('select', item)">
        <template #default="{ item }">
            {{ item.value }}
        </template>
    </el-autocomplete>
</template>

<script setup lang='ts'>
import { Ref, inject, } from 'vue'

const props = withDefaults(defineProps<{
    type?: AcType
    modelValue: string
    ps?: number
}>(), {
    type: 'search',
    ps: 10
})

const emit = defineEmits<{
    (e: 'select', item: Record<string, any>): void
    (e: 'update:modelValue', value: string): void
}>()

const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number> // 正在打开的Library

const querySearch = (queryWord: string, cb: any) => {
    window.electronAPI.autoCompleteRecord(
        activeLibrary.value,
        {
            type: props.type,
            queryWord: queryWord,
            ps: props.ps
        }
    ).then((a) => {
        cb(a)
    })
}
</script>

<style scoped></style>