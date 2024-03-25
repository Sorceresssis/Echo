<template>
    <div class="manage-images clearfix">
        <draggable class="manage-images"
            :list="paths"
            :disabled="!manage"
            :preventOnFilter="false"
            filter=".manage-images__item-actions"
            animation="200"
            :itemKey="(element: any) => element"
            v-viewer="{ transition: false }">
            <template #item="{ element }">
                <div class="manage-images__item">
                    <local-image :src="element" />
                    <div v-if="manage"
                        class="manage-images__item-actions"
                        @click="handleDeleteImage(element)"> {{ $t('layout.delete') }} </div>
                </div>
            </template>
        </draggable>
        <div v-if="manage"
            class="manage-images__item btn-add"
            @click="hadnleSelectImages">
            <span class="iconfont">&#xe68c;</span>
        </div>
    </div>
</template>

<script lang="ts"
    setup>
    import { $t } from '@/locale';
    import LocalImage from './LocalImage.vue';
    import draggable from 'vuedraggable';

    withDefaults(defineProps<{
        paths: string[]
        manage?: boolean
        imageHeight?: string
    }>(), {
        manage: true,
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

    /* 清除浮动 */
    .clearfix:after {
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .manage-images {
        --manage-images-item-height: v-bind(imageHeight);
    }

    .manage-images__item {
        position: relative;
        margin: 0 10px 10px 0;
        float: left;
        overflow: hidden;
    }

    .manage-images img {
        height: var(--manage-images-item-height);
        max-width: 100%;
        min-width: 100px;
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
        box-sizing: border-box;
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