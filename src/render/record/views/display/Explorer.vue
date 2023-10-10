<template>
    <div class="explorer">
        <div class="path-nav">
            <span v-for="(folder, idx) in path"
                  @click=""> {{ folder }}</span>
        </div>
        <scrollbar class="folder-container adaptive-grid scrollbar-y-w8">
            <folder v-for="i in 100"></folder>
            <div v-for="(folder, idx) in folderList"
                 class="folder-item"
                 :key="1"
                 @click="openFolder('')">
                <div class="folder-icon">
                    <img src=""
                         alt="">
                </div>
                <div class="folder-name">

                </div>
            </div>
        </scrollbar>
    </div>
</template>

<script setup lang='ts'>
import { inject, ref, readonly, onMounted } from 'vue'
import { openInExplorer } from '@/util/systemUtil'
import Scrollbar from '@/components/Scrollbar.vue'
import Folder from '@/components/Folder.vue'

const record = readonly(inject<VO.RecordDetail>('record')!)

const errMsg = ref<string>('') // 路径不存在 | 为设置路径 | ''
const path = ref<string[]>([])
const folderList = ref<any[]>([1, 5])

// 查询路径下的所有文件和文件夹
const queryPath = (path: string) => {

}


// 文件不存在
// 如果sroucePath是文件夹，则打开文件夹, 如果是文件，显示文件信息，
const openFolder = (path: string) => {

}

onMounted(() => {
    if (!record.resourcePath) {
        errMsg.value = '未设置路径'
        return
    }
    path.value.push(record.resourcePath)
    path.value.push('test', 'test')
    folderList.value.push()
}) 
</script>

<style scoped>
.explorer {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    background-color: #fff;
}

.path-nav {
    display: flex;
    align-items: center;
    height: 50px;
}

.folder-container {
    --folder-item-width: 200px;
    --folder-item-height: 200px;
    flex: 1;
    grid-template-columns: repeat(auto-fill, var(--folder-item-width));
    column-gap: 25px;
    row-gap: 25px;
}
</style>