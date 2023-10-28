<template>
    <div class="flex-col">
        <el-form class="dashboard__content scrollbar-y-w8"
                 label-position="left"
                 require-asterisk-position="right"
                 status-icon
                 label-width="auto">
            <el-form-item :label="$t('layout.useSearchAuxiliaryText')">
                <el-switch v-model="activeLibraryDetail.useAuxiliarySt" />
            </el-form-item>
            <el-form-item :label="$t('layout.searchAuxiliaryText')">
                <el-input v-model="activeLibraryDetail.auxiliarySt"
                          placeholder="eg: site:xxx.com"
                          maxlength="255"
                          :show-word-limit="true"
                          clearable />
            </el-form-item>
            <el-form-item label="ID">
                {{ activeLibraryDetail.id }}
            </el-form-item>
            <el-form-item :label="$t('layout.createdTime')">
                {{ activeLibraryDetail.createTime }}
            </el-form-item>
            <el-form-item :label="$t('layout.intro')">
                <el-input v-model="activeLibraryDetail.intro"
                          type="textarea"
                          spellcheck="false"
                          :autosize="inputAutoSize"
                          resize="none" />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang='ts'>
import { watch, inject, } from 'vue'
import { debounce } from '@/util/common'
import { sendCrosTabMsg } from "@/util/CrosTabMsg"

const inputAutoSize = {
    minRows: 8,
    maxRows: 8,
}

const bc = new BroadcastChannel('updateLibraryDetail')

const activeLibraryDetail = inject<VO.LibraryDetail>('activeLibraryDetail')!

const editLibraryExtra = debounce(async function () {
    window.electronAPI.editLibraryExtra({
        id: activeLibraryDetail.id,
        useAuxiliarySt: activeLibraryDetail.useAuxiliarySt ? 1 : 0,
        auxiliarySt: activeLibraryDetail.auxiliarySt,
        intro: activeLibraryDetail.intro,
    }).then(() => {
        // 通知activeLibrary相同的libraryDetail更新
        sendCrosTabMsg(bc, activeLibraryDetail.id.toString())
    })
}, 700)

watch(() => [
    activeLibraryDetail.useAuxiliarySt,
    activeLibraryDetail.auxiliarySt,
    activeLibraryDetail.intro,
], editLibraryExtra)
</script>

<style scoped>
.section {
    margin-bottom: 30px;
}

.row {
    padding: 5px 0;
}
</style>