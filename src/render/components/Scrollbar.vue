<template>
    <div ref="scrollBarRef"
         class="scrollbar-y">
        <slot></slot>
        <el-backtop target=".scrollbar-y"
                    :visibility-height="1"
                    :right="100"
                    :bottom="100">
            <span class="iconfont"
                  style="font-size: 20px;  padding-bottom:4px;">&#xe60c;</span>
        </el-backtop>
    </div>
</template>

<script setup lang='ts'>
import { ref, onActivated, nextTick, onMounted, watch } from 'vue'
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

onMounted(() => {
    if (props.saveScrollPosition) {
        onActivated(() => {
            nextTick(() => {
                scrollBarRef.value!.scrollTop = scrollTop.value
            })
        })
        onBeforeRouteLeave((to, from, next) => {
            scrollTop.value = scrollBarRef.value!.scrollTop
            next()
        })
    }
})

defineExpose({
    setScrollPosition
})
</script>