<template>
    <div class="">
        <div class="siderMenu">
            <div class=""
                 v-for="(menuItem, index) in menuItems">
                {{ menuItem }}
            </div>
        </div>
        <div>

        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
const menuItems = ['添加', '批量添加', '添加作者', '添加标签', '']


</script>

<style scoped></style>