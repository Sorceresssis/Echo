<template>
    <div ref="scrollBarRef"
         class="scrollbar-y"
         @scroll="handleScroll">
        <slot></slot>
        <el-backtop target=".scrollbar-y"
                    :visibility-height="100"
                    :right="100"
                    :bottom="100">
            <span class="iconfont"
                  style="font-size: 20px;  padding-bottom:4px;">&#xe60c;</span>
        </el-backtop>
    </div>
</template>

<script setup lang='ts'>
import { ref, onActivated, nextTick, onMounted, watch, handleError } from 'vue'
import { debounce } from '@/util/debounce'
import { onBeforeRouteLeave } from 'vue-router'

const props = withDefaults(defineProps<{
    saveScrollPosition?: boolean
}>(), {
    saveScrollPosition: true,
})

const scrollBarRef = ref<HTMLElement>()
const scrollTop = ref<number>(0)

const setScrollPosition = function (position: number) {
    scrollBarRef.value!.scrollTop = scrollTop.value = position
}

const handleScroll = debounce(function (e: Event) {
    if (props.saveScrollPosition) {
        scrollTop.value = (e.target as HTMLElement).scrollTop
    }
}, 200)

onActivated(() => {
    nextTick(() => {
        scrollBarRef.value!.scrollTop = scrollTop.value
    })
})

defineExpose({
    setScrollPosition
})
</script>