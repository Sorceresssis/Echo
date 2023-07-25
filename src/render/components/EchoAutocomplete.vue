<template>
    <el-autocomplete :model-value="modelValue"
                     @input="(value) => emit('update:modelValue', value)"
                     clearable
                     :trigger-on-focus="false"
                     :fit-input-width="true"
                     spellcheck="false"
                     :fetch-suggestions="querySearch"
                     :placeholder="placeholder"
                     @select="item => emit('select', item)">
        <template #default="{ item }">
            <div class="flex-row"
                 :class="''">
                <div class="flex-1 echo-ac-suggestion_text">
                    {{ item.value }}
                </div>
                <div class="echo-ac-suggestion_imgWrap">
                    <img :class="[item.type === 'author' ? 'fit--cover' : 'fit--contain']"
                         src="file://F:/Desktop/images/2.jpg"
                         alt="error">
                </div>
            </div>
        </template>
    </el-autocomplete>
</template>

<script setup lang='ts'>
import { Ref, inject, } from 'vue'

const props = withDefaults(defineProps<{
    type?: AcType
    modelValue: string
    ps?: number
    placeholder?: string
}>(), {
    type: 'search',
    ps: 10,
    placeholder: ''
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

<style>
.echo-ac-suggestion_text {
    display: -webkit-box;
    overflow: hidden;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
}

.echo-ac-suggestion_imgWrap {
    width: 80px;
    height: 100px;
}
</style>