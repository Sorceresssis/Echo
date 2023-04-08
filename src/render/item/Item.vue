<template>
    <div class="">
        <ItemInfo></ItemInfo>
        <div>
            <ItemFolder></ItemFolder>
            <ItemSeries></ItemSeries>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import ItemInfo from '../components/ItemInfo.vue';
import ItemFolder from '../components/ItemFolder.vue';
import ItemSeries from '../components/ItemSeries.vue';


</script>

<style scoped></style>