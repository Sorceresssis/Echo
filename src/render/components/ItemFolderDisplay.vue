<template>
    <div id="ItemFolderDisplay">
        <div style="display: flex;">
            <div><button>返回上一级</button>
                <button>隐藏的文件夹列表</button>
            </div>
            <div>
                <span v-for="folder in folderLink"
                      class="folder">
                    {{ folder }}
                </span>
            </div>
        </div>
        <div>
            <div v-for="file in openPathFileList">
                <div v-if="file.type == ''">
                </div>
                <div v-else-if="file.type == ''"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

const rootPath = 'F:\\test\\test'
const folderLink = ref<string[]>(['fdfd', 'test', 'test'])

const openPathFileList = [
    { type: 'txt', dirname: 'fdfdf.txt' },
    { type: 'img', dirname: 'aa.png' },
    { type: 'img', dirname: 'dfsdf.jpg' },
    { type: 'folder', dirname: 'fefef' },
    { type: 'other', dirname: 'fefefef' }]

</script>

<style scoped>
#ItemFolderDisplay {
    flex: 1;
    display: flex;
    overflow: hidden;
    background-color: #f3f3f3;
}

.folder {
    margin: 0 10px;
}
</style>