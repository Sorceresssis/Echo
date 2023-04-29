<template>
    <div>
        <div class="infoRow"
             style="width:40%">
            <h3 class="infoRow__title">标签#</h3>
            <div class="list">
                <ul>
                    <li v-for="tag in tags"
                        :key="tag.id"
                        class="iconfont">
                        {{ tag.title }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="infoRow"
             style="width: 60%;">
            <h3 class="iconfont infoRow__title">文件夹&#xe7d1;</h3>
            <div class="list">
                <ul>
                    <li v-for="folder in folders"
                        :key="folder.id">
                        {{ folder.path }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'

onMounted(() => {
    folders.value.push()
    tags.value.push()
})

type folder = {
    id: number,
    path: string,
}
type tag = {
    id: number,
    title: string,
}
const folders = ref<folder[]>([])
const tags = ref<tag[]>([])

const generateArray = <T>(length: number, generator: (index: number) => T): T[] => {
    return Array.from({ length }, (_, index) => generator(index));
};

folders.value.push(...generateArray<folder>(50, (index) => ({
    id: index + 1,
    path: `/path/afdddddddddddddddddddddddddddddddddddddddddddddddddd${index + 1}`,
})))

tags.value.push(...
    generateArray<tag>(50, (index) => ({
        id: index + 1,
        title: `标签${index + 1}`,
    })));

</script>

<style scoped>
.infoRow {
    display: flex;
    flex-direction: column;
    padding: 0 10px;
}

.infoRow__title {}

.list {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.list::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: transparent;
}

.list::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #cfcfcf;
}

.list li {
    height: 20px;
    font-size: 14px;
    line-height: 20px;
}
</style>