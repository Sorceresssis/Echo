<template>
    <empty v-if="records.length == 0"></empty>
    <ul v-else
        class="adaptive-grid"
        :class="[`${view}-grid`]">
        <li class="record-recommendations overflow-hidden"
            v-for="record in 20"
            :key="1">
            <div class="cover-wrap">
                <img src="file://F:\Desktop\images\2.jpg"
                     @error="($event.target as HTMLImageElement).src = '../../../assets/images/no-img.png'"
                     class="cover">
            </div>
            <div>
                <p class="title row fw-bold">[SNL经典]我真的看不懂了，这就是艺术吗？</p>
                <div class="row flex-row">
                    <span class="author"
                          v-for="tag in ['小丑', '作者1', '标签2', '小丑', '作者1', '标签2', '小丑', '作者1', '标签2', '小丑', '作者1', '标签2', '小丑', '作者1', '标签2', '小丑', '作者1', '标签2', '小丑', '作者1', '标签2', '小丑', '作者1', '标签2', '小丑', '作者1', '标签2', '小丑', '作者1', '标签2', '小丑', '作者1', '标签2', '小丑', '作者1', '标签2', '小丑', '作者1', '标签2', '小丑', '作者1', '标签2', '小丑', '作者1', '标签2',]">
                        <img src="file://F:\Desktop\images\息屏.png"
                             style="height: 24px; width:24px; border-radius: 50%;"
                             class="fit--cover">
                        <span> {{ tag }} </span>
                    </span>
                </div>
                <div class="row"
                     style="">
                    <span class="tag"
                          v-for="tag in ['小丑', '作者1', '标签2']">{{ tag }}</span>
                </div>
            </div>
            <!-- 批量选择遮罩 -->
            <div class="check-container">
                <el-checkbox size="large" />
            </div>
        </li>
    </ul>
    <context-menu v-model:show="isVisibleCtmItem"
                  :options="contextMenuOptions">
        <context-menu-item label="复制"
                           @click="" />
        <context-menu-item label="在新窗口中打开"
                           @click="" />
        <context-menu-item label="再资源管理器中打开"
                           @click="" />
        <context-menu-item label="打开链接"
                           @click="" />
        <context-menu-item label="删除"
                           @click="">
            <template #icon>
                <span class="iconfont">&#xe61a;</span>
            </template>
        </context-menu-item>
        <context-menu-sperator />
        <context-menu-group label="移动到">
        </context-menu-group>
        <context-menu-item label="导出" />
    </context-menu>
</template>

<script setup lang='ts'>
import { onMounted, ref, } from 'vue'
import Empty from '@components/Empty.vue'

const props = withDefaults(defineProps<{
    records: any[]
    view?: 'thumbnail' | 'extended'
}>(), {
    records: () => [],
    view: 'thumbnail',
})

onMounted(() => {
})

/******************** 右键菜单 ********************/
const isVisibleCtmItem = ref(false)
const contextMenuOptions = {
    zIndex: 3,
    minWidth: 300,
    x: 500,
    y: 200
}
const openCtm = (e: MouseEvent) => {
    contextMenuOptions.x = e.x
    contextMenuOptions.y = e.y
    isVisibleCtmItem.value = true
}
</script>

<style >
.adaptive-grid {
    column-gap: 20px;
    row-gap: 20px;
    user-select: text;
}

.extended-grid {
    grid-template-columns: repeat(auto-fill, 600px);
}

.extended-grid .record-recommendations {
    position: relative;
    display: flex;
    font-size: 13px;
}

.extended-grid .record-recommendations .cover-wrap {
    width: 220px;
    height: 150px;
    margin-right: 16px;
}

.extended-grid .record-recommendations .cover {
    display: block;
    max-width: 100%;
    max-height: 100%;
    margin: 0 auto;
}

.extended-grid .record-recommendations .row {
    line-height: 24px;
    margin-bottom: 4px;
}

.thumbnail-grid {
    --thumbnail-grid-width: 220px;
    grid-template-columns: repeat(auto-fill, var(--thumbnail-grid-width));
}

.thumbnail-grid .record-recommendations {
    position: relative;
    display: block;
    width: var(--thumbnail-grid-width);
    font-size: 13px;
}

.thumbnail-grid .record-recommendations .cover {
    width: var(--thumbnail-grid-width);
    height: 180px;
    object-fit: contain;
}

.thumbnail-grid .record-recommendations .row {
    height: 24px;
    line-height: 24px;
    margin-top: 4px;
    transition: transform 0.3s ease-in-out;
    white-space: nowrap;
}

.record-recommendations .title {
    font-size: 14px;
}

.record-recommendations .author {
    margin-right: 14px;
    color: #258fb8;
    cursor: pointer;
}

.record-recommendations .tag {
    margin-right: 10px;
}

.record-recommendations .tag::before {
    content: '#';
    margin-right: 2px;
}

.check-container {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-left: 10px;
    background-color: #f6f6f8;
    z-index: 100;
    opacity: 0.5;
}
</style>