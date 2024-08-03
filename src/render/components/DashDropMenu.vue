<template>
    <el-dropdown :title="menu.HTMLElementTitle"
                 trigger="click"
                 popper-class="dashboard__dropdown-menu"
                 max-height="400px"
                 @command="(command) => emit('command', command)">
        <button-1>
            <span class="iconfont"
                  v-html="menu.title"></span>
        </button-1>
        <template #dropdown>
            <el-dropdown-menu v-if="loading">
                <div v-loading="loading"
                     style="width: 110px; height: 110px;"></div>
            </el-dropdown-menu>
            <el-dropdown-menu v-else>
                <el-dropdown-item v-for="item in menu.items"
                                  :key="item.key"
                                  :divided="item.divided"
                                  :command="item.key"
                                  @click="item.click()">
                    <span class="emptyFonticon"
                          :class="[item.hit() ? 'dot' : '']">
                        {{ item.title }}
                    </span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang='ts'>
import { vLoading, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import Button1 from '@/components/Button1.vue';

defineProps<{
    menu: DashDropMenu
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'command', command: any): void
}>()

</script>