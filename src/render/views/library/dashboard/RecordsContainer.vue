<template>
    <empty v-if="records.length == 0"></empty>
    <ul v-else
        class="scrollbar-y flex-1">
        <li v-for="record in records"
            :key="record.id"
            class=""
            style="position: relative;width: 220px;">
            <img src="file://F:/Desktop/images/2.jpg"
                 @error="($event.target as HTMLImageElement).src = '../../../assets/images/no-img.png'"
                 class="fit--contain"
                 style="height: 180px;">
            <p class="title"
               style="margin: 4px 0;">dffa</p>
            <div class="authors">

            </div>
            <div class="tags"
                 style="">
                <span></span>
            </div>
            <!-- 批量选择遮罩 -->
            <div class="check-container"
                 style="display: none;">

            </div>
        </li>
    </ul>
</template>

<script setup lang='ts'>
import { h, onMounted, ref, } from 'vue'
import Authors from './Authors.vue'
import Empty from '@components/Empty.vue'

const props = withDefaults(defineProps<{
    records: any[]
    view: string
}>(), {
    records: () => [],
    view: 'thumbnail'
})

onMounted(() => {
})


</script>

<style scoped>
.check-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
}
</style>