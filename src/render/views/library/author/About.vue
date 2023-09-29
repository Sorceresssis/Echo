<template>
    <div class="flex-col">
        <div class="dashboard__content scrollbar-y-w8">
            <div class="detail-item">
                <label class="detail-item__lable">姓名</label>
                <div class="detail-item__content">
                    {{ info.name }}
                </div>
            </div>
            <div class="detail-item">
                <label class="detail-item__lable">创建时间</label>
                <div class="detail-item__content">
                    {{ info.createTime }}
                </div>
            </div>
            <div class="detail-item">
                <label class="detail-item__lable">修改时间</label>
                <div class="detail-item__content">
                    {{ info.modifiedTime }}
                </div>
            </div>
            <div class="detail-item">
                <label class="detail-item__lable">头像地址</label>
                <div class="detail-item__content">
                    <el-input v-model="info.avatar"
                              readonly />
                    <button2>打开头像图片</button2>
                </div>
            </div>
            <div class="detail-item">
                <label class="detail-item__lable">介绍</label>
                <div class="detail-item__content">
                    {{ info.intro }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Button2 from '@/components/Button2.vue'

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
    width: 100px;
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