<template>
    <div class="record-detail-sideBar">
        <local-image :src="record.cover" />
        <h1>{{ record.title }}</h1>
        <div>{{ record.intro }}</div>
        <div>
            <span>作者</span>
        </div>
        <div>
            {{ record.intro }}
        </div>
        <div>
            <span>标签</span>
            <span v-for="tag in record.tags">{{ tag.title }}</span>
        </div>
        <div>
            {{ record.info }}
        </div>
        <div>
            <span>系列</span>
            <span v-for="serie in record.series">{{ serie.name }}</span>
        </div>
        <div>
            <button @click="drawerVisible = !drawerVisible">抽屉</button>
        </div>
        <div>

        </div>
        <el-drawer v-model="drawerVisible"
                   direction="btt"
                   size="300px"
                   style="background-color: #f6f6f8;">
            <!-- <template #header="{ close, titleId, titleClass }">
                <h4 :id="titleId"
                    :class="titleClass">This is a custom header!</h4>
                <el-button type="danger"
                           @click="close">
                    <el-icon class="el-icon--left">
                        <CircleCloseFilled />
                    </el-icon>
                    Close
                </el-button>
            </template> -->
            This is drawer content.
        </el-drawer>
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
    width: 280px;
    padding: 10px;
    box-sizing: border-box;
}
</style>