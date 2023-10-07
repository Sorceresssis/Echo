<template>
    <el-autocomplete ref="acRef"
                     :model-value="modelValue"
                     clearable
                     :trigger-on-focus="false"
                     :fit-input-width="true"
                     spellcheck="false"
                     :fetch-suggestions="querySearch"
                     :show-word-limit="showWordLimit"
                     :maxlength="maxlength"
                     :placeholder="placeholder"
                     :debounce="400"
                     @input="(value) => emit('update:modelValue', value)"
                     @keyup.enter="handleKeyupEnter">
        <template #default="{ item }">
            <div class="echo-ac-suggestion flex-row">
                <local-image v-if="item.type === 'record' || item.type === 'author'"
                             :src="item.image"
                             class="img-icon"
                             :class="[item.type]" />
                <span v-else
                      :class="[item.type]"></span>
                <div class="flex-1 echo-ac-suggestion_text">
                    {{ item.value }}
                </div>
                <div v-if="showSelectbtn"
                     class="select-btn flex-center">
                    <span @click.stop="emit('btnSelect', toRaw(item))">选择</span>
                </div>
            </div>
        </template>
    </el-autocomplete>
</template>

<script setup lang='ts'>
import { ref, Ref, inject, toRaw, watch } from 'vue'
import { useRoute } from 'vue-router'
import LocalImage from '@/components/LocalImage.vue'

const props = withDefaults(defineProps<{
    type?: AcType
    modelValue: string
    ps?: number
    placeholder?: string
    showWordLimit?: boolean
    maxlength?: string
    showSelectbtn?: boolean
}>(), {
    type: 'search',
    ps: 20,
    placeholder: '',
    showWordLimit: false,
    maxlength: '255',
    showSelectbtn: false
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'btnSelect', item: VO.AcSuggestion): void // 点击一个固定的按钮，将item.value传出去
}>()

const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number> // 正在打开的Library
// BUG 建议会被缓存，导致切换Library后，出现错误的数据。
// TODO this.item = new Date().getTime() 组件 :key来刷新
const querySearch = (queryWord: string, cb: any) => {
    window.electronAPI.autoCompleteRecord(
        activeLibrary.value,
        {
            type: props.type,
            queryWord: queryWord,
            ps: props.ps
        }
    ).then(a => cb(a))
}

const acRef = ref()
const handleKeyupEnter = () => {
    acRef.value.blur()
}

const route = useRoute()

watch(route, () => {
    // acRef.value.activated = false
})
</script>

<style>
.echo-ac-suggestion {
    padding: 10px 0;
}

.echo-ac-suggestion .author {
    width: 80px;
    height: 80px;
    border-radius: 50%;
}

.echo-ac-suggestion .record {
    width: 80px;
    height: 100px;
    object-fit: cover;
}

.echo-ac-suggestion .tag::before {
    content: '\e701';
    font-family: "iconfont" !important;
    font-size: 16px;
}

.echo-ac-suggestion .series::before {
    content: '\e69e';
    font-family: "iconfont" !important;
    font-size: 16px;
}

.echo-ac-suggestion .dirname::before {
    content: '\e73e';
    font-family: "iconfont" !important;
    font-size: 16px;
}

.echo-ac-suggestion_text {
    display: -webkit-box;
    margin-left: 15px;
    overflow: hidden;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
}

.echo-ac-suggestion .select-btn {
    width: 60px;
    color: #258fb8;
}

.echo-ac-suggestion .select-btn:hover {
    cursor: pointer;
    color: #1a8ab8;
}
</style>