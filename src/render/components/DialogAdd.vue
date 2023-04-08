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
// 管理 添加， 删除， 检查  自检提供，勾选，查丢失，查多出。
const menuItems = ['添加', '批量添加', '添加作者', '添加标签', '']


</script>

<style scoped></style>