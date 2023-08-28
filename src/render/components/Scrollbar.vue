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
    /**
     * 重置监听器，如果绑定的值变化，会重置滚动条的位置到顶部
     */
    resetListener?: boolean
}>(), {
    saveScrollPosition: true,
})

const scrollBarRef = ref<HTMLElement>()
const scrollTop = ref<number>(0)

watch(() => props.resetListener, () => {
    scrollBarRef.value!.scrollTop = scrollTop.value = 0
})

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
</script>