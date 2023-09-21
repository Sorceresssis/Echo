<template>
    <div class="flex-col">
        <el-form ref="formRef"
                 class="dashboard__content scrollbar-y-w8"
                 label-position="left"
                 label-width="120px"
                 require-asterisk-position="right"
                 status-icon>
            <el-form-item label="搜索时使用">
                <el-switch v-model="activeLibraryDetail.useAuxiliarySt" />
            </el-form-item>
            <el-form-item label="搜索辅助文本">
                <el-input v-model="activeLibraryDetail.auxiliarySt"
                          placeholder="eg: site:xxx.com"
                          maxlength="255"
                          :show-word-limit="true"
                          clearable />
            </el-form-item>
            <el-form-item label="ID">
                {{ activeLibraryDetail.id }}
            </el-form-item>
            <el-form-item label="创建时间">
                {{ activeLibraryDetail.createTime }}
            </el-form-item>
            <el-form-item label="修改时间">
                {{ activeLibraryDetail.modifiedTime }}
            </el-form-item>
            <el-form-item label="简介">
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
import { watch, inject } from 'vue'
import { debounce } from '@/util/debounce'

const inputAutoSize = {
    minRows: 8,
    maxRows: 8,
}

const activeLibraryDetail = inject<VO.LibraryDetail>('activeLibraryDetail') as VO.LibraryDetail

const editLibraryExtra = debounce(async function () {
    window.electronAPI.editLibraryExtra({
        id: activeLibraryDetail.id,
        useAuxiliarySt: activeLibraryDetail.useAuxiliarySt ? 1 : 0,
        auxiliarySt: activeLibraryDetail.auxiliarySt,
        intro: activeLibraryDetail.intro,
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