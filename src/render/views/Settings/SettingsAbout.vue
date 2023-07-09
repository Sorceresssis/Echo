<template>
    <div class="wrap">
        <div class="about">
            <div>
                <img src="../assets/images/logo.png"
                     alt="logo"
                     width="200"
                     height="200">
            </div>
            <div>
                <h1>Echo</h1>
                <p>Version: {{ appVersion }}</p>
            </div>
            <div>
                <p>Electron: {{ electronVersion }}</p>
                <p>Chromium: {{ chromeVersion }}</p>
                <p>Node.js: {{ nodeVersion }}</p>
            </div>
            <div>
                <p>Copyright © 2023-2023 何骏涛 All rights reserved</p>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
onMounted(async () => {
    appVersion.value = await window.versionAPI.appVersion();
    electronVersion.value = window.versionAPI.electronVersion;
    chromeVersion.value = window.versionAPI.chromeVersion;
    nodeVersion.value = window.versionAPI.nodeVersion;
})
const appVersion = ref<string>()
const electronVersion = ref<string>()
const chromeVersion = ref<string>()
const nodeVersion = ref<string>()

</script>

<style scoped>
.wrap {
    display: flex;
    justify-content: center;
    position: relative;
    height: 100%;
}

.about {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 10%;
    font-size: 13px;
    text-align: center;
}

h1 {
    font-size: 20px;
    font-weight: 700;
}

.about>div {
    margin: 10px;
}

a {
    text-decoration: none;
}
</style>