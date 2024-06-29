<template>
    <div v-if="record.resourcePath"
         class="file-explorer">
        <header class="file-explorer__header">
            <div class="operate">
                <span :title="$t('layout.backToParentFolder')"
                      class="iconfont fz-26 icon"
                      @click="explorer.back"> &#xe665; </span>
                <span class="iconfont fz-26"> &#xe680; </span>
                <el-dropdown v-show="showFolderIdxs.length < shadowFolders.length"
                             trigger="click"
                             placement="bottom-start"
                             size="small"
                             popper-class="file-explorer__dropdown-menu">
                    <span class="iconfont fz-20 icon"> &#xe63e; </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="i in collapseFolderIdxs "
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
                    <li v-for=" i in showFolderIdxs "
                        :key="i"
                        class="v-center">
                        <span class="folder-nav-item textover--ellopsis"
                              :title="shadowFolders[i]"
                              @click="explorer.go(i)"> {{
                                shadowFolders[i] }} </span>
                        <el-dropdown v-if="i !== shadowFolders.length - 1 || !currDirContent.every(item => item.type === 'file')"
                                     trigger="click"
                                     placement="bottom-start"
                                     size="small"
                                     popper-class="file-explorer__dropdown-menu">
                            <span class="iconfont fz-20 icon"
                                  @click="explorer.showFoldersDropdownMenu(i)"> &#xe614; </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="folderName in dropdownFolders "
                                                      :key="folderName"
                                                      :title="folderName"
                                                      @click="explorer.go(i, folderName)"> {{ folderName }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </li>
                </ul>
                <ul class="shadow">
                    <li v-for="folder in shadowFolders "
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
                <FolderContentItem v-for=" item in currDirContent "
                                   :key="item.name"
                                   :dirContentItem="item"
                                   @openDir="explorer.push"
                                   @contextmenu="openCtm($event, item)" />
            </div>
            <context-menu v-model:show="isVisCtm"
                          :options="ctmOptions">
                <context-menu-item v-show="focusDirContentItem!.type === 'file'"
                                   :label="$t('layout.openWithDefaultProgram')"
                                   @click="openFile(focusDirContentItem!.fullPath)" />
                <context-menu-item v-show="focusDirContentItem!.type === 'folder'"
                                   :label="$t('layout.openInFileExplorer')"
                                   @click="openInExplorer(focusDirContentItem!.fullPath, 'openPath')" />
                <context-menu-item :label="$t('layout.showInFileExplorer')"
                                   @click="openInExplorer(focusDirContentItem!.fullPath, 'showItemInFolder')" />
            </context-menu>
        </scrollbar>
        <empty v-else
               :title="$t('layout.currentFolderIsEmpty')" />
    </div>
    <empty v-else
           class="file-explorer"
           :title="$t('layout.noSourcePath')"
           bg-color="#fff" />
</template>

<script setup lang='ts'>
import { inject, ref, readonly, onMounted, watch } from 'vue'
import useExplorerService from '@/record/service/explorerService'
import { openInExplorer, openFile } from '@/util/systemUtil'
import Scrollbar from '@/components/Scrollbar.vue'
import Empty from '@/components/Empty.vue'
import FolderContentItem from '@/components/FolderContentItem.vue'

const record = readonly(inject<VO.RecordDetail>('record')!)

const explorer = useExplorerService()
const {
    realFolders,
    showFolderIdxs,
    collapseFolderIdxs,
    shadowFolders,
    currDirContent,
    dropdownFolders,
} = explorer

// ANCHOR 右键菜单
const isVisCtm = ref(false)
const ctmOptions = {
    theme: 'flat',
    zIndex: 3000,
    minWidth: 220,
    x: 500,
    y: 200
}
let focusDirContentItem: typeof currDirContent.value[number] | undefined = void 0
const openCtm = (
    e: MouseEvent,
    item: DirContentItem & {
        fullPath: string
    }) => {
    ctmOptions.x = e.x
    ctmOptions.y = e.y
    focusDirContentItem = item
    isVisCtm.value = true
}


watch(() => record.resourcePath, () => {
    if (realFolders.value.length === 0) {
        if (record.resourcePath) {
            explorer.init(record.resourcePath)
        }
    } else {
        if (!record.resourcePath) {
            explorer.reset()
        } else if (record.resourcePath !== realFolders.value[0]) {
            explorer.init(record.resourcePath)
        }
    }
})

onMounted(() => {
    if (record.resourcePath) {
        explorer.init(record.resourcePath)
    }
})

// TODO 瀑布流, 预览图片
// TODO 文件夹读取其下的图片,作为封面
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