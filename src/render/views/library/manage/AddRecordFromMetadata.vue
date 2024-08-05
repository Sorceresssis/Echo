<template>
    <div class="flex-col">
        <el-form class="dashboard__content scrollbar-y-w8"
                 label-width="120px"
                 label-position="left">
            <el-form-item :label="'导入单个'">
                <div class="flex-row">
                    <el-input v-model="SingleMetaSrcInputValue"
                              spellcheck=false
                              :placeholder="'Import item from the input directory'"
                              clearable />
                    <button2 @click.stop="selectSingleMetaSrcDir"> {{ $t('layout.selectDir') }} </button2>
                </div>
            </el-form-item>
            <el-form-item>
                <div class="float-right">
                    <el-button type="primary"
                               @click="handleAddRecordFromMetadata(0, 0)">新增记录</el-button>
                    <el-button type="primary"
                               @click="handleAddRecordFromMetadata(0, 1)">更新记录</el-button>
                </div>
            </el-form-item>
            <el-form-item :label="'导入多个'">
                <div class="flex-row">
                    <el-input v-model="MultipleMetaSrcInputValue"
                              spellcheck=false
                              :placeholder="'Import multiple items under the input directory'"
                              clearable />
                    <button2 @click.stop="selectMultipleMetaSrcDir"> {{ $t('layout.selectDir') }} </button2>
                </div>
            </el-form-item>
            <el-form-item>
                <div class="float-right">
                    <el-button type="primary"
                               @click="handleAddRecordFromMetadata(1, 0)">新增未导入数据</el-button>
                    <el-button type="primary"
                               @click="handleAddRecordFromMetadata(1, 1)">更新已有记录</el-button>
                    <el-button type="primary"
                               @click="handleAddRecordFromMetadata(1, 2)">新增并更新数据</el-button>
                </div>
            </el-form-item>
            <el-form-item> <a class="link float-right"
                   @click="openInBrowser(Links.tutorial.importRecordFromMetadata)"> {{ $t('layout.functionIntro') }}
                </a>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { inject, onActivated, onMounted, Ref, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import useLibraryStore from '@/store/libraryStore';
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore';
import { $t } from '@/locale';
import { openInBrowser } from '@/util/systemUtil';
import MessageBox from '@/util/MessageBox';
import Message from '@/util/Message';
import Links from '@/constant/links';
import { VueInjectKey } from '@/constant/channel_key';
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import Button2 from '@/components/Button2.vue';


const route = useRoute()

const winowLoading = inject<Ref<boolean>>(VueInjectKey.WINDOW_LOADING)!
const activeLibrary = inject<Ref<number>>(VueInjectKey.ACTIVE_LIBRARY)!;

const libraryStore = useLibraryStore()
const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()

const SingleMetaSrcInputValue = ref('')
const selectSingleMetaSrcDir = () => {
    window.electronAPI.openDialog('dir', false).then(paths => {
        if (paths.length > 0) {
            SingleMetaSrcInputValue.value = paths[0]
        }
    })
}

const MultipleMetaSrcInputValue = ref('')
const selectMultipleMetaSrcDir = () => {
    window.electronAPI.openDialog('dir', false).then(paths => {
        if (paths.length > 0) {
            MultipleMetaSrcInputValue.value = paths[0]
        }
    })
}

const handleAddRecordFromMetadata = (type: 0 | 1, op: 0 | 1 | 2) => {
    if (type === 0) {
        if (SingleMetaSrcInputValue.value.trim() === '') {
            Message.error('请选择一个文件夹')
            return
        }
    } else {
        if (MultipleMetaSrcInputValue.value.trim() === '') {
            Message.error('请选择一个文件夹')
            return
        }
    }

    const param: RP.AddRecordFromMetadataParam = {
        type: type,
        operate: op,
        dir: type === 0 ? SingleMetaSrcInputValue.value : MultipleMetaSrcInputValue.value
    }

    MessageBox.addConfirm().then(() => {
        winowLoading.value = true
        viewsTaskAfterRoutingStore.setBashboardRecords('refresh')
        viewsTaskAfterRoutingStore.setBashboardRecycled('refresh')
        viewsTaskAfterRoutingStore.setBashboardAuthors('refresh')
        viewsTaskAfterRoutingStore.setBashboardTags('refresh')
        viewsTaskAfterRoutingStore.setBashboardDirnames('refresh')
        viewsTaskAfterRoutingStore.setAuthorRecords('refresh')

        return window.dataAPI.addRecordFromMetadata(activeLibrary.value, param)
    }).then(res => {
        if (res.code) Message.success('导入成功')
        else Message.error(res.msg)
        // Role
    }).catch(() => {
    }).finally(() => {
        libraryStore.getRoles(activeLibrary.value).finally(() => {
            winowLoading.value = false
        })
    })
}

const init = function () {
    SingleMetaSrcInputValue.value = MultipleMetaSrcInputValue.value = ''
}
watch(route, () => {
    needInit = true
})
let needInit = false
onMounted(init)
onActivated(() => {
    if (needInit) {
        init()
        needInit = false
    }
})
</script>

<style scoped></style>