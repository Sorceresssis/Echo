<template>
    <el-dropdown :title="menu.HTMLElementTitle"
                 trigger="click"
                 popper-class="dashboard__dropdown-menu">
        <button-1><span class="iconfont"
                  v-html="menu.title"></span></button-1>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for="item in menu.items"
                                  @click="item.click()"
                                  :divided="item.divided">
                    <span class="emptyFonticon"
                          :class="[item.dot() ? 'dot' : '']">
                        {{ item.title }}
                    </span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang='ts'>
import Button1 from '@components/Button1.vue'

const props = defineProps<{
    menu: DashDropMenu
}>() 
</script>

<style scoped></style>