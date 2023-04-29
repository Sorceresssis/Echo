<template>
    <div v-if="item.type == 'item'"
         class="suggestion-inner">
        <div class="suggestion-text">
            {{ item.value }}
        </div>
        <div class="type itemImage-wrapper">
            <img src="../assets/images/2.jpg">
        </div>
    </div>
    <div v-else-if="item.type == 'author'"
         class="suggestion-inner">
        <div class="suggestion-text">
            {{ item.value }}
        </div>
        <div class="type authorImage-wrapper">
            <img src="../assets/images/2.jpg">
        </div>
    </div>
    <div v-else-if="item.type == 'tag'"
         class="suggestion-inner">
        <div class="suggestion-text">
            {{ item.value }}
        </div>
        <div class="type">#</div>
    </div>
    <div v-else
         class="suggestion-inner">
        <div class="suggestion-text">
            {{ item.value }}
        </div>
        <div class="type">
            <span class="iconfont">&#xe7d1;</span>
        </div>
    </div>
</template>

<script setup lang='ts'>
const props = defineProps<{
    item: {
        type: string
        id: number
        value: string
    }
}>()
</script>

<style scoped>
.suggestion-inner {
    display: flex;
    flex-wrap: nowrap;
    max-width: 500px;
    justify-content: space-between;
    padding: 5px 0;
}

.type {
    text-align: center;
    width: 60px;
    line-height: 25px;
}

.itemImage-wrapper img {
    height: 80px;
}

.authorImage-wrapper img {
    height: 60px;
    border-radius: 50%;
}

img {
    display: block;
    max-width: 100%;
    min-width: 100%;
}

.suggestion-text {
    flex: 1;
    display: -webkit-box;
    overflow: hidden;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
    line-height: 25px;
}
</style>