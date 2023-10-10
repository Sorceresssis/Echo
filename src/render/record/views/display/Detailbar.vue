<template>
    <div class="record-detail-sideBar">
        <scrollbar class="record-info scrollbar-y-w4">
            <local-image :src="record.cover"
                         class="cover" />
            <h1 class="title">{{ record.title }}</h1>
            <div class="meta">
                <span class="inline-list-title">介绍</span>
                <p>{{ record.intro }}</p>
            </div>
            <div class="meta">
                <span class="inline-list-title">作者</span>
                <div v-for="author in record.authors"
                     :key="author.id"
                     class="author">
                    <local-image :src="author.avatar"
                                 class="avatar-icon" />
                    <span> {{ author.name }} </span>
                </div>
            </div>
            <div class="meta">
                <span class="inline-list-title">标签</span>
                <span v-for="tag in record.tags"
                      :key="tag.id"
                      class="tag">{{ tag.title }}</span>
            </div>
            <div class="meta">
                <span class="inline-list-title">信息</span>
                <p>{{ record.info }}</p>
            </div>
        </scrollbar>
        <div class="divider"></div>
        <scrollbar class="series-list scrollbar-y-w4">
            <div v-for="serie in record.series"
                 class="menu-row"
                 @click="drawerVisible = !drawerVisible"> {{ serie.name }} </div>
            <el-drawer v-model="drawerVisible"
                       direction="btt"
                       size="300px"
                       style="background-color: #f6f6f8;">
                <template #header="{ close, titleId, titleClass }">
                    <h4 :id="titleId"
                        :class="titleClass">This is a custom header!</h4>
                </template>
                This is drawer content.
            </el-drawer>
        </scrollbar>
    </div>
</template>

<script setup lang='ts'>
import { ref, readonly, inject } from 'vue'
import LocalImage from '@/components/LocalImage.vue'
import Scrollbar from '@/components/Scrollbar.vue'

const drawerVisible = ref(false)
const record = readonly(inject<VO.RecordDetail>('record')!)




</script>

<style scoped>
.record-detail-sideBar {
    width: 320px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 10px;
    box-sizing: border-box;
}

.record-info {
    --record-info-line-height: 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-right: 6px;
    user-select: text;
    white-space: pre-line;
}

.divider {
    padding: 10px 0;
}

.record-info .cover {
    height: 220px;
    display: block;
    flex-shrink: 0;
    object-fit: contain;
}

.record-info .meta {
    min-height: var(--record-info-line-height);
    display: flex;
    margin-bottom: 10px;
    flex-wrap: wrap;
    line-height: var(--record-info-line-height);
    font-size: 13px;
}

.record-info .title {
    margin: 8px 0;
    line-height: 24px;
    font-size: 16px;
    font-weight: 700;
}

.record-info .author {
    margin-right: 14px;
    color: var(--echo-emphasis-color);
}

.record-info .author img {
    height: var(--record-info-line-height);
    width: var(--record-info-line-height);
}

.record-info .tag {
    margin-right: 10px;
    color: #444;
}

.record-info .tag::before {
    content: '\e701';
    font-family: "iconfont" !important;
}

.series-list {
    height: 150px;
    display: flex;
    flex-direction: column;
    padding-right: 6px;
}

.menu-row {
    display: flex;
    height: 32px;
    padding: 0 10px;
    margin: 5px 0;
    line-height: 32px;
    border: 1px solid var(--echo-theme-color-light4);
    box-sizing: border-box;
    border-radius: 5px;
    cursor: pointer;
}

.menu-row:hover {
    background-color: var(--echo-theme-color-light6);
}

.menu-row:active {
    background-color: var(--echo-theme-color);
    color: #fff;
}
</style>