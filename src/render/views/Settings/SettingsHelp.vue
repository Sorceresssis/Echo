<template>
    <div class="flex-col">
        <div class="dashboard__content scrollbar-y-w8">
            <div class="settings-item">
                <h2 class="settings-item__title">联系方式</h2>
                <div class="settings-item__content">
                    <div class="row">Email: sorceresssis@gmail.com</div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">教程</h2>
                <div class="settings-item__content">
                    <div class="row">
                        <a class="openExternal col"
                           @click.prevent="openInBrowser(YoutubeTutorialUrl)">
                            Youtube
                        </a>
                        <a class="openExternal col"
                           @click.prevent="openInBrowser(BilibiliTutorialUrl)">
                            Bilibili
                        </a>
                    </div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">版本</h2>
                <div class="settings-item__content">
                    <div class="row">Echo: {{ version.app }}</div>
                    <div class="row">Electron: {{ version.electron }}</div>
                    <div class="row">Chromium: {{ version.chrome }}</div>
                    <div class="row">Node: {{ version.node }}</div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">版权</h2>
                <div class="settings-item__content">
                    <div class="row">Copyright © 2023-2023 何骏涛 All rights reserved</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, reactive } from 'vue'
import { openInBrowser } from '@/util/systemUtil'

const BilibiliTutorialUrl = "https://www.bilibili.com/"
const YoutubeTutorialUrl = "https://www.youtube.com/"

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