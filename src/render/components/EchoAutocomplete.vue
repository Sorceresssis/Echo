<template>
    <el-autocomplete :model-value="modelValue"
                     @input="(value) => emit('update:modelValue', value)"
                     clearable
                     :trigger-on-focus="false"
                     :fit-input-width="true"
                     :fetch-suggestions="querySearch"
                     @select="item => emit('select', item)">
        <template #default="{ item }">
            <div class="flex-row"
                 :class="''">
                <div class="flex-1 echo-ac-suggestion_text">
                    {{ item.value }}jfgjj oijjojioj oija骄傲的哦加哦i经济急哦急哦及安排时间哦i骄傲飞机傲娇急啊家的佛i就安排金佛倨傲iv
                    jfgjj oijjojioj oija骄傲的哦加哦i经济急哦急哦及安排时间哦i骄傲飞机傲娇急啊家的佛i就安排金佛倨傲iv
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