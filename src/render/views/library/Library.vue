<template>
    <!-- 保存面板数据 -->
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component v-loading="libraryStore.isLoadingLibrary"
                       element-loading-background="transparent"
                       :is="Component" />
        </keep-alive>
    </router-view>
</template>

<script lang="ts" setup>
import { vLoading } from 'element-plus';
import useLibraryStore from '@/store/libraryStore';

const libraryStore = useLibraryStore()

</script>