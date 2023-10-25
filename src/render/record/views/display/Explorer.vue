<template>
    <div v-if="record.resourcePath"
         class="file-explorer">
        <header class="file-explorer__header">
            <div class="operate">
                <span class="iconfont fz-26 icon"
                      @click="explorer.back"> &#xe665; </span>
                <span class="iconfont fz-26"> &#xe680; </span>

                <el-dropdown v-show="showFolderIdxs.length < shadowFolders.length"
                             trigger="click"
                             placement="bottom-start"
                             size="small">
                    <span class="iconfont fz-20 icon"> &#xe63e; </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="i in collapseFolderIdxs"
                                              :key="i"
                                              :title="shadowFolders[i]"
                                              @click="explorer.go(i)"> {{ shadowFolders[i] }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <nav class="folder-nav">
                <ul>
                    <li v-for="i in showFolderIdxs"
                        :key="i"
                        class="v-center">
                        <span class="folder-nav-item textover--ellopsis"
                              :title="shadowFolders[i]"
                              @click="explorer.go(i)"> {{ shadowFolders[i] }} </span>

                        <el-dropdown v-if="i !== shadowFolders.length - 1 || !currDirContent.every(item => item.type === 'file')"
                                     trigger="click"
                                     placement="bottom-start"
                                     size="small">
                            <span class="iconfont fz-20 icon"
                                  @click=""> &#xe614; </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="i in collapseFolderIdxs"
                                                      :key="i"
                                                      :title="shadowFolders[i]"
                                                      @click="explorer.go(i)"> {{ shadowFolders[i] }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </li>
                </ul>
                <ul class="shadow">
                    <li v-for="folder in shadowFolders"
                        :key="folder"
                        class="v-center">
                        <span class="folder-nav-item textover--ellopsis"> {{ folder }} </span>
                        <span class="iconfont fz-20 icon"> &#xe614; </span>
                    </li>
                </ul>
            </nav>
            <div class="operate">
            </div>
        </header>
        <scrollbar v-if="currDirContent.length"
                   class="scrollbar-y-w8 margin-tb-10 flex-1">
            <div class="adaptive-grid folder-container"
                 v-viewer="{ transition: false }">
                <FolderContentItem v-for="item in currDirContent"
                                   :key="item.name"
                                   :dirContentItem="item"
                                   @openDir="explorer.push" />
            </div>
            <context-menu v-model:show="isVisCtm"
                          :options="ctmOptions">
                <context-menu-item :label="'用默认程序打开'"
                                   @click="">
                    <template #icon> <span class="iconfont"> &#xe722; </span> </template>
                </context-menu-item>
                <context-menu-item label="在文件资源管理器中打开"
                                   @click=" ">
                    <template #icon> <span class="iconfont"> &#xe636; </span> </template>
                </context-menu-item>
                <context-menu-item label="在文件资源管理器中显示"
                                   @click=" ">
                    <template #icon> <span class="iconfont"> &#xe636; </span> </template>
                </context-menu-item>
            </context-menu>
        </scrollbar>
        <empty v-else
               :title="'当前文件夹为空'" />
    </div>
    <empty v-else
           class="file-explorer"
           :title="'未设置资源路径'"
           bg-color="#fff" />
</template>

<script setup lang='ts'>
import { inject, ref, readonly, onMounted, } from 'vue'
import useExplorerService from '@/record/service/explorerService'
import { useRoute } from 'vue-router'
import { openInExplorer } from '@/util/systemUtil'
import Scrollbar from '@/components/Scrollbar.vue'
import Empty from '@/components/Empty.vue'
import FolderContentItem from '@/components/FolderContentItem.vue'
import { watch } from 'fs'

const route = useRoute()

const record = readonly(inject<VO.RecordDetail>('record')!)

const explorer = useExplorerService()
const {
    showFolderIdxs,
    collapseFolderIdxs,
    shadowFolders,
    currDirContent,
} = explorer


const isVisCtm = ref(false)
const ctmOptions = {

}




onMounted(() => {
    if (record.resourcePath) {
        explorer.init(record.resourcePath)
    }
})

// TODO 瀑布流
// TODO 右键菜单  在资源管理器中打开，打开文件夹， 用默认打开，用指定程序打开
// TODO 文件夹读取其下的图片
</script>

<style scoped>
.file-explorer {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    background-color: #fff;
    line-height: 40px;
    overflow: hidden;
}

.file-explorer__header {
    height: 40px;
    display: flex;
    justify-content: space-between;
    line-height: 1;
    font-size: 12px;
    min-width: 0;
}

.file-explorer__header .operate {
    display: flex;
    align-items: center;
}

.folder-nav {
    flex: 1;
    color: #333;
    min-width: 0;
}

.folder-nav ul {
    display: flex;
    height: 100%;
}

.folder-nav-item {
    max-width: 250px;
    padding: 4px 5px;
    margin: 0 3px;
    cursor: pointer;
}

.folder-nav-item:hover {
    border-radius: 3px;
    background-color: var(--echo-theme-color-light6);
}

.icon {
    cursor: pointer;
}

.file-explorer__header .icon:hover {
    color: var(--echo-theme-color);
}

.folder-container {
    --folder-item-width: 220px;
    --folder-item-height: 196px;
    grid-template-columns: repeat(auto-fill, var(--folder-item-width));
    column-gap: 25px;
    row-gap: 15px;
}
</style> 