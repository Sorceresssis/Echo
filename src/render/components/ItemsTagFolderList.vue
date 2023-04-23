<template>
    <div>
        <div class="list">
            <h3>Tag</h3>
            <ElInput></ElInput>
            <div>
                <ul>
                    <li></li>
                </ul>
            </div>
        </div>
        <div class="list">
            <h3>folder</h3>
            <ElInput></ElInput>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

</script>

<style scoped>
.list {
    width: 50%;
    padding: 10px;
}
</style>