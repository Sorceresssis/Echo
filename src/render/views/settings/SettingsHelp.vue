<template>
    <div class="flex-col">
        <div class="dashboard__content scrollbar-y-w8">
            <div class="settings-item">
                <h2 class="settings-item__title">{{ $t('settings.contact') }}</h2>
                <div class="settings-item__content">
                    <div class="row">Email: sorceresssis@gmail.com</div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">{{ $t('settings.version') }}</h2>
                <div class="settings-item__content">
                    <div class="row">Echo: {{ version.app }}</div>
                    <div class="row">Electron: {{ version.electron }}</div>
                    <div class="row">Chromium: {{ version.chrome }}</div>
                    <div class="row">Node: {{ version.node }}</div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">{{ $t('settings.license') }}</h2>
                <div class="settings-item__content">
                    <div class="row">Copyright © 2024 Sorceress. All rights reserved</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, reactive } from 'vue'
import { $t } from '@/locale'

onMounted(async () => {
    version.app = await window.versionAPI.app();
    version.electron = window.versionAPI.electron;
    version.chrome = window.versionAPI.chrome;
    version.node = window.versionAPI.node;
})
const version = reactive({
    app: '',
    electron: '',
    chrome: '',
    node: ''
}) 
</script>

<style scoped></style>