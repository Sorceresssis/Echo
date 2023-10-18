<template>
    <div class="explorer">
        <div class="path-nav">
            <span @click="explorer.back">退回</span>

            <span v-for="(folder, idx) in pathLink "
                  class="path-nav-item"
                  @click=""> {{ folder }}</span>
        </div>
        <scrollbar class="folder-container adaptive-grid scrollbar-y-w8">
            <folder v-for="item in currDirContent "
                    @dblclick="explorer.push(item.name)">
                {{ item.name }}
            </folder>
        </scrollbar>
    </div>
</template>

<script setup lang='ts'>
import { inject, ref, readonly, onMounted, watch } from 'vue'
import useExplorerService from '@/record/service/explorerService'
import { openInExplorer } from '@/util/systemUtil'
import Message from '@/util/Message'
import Scrollbar from '@/components/Scrollbar.vue'
import Folder from '@/components/Folder.vue'

const record = readonly(inject<VO.RecordDetail>('record')!)


const explorer = useExplorerService()

const { pathLink, currDirContent } = explorer

// class PathNav {
//     private pathLink: string[] = []

//     constructor(basePath: string) {
//         this.pathLink.push(basePath)
//     }

//     public push(path: string) {
//         this.pathLink.push(path)
//     }

//     public pop() {
//         this.pathLink.pop()
//     }

//     public get() {
//         return this.pathLink
//     }

//     public async getFullPath() {
//         return this.pathLink.join(await window.systemAPI.pathSep())
//     }
// }
// const pathNav = new PathNav(record.resourcePath!)



// 查询路径下的所有文件和文件夹
// const queryDirContent = async (path: string) => {
//     const result = await window.electronAPI.readdir(path)
//     if (result.code) {
//         currDirContent.value = result.data
//         // console.log(result.data)

//     } else {
//         pathLink.value.pop()
//         Message.error(result.msg!)
//     }
// }


// 未设置， 不存在， 此文件夹为空


// 如果sroucePath是文件夹，则打开文件夹, 如果是文件，显示文件信息，
// const openFolder = (function () {


//     return (item: DirContentItem) => {
//         if (item.type === 'folder') {
//             pathLink.value.push(item.name)
//             window.systemAPI.pathSep().then((sep) => {
//                 // console.log(pathLink.value.join(sep));

//                 queryDirContent(pathLink.value.join(sep))
//             })
//         }
//     }
// })()


// watch(pathLink.value, (newVal, oldVal) => {
//     queryDirContent
// },)

onMounted(() => {
    if (record.resourcePath) {
        explorer.push(record.resourcePath)
    }
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
    height: 30px;
    display: flex;
    font-size: 14px;
    align-items: center;
}

.path-nav-item {
    cursor: pointer;
    font-size: 14px;
    margin-right: 5px;
}

.path-nav-item::after {
    content: '\e66c';
    font-family: 'iconfont' !important;
    margin-left: 5px;
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