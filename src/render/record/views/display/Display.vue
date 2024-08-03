<template>
    <div class="flex-row">
        <!-- TODO 把 图片跑马灯从detailbar拆分出来单独显示  -->
        <Detailbar />
        <Explorer />
    </div>
</template>

<script setup lang='ts'>
import Detailbar from './Detailbar.vue'
import Explorer from './Explorer.vue'

</script>