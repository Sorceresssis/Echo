<template>
    <div class="flex-col">
        <div class="dashboard__content scrollbar-y-w8">
            <div class="detail-item">
                <label class="detail-item__lable"> {{ $t('layout.name') }} </label>
                <div class="detail-item__content">
                    {{ info.name }}
                </div>
            </div>
            <div class="detail-item">
                <label class="detail-item__lable"> {{ $t('layout.avatarUrl') }} </label>
                <div class="detail-item__content">
                    <el-input v-model="info.avatar"
                        readonly />
                    <button2 @click="openInExplorer(info.avatar)"> {{ $t('layout.showInFileExplorer') }} </button2>
                </div>
            </div>
            <div class="detail-item">
                <label class="detail-item__lable"> {{ $t('layout.sampleImages') }} </label>
                <manage-images :paths="info.sampleImages"
                    :showManageBtn="false"
                    imageHeight="200px" />
            </div>
            <div class="detail-item">
                <label class="detail-item__lable"> {{ $t('layout.intro') }} </label>
                <div class="detail-item__content">
                    {{ info.intro }}
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item__lable"> ID </div>
                <div class="detail-item__content"> {{ info.id }} </div>
            </div>
            <div class="detail-item">
                <label class="detail-item__lable"> {{ $t('layout.createdTime') }} </label>
                <div class="detail-item__content">
                    {{ info.createTime }}
                </div>
            </div>
            <div class="detail-item">
                <label class="detail-item__lable"> {{ $t('layout.lastModifiedTime') }} </label>
                <div class="detail-item__content">
                    {{ info.modifiedTime }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup
    lang='ts'>
    import { openInExplorer } from '@/util/systemUtil'
    import Button2 from '@/components/Button2.vue'
    import LocalImage from '@/components/LocalImage.vue';
    import ManageImages from '@/components/ManageImages.vue';

    defineProps<{
        info: VO.AuthorDetail
    }>()
</script>

<style scoped>
    .detail-item {
        display: flex;
        margin-bottom: 18px;
    }

    .detail-item__lable {
        width: 140px;
        display: inline-flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex: 0 0 auto;
        font-size: 13px;
        height: 32px;
        line-height: 32px;
        padding: 0 12px 0 0;
        box-sizing: border-box;
    }

    .detail-item__content {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        flex: 1;
        line-height: 32px;
        position: relative;
        font-size: 13px;
        min-width: 0;
        color: var(--echo-text-color-light2);
        user-select: text;
        white-space: pre-line;
    }
</style>