<template>
    <ul v-viewer="{ transition: false }"
        class="manage-images">
        <li v-for="path in paths"
            class="manage-images__item">
            <local-image :src="path" />
            <div v-if="showManageBtn"
                class="manage-images__item-actions"
                @click="handleDeleteImage(path)"> {{ $t('layout.delete') }} </div>
        </li>
        <div v-if="showManageBtn"
            class="manage-images__item btn-add"
            @click="hadnleSelectImages">
            <span class="iconfont">&#xe68c;</span>
        </div>
    </ul>
</template>

<script lang="ts"
    setup>
    import { $t } from '@/locale';
    import LocalImage from './LocalImage.vue';

    withDefaults(defineProps<{
        paths: string[]
        showManageBtn?: boolean
        imageHeight?: string
    }>(), {
        showManageBtn: true,
        imageHeight: '150px'
    })

    const emit = defineEmits<{
        (e: 'add-images', value: string[]): void    // 添加图片，
        (e: 'delete-image', value: string): void    // 删除图片
    }>()

    const hadnleSelectImages = async function () {
        const imgPath = (await window.electronAPI.openDialog('image', true))
        if (imgPath.length) {
            emit('add-images', imgPath)
        }
    }

    const handleDeleteImage = function (path: string) {
        emit('delete-image', path)
    }
</script>

<style scoped>
    .manage-images {
        --manage-images-item-height: v-bind(imageHeight);
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        gap: 10px;
    }

    .manage-images__item {
        overflow: hidden;
        position: relative;
    }

    .manage-images img {
        height: var(--manage-images-item-height);
        max-width: 100%;
        object-fit: contain;
        object-position: center;
        cursor: zoom-in;
    }

    .manage-images__item-actions {
        width: 100%;
        height: 28px;
        display: none;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 0;
        padding: 6px 0;
        box-sizing: border-box;
        background: rgba(0, 0, 0, .6);
        color: #fff;
        font-size: 12px;
        text-align: center;
        opacity: .8;
        z-index: 1;
        cursor: pointer;
    }

    .manage-images__item:hover .manage-images__item-actions {
        display: flex;
    }

    .manage-images__item-actions:hover:not(.disabled) {
        color: rgba(255 255, 255, 0.7);
    }

    .manage-images .btn-add {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed #8c939d;
        position: relative;
        width: var(--manage-images-item-height);
        height: var(--manage-images-item-height);
    }

    .manage-images .btn-add:hover {
        border-color: var(--echo-theme-color);
    }

    .manage-images .btn-add .iconfont {
        font-size: 28px;
        color: #8c939d;
        text-align: center;
    }

</style>

<!-- <style scoped>
    .manage-images {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .manage-images__item {
        --manage-images-item-width: 150px;
        --manage-images-item-height: 150px;
        position: relative;
        width: var(--manage-images-item-width);
        height: var(--manage-images-item-height);
        border: 1px solid #ddd;
        overflow: hidden;
    }

    .manage-images__item-actions {
        width: 100%;
        height: 28px;
        display: none;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 0;
        padding: 6px 0;
        box-sizing: border-box;
        background: rgba(0, 0, 0, .6);
        color: #fff;
        font-size: 12px;
        text-align: center;
        opacity: .8;
        z-index: 1;
        cursor: pointer;
    }

    .manage-images__item:hover .manage-images__item-actions {
        display: flex;
    }

    .manage-images__item-actions:hover:not(.disabled) {
        color: rgba(255 255, 255, 0.7);
    }

    .manage-images .btn-add {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed #8c939d;
    }

    .manage-images .btn-add:hover {
        border-color: var(--echo-theme-color);
    }

    .manage-images .btn-add .iconfont {
        font-size: 28px;
        color: #8c939d;
        text-align: center;
    }

    .manage-images img {
        width: var(--manage-images-item-width);
        height: var(--manage-images-item-height);
        object-fit: contain;
    }
</style> -->
