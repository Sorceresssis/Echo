<template>
    <div class="record-detail-sideBar">
        <scrollbar class="record-info scrollbar-y-w4">
            <local-image :src="record.cover"
                         class="cover" />
            <h1 class="title">{{ record.title }}</h1>
            <div class="meta">
                <div class="inline-list-title"> 介绍 </div>
                <div class="meta-content"> {{ record.intro }} </div>
            </div>
            <div class="meta">
                <div class="inline-list-title"> 作者 </div>
                <div class="meta-content">
                    <span v-for="author in record.authors"
                          :key="author.id"
                          class="author">
                        <local-image :src="author.avatar"
                                     class="avatar-icon" />
                        {{ author.name }}
                    </span>
                </div>
            </div>
            <div class="meta">
                <div class="inline-list-title"> 标签 </div>
                <div class="meta-content">
                    <span v-for="tag in record.tags"
                          :key="tag.id"
                          class="tag">{{ tag.title }}</span>
                </div>
            </div>
            <div class="meta">
                <div class="inline-list-title"> 信息 </div>
                <div class="meta-content"> {{ record.info }} </div>
            </div>
        </scrollbar>
        <div class="divider" />
        <scrollbar class="series-list scrollbar-y-w4">
            <empty v-if="record.series.length === 0" />
            <ul v-else
                class="adaptive-grid">
                <li v-for="series in record.series"
                    :key="series.id"
                    class="dashboard-text-card"
                    @click="drawerVisible = !drawerVisible">
                    <div class="content">
                        <span :title="series.name"
                              class="textover--ellopsis">{{ series.name }}</span>
                    </div>
                    <div class="operate">
                        <span class="iconfont"
                              :title="'复制到剪贴板'"
                              @click.stop="writeClibboard(series.name)">&#xe85c;</span>
                        <span class="iconfont"
                              :title="'编辑'"
                              @click.stop="editSeries(series.id, series.name)">&#xe722;</span>
                        <span class="iconfont"
                              :title="'删除'"
                              @click.stop="deleteSeries(series.id)">&#xe636;</span>
                    </div>
                </li>
            </ul>
            <el-drawer v-model="drawerVisible"
                       direction="btt"
                       size="80%"
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
import { writeClibboard, } from '@/util/systemUtil'
import LocalImage from '@/components/LocalImage.vue'
import Scrollbar from '@/components/Scrollbar.vue'
import Empty from '@/components/Empty.vue'
import MessageBox from '@/util/MessageBox'

const drawerVisible = ref(false)
const record = readonly(inject<VO.RecordDetail>('record')!)



const deleteSeries = (id: number) => {
    MessageBox.deleteConfirm().then(async () => {

    })
}

const editSeries = (d: number, oldValue: string) => {
    MessageBox.editPrompt(oldValue).then(({ value }) => {
        MessageBox.editConfirm().then(async () => {
            const trimValue = value.trim()
            if (trimValue === '' || trimValue === oldValue) return

        })
    })
}

// const deleteTag = (id: number) => {
//     await window.electronAPI.deleteTag(activeLibrary.value, id)
//     queryTags()
// }
// const editTag = (id: number, oldValue: string) => {
//     await window.electronAPI.editTag(activeLibrary.value, id, value)
//     queryTags()
// }


</script>

<style scoped>
.record-detail-sideBar {
    width: 360px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 10px;
    box-sizing: border-box;
}

.divider {
    padding-bottom: 5px;
    margin-bottom: 5px;
}

.record-info {
    --record-info-line-height: 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-right: 6px;
    user-select: text;
}

.record-info .cover {
    height: 220px;
    display: block;
    flex-shrink: 0;
    object-fit: contain;
}

.record-info .title {
    margin: 8px 0;
    line-height: 24px;
    font-size: 16px;
    font-weight: 700;
}

.record-info .meta {
    display: flex;
    margin-bottom: 8px;
    line-height: var(--record-info-line-height);
    font-size: 13px;
    /* white-space: pre-line; */
}

.record-info .meta-content {
    display: flex;
    flex-wrap: wrap;
    white-space: pre-line;
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
    color: var(--echo-emphasis-color);
}

.record-info .tag::before {
    content: '\e701';
    font-family: "iconfont" !important;
    color: #000
}

.series-list {
    height: 150px;
    display: flex;
    flex-direction: column;
    padding: 5px 6px 5px 0;
}

.series-list .adaptive-grid {
    row-gap: 8px;
    column-gap: 8px;
    grid-template-columns: repeat(auto-fill, 330px);
}
</style>