<template>
    <div>
        <div class="infoRow"
             style="width:40%">
            <h3 class="infoRow__title">{{ $t('app.tag') }}</h3>
            <div class="list">
                <ul>
                    <li v-for="tag in tags"
                        :key="tag.id"
                        @contextmenu="clibboardWriteText(tag.value)">
                        <span>{{ tag.value }}</span>
                        <span class="itemCount">{{ tag.itemCount }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="infoRow"
             style="width: 60%;">
            <h3 class="infoRow__title">{{ $t('app.folder') }}</h3>
            <div class="list">
                <ul>
                    <!-- TODO 双击在打开文件夹 -->
                    <li v-for="folder in folders"
                        :key="folder.id"
                        @dblclick=""
                        @contextmenu="clibboardWriteText(folder.value)">
                        <span>{{ folder.value }}</span>
                        <span class="itemCount">{{ folder.itemCount }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
           
<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { clibboardWriteText } from '../../util/externalOperation'

onMounted(async () => {
    tags.value.push(...await window.electronAPI.getAttributes(1, 0, 0))
    folders.value.push({ id: 1, value: "F:\\Project\\Github\echo\\node_modules\\electron\dist", itemCount: 1 },
        { id: 2, value: 'F:\\Project\\Github\\echo', itemCount: 43 },
        { id: 3, value: 'F:\\Project\Github\\echo\\node_modules\@imengyu\vue3-context-menu\examples', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
        { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },)
})

const folders = ref<LibraryAttribute[]>([])
const tags = ref<LibraryAttribute[]>([])

// 双击复制到剪贴板
</script>

<style scoped>
.infoRow {
    display: flex;
    flex-direction: column;
    padding-bottom: 8px;
    overflow: hidden;
}

.infoRow__title {
    width: 100%;
    height: 40px;
    font-weight: 700;
    font-size: 16px;
}

.list {
    width: 100%;
    flex: 1;
    overflow: auto;
}

.list::-webkit-scrollbar {
    width: 8px;
    height: 10px;
    background-color: transparent;
}

.list::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #cfcfcf;
}

.list li {
    display: flex;
    padding: 0 10px;
    border-radius: 3px;
    line-height: 26px;
    font-size: 13px;
    white-space: nowrap;
}

.list li:hover {
    background-color: #d9d9d9;
}

.itemCount {
    color: #258fb8;
    margin-left: 8px;
}
</style>