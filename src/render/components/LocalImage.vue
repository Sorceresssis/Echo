<template>
    <img :src="src ? `file:///${src}` : noImg"
         @error="($event.target as HTMLImageElement).src = noImg">
</template>

<script setup lang='ts'>
defineProps<{
    src: string | null
}>()
import noImg from '@/assets/images/no-img.png'
</script> 