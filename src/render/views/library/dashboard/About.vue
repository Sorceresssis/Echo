<template>
    <div class="flex-col">
        <el-form class="dashboard__content scrollbar-y-w8"
                 label-position="left"
                 require-asterisk-position="right"
                 status-icon
                 label-width="auto">
            <el-form-item :label="$t('layout.useSearchAuxiliaryText')">
                <el-switch v-model="activeLibraryDetail.use_auxiliary_st"
                           :active-value="1"
                           :inactive-value="0" />
            </el-form-item>
            <el-form-item :label="$t('layout.searchAuxiliaryText')">
                <el-input v-model="activeLibraryDetail.auxiliary_st"
                          placeholder="eg: site:xxx.com"
                          :spellcheck="false"
                          :maxlength="auxiliarySearchTextMaxLength"
                          :show-word-limit="true"
                          clearable />
            </el-form-item>
            <el-form-item label="ID">
                {{ activeLibraryDetail.id }}
            </el-form-item>
            <el-form-item :label="$t('layout.createdTime')">
                {{ activeLibraryDetail.create_time }}
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
import { watch, inject, toRaw } from 'vue'
import { debounce } from '@/util/common'
import { CrosTabBroadcastKey, VueInjectKey } from '@/constant/channel_key';
import CrosTabBroadcast from "@/util/CrosTabBroadcast";
import { ElForm, ElFormItem, ElSwitch, ElInput } from 'element-plus';

const auxiliarySearchTextMaxLength = 255
const inputAutoSize = {
    minRows: 8,
    maxRows: 8,
}

const recordTabBroadcast = new CrosTabBroadcast(CrosTabBroadcastKey.CHANNEL.recordTab)

const activeLibraryDetail = inject<VO.LibraryDetail>(VueInjectKey.ACTIVE_LIBRARY_DETAIL)!;

const editLibraryExtra = debounce(async function () {
    window.dataAPI.editLibraryExtra({
        id: activeLibraryDetail.id,
        use_auxiliary_st: activeLibraryDetail.use_auxiliary_st ? 1 : 0,
        auxiliary_st: activeLibraryDetail.auxiliary_st,
        intro: activeLibraryDetail.intro,
    }).then((res) => {
        if (!res) return
        recordTabBroadcast.sendMsg({
            type: CrosTabBroadcastKey.MSG_TYPE.reloadLibraryDetail,
            payload: toRaw(activeLibraryDetail)
        })
    })
}, 700)

watch(() => [
    activeLibraryDetail.use_auxiliary_st,
    activeLibraryDetail.auxiliary_st,
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