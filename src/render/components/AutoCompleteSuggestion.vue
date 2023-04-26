<template>
    <!-- item -->
    <div v-if="type === s.item">

    </div>
    <!-- author -->
    <div v-else-if="false">

    </div>
    <!-- tag -->
    <div v-else-if="false">

    </div>
    <!-- floder -->
    <div v-else>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
enum suggestionType { item, author, tag, floder }

type suggestion = {
    type: suggestionType,
    data: any
}
let a: suggestion = {
    type: 0,
    data: {}
}
const suggestion = ref<suggestion>()


</script>

<style scoped></style>