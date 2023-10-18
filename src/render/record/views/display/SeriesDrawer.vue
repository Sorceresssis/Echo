<template>
    <el-drawer direction="btt"
               size="80%"
               style="background-color: #f6f6f8;">
        <template #header="{ close, titleId, titleClass }">
            <h4 :id="titleId"
                :class="titleClass">This is a custom header!</h4>
        </template>
        This is drawer content.
    </el-drawer>
</template>

<script setup lang='ts'>


// const props = defineProps({

// })



</script>