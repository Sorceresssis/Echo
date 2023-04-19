<template>
    <div class="item">
        <ItemInfo></ItemInfo>
        <div class="item-display">
            <ItemSeries></ItemSeries>
            <ItemFolder style="flex:1"></ItemFolder>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import ItemInfo from '../components/ItemInfo.vue';
import ItemFolder from '../components/ItemFolder.vue';
import ItemSeries from '../components/ItemSeries.vue';


</script>

<style scoped>
.item {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.item-display {
    flex: 1;
    display: flex;
}
</style>