<template>
    <div class="folder-content-item">
        <div class="folder-content-item__icon">
            <div v-if="dirContentItem.type === 'folder'"
                 class="folder"
                 @dblclick="emit('openDir', dirContentItem.name)">
                <div class="front" />
                <div class="center" />
                <div class="back" />
            </div>
            <div v-else-if="imageReg.test(dirContentItem.name)"
                 class="image">
                <local-image :src="dirContentItem.fullPath"
                             class="fit--contain" />
            </div>
            <div v-else-if="videoReg.test(dirContentItem.name)"
                 class="image">
                <video ref="video"
                       :src="`file:///${dirContentItem.fullPath}`"
                       class="fit--contain explorer-video"
                       @mouseenter="mouseenterVideo"
                       @mouseleave="mouseleaveVideo"
                       @dblclick="toggleFullscreen" />
            </div>
            <div v-else
                 class="image">
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="98"
                     height="118"
                     viewBox="0 0 98 118"
                     fill="none">
                    <path opacity="0.483448"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0 15.68C0 7.02016 7.02017 0 15.68 0H47.04L98 50.96V101.92C98 110.58 90.9798 117.6 82.32 117.6H15.68C7.02018 117.6 0 110.58 0 101.92V15.68Z"
                          fill="#5B6267" />
                    <path fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M47.04 0L98 50.96H62.7201C54.0602 50.96 47.04 43.9398 47.04 35.28V0Z"
                          fill="#6F767A" />
                </svg>
            </div>
        </div>
        <div :title="dirContentItem.name"
             class="folder-content-item__name">
            {{ dirContentItem.name }}
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import LocalImage from './LocalImage.vue'

defineProps<{
    dirContentItem: DirContentItem & {
        fullPath: string
    }
}>()

const emit = defineEmits<{
    (e: 'openDir', folderName: string): void
}>()

const imageReg = /\.(bmp|dib|heic|heif|jff|pjpeg|jpeg|pjp|jpg|png|tiff|tif|webp|ico|svg|jfif|gif)$/i
const videoReg = /\.(mp4|webm|ogg|ogv|avi|wmv|rm|rmvb|mpeg|mpg|mov|mkv|flv|f4v|f4p|f4a|f4b)$/i

const video = ref<HTMLVideoElement | undefined>()
const mouseenterVideo = () => {
    if (document.fullscreenElement || !video.value) return

    // 静音播放
    video.value.currentTime = 0
    video.value.muted = true
    video.value.play()
}

const mouseleaveVideo = () => {
    if (document.fullscreenElement || !video.value) return

    video.value.pause()
    video.value.currentTime = 0
    video.value.muted = false
}


const toggleFullscreen = () => {
    if (!video.value) return

    video.value.currentTime = 0
    if (document.fullscreenElement) {
        video.value.muted = true
        document.exitFullscreen()
    } else {
        video.value.muted = false
        video.value.requestFullscreen()
    }
}

</script>

<style>
.folder-content-item {
    width: var(--folder-item-width);
    height: var(--folder-item-height);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.folder-content-item:hover {
    background-color: #f5f5f5;
}


.folder-content-item img,
.folder-content-item video {
    cursor: pointer;
}

.folder-content-item__icon {
    width: var(--folder-item-width);
    max-height: calc(var(--folder-item-height) - 42px);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-bottom: 12px;
    box-sizing: border-box;
}

.folder {
    --folder-width: 200px;
    --folder-height: 134px;
    width: var(--folder-width);
    height: var(--folder-height);
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
}

.folder .front,
.folder .center,
.folder .back {
    position: absolute;
    border-radius: 2px;
    box-shadow:
        0.9px 1.1px 3.9px rgba(0, 0, 0, 0.007),
        1.9px 2.2px 7.4px rgba(0, 0, 0, 0.018),
        3px 3.6px 10.3px rgba(0, 0, 0, 0.032),
        4.4px 5.3px 12.6px rgba(0, 0, 0, 0.047),
        6.7px 8px 15.3px rgba(0, 0, 0, 0.061),
        10px 12px 20px rgba(0, 0, 0, 0.07);
}

.folder .front {
    width: calc(var(--folder-width) - 20px);
    height: var(--folder-height);
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(to bottom, #767575 0%, #5b5a5a 50%, #393939 100%);
    z-index: 3;
}

.folder .center {
    width: calc(var(--folder-width) - 20px);
    height: calc(var(--folder-height) - 20px);
    background-color: #fff;
    top: 11px;
    left: 10px;
    z-index: 2;
}

.folder .back {
    width: calc(var(--folder-width) - 20px);
    height: calc(var(--folder-height) - 40px);
    background-color: #fff;
    top: 22px;
    left: 20px;
    z-index: 1;
}

.folder-content-item .image {
    max-width: 100%;
    max-height: inherit;
}


.folder-content-item .folder:hover .front::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 3px solid #93ddff;
    z-index: 5px;
}

.folder-content-item__name {
    display: -webkit-box;
    overflow: hidden;
    line-height: 15px;
    font-size: 12px;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    /* 允许单词内的换行 */
    overflow-wrap: break-word;
    text-overflow: ellipsis;
    text-align: center;
}
</style>