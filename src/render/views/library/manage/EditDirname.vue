<template>
    <div class="flex-col">
        <el-form ref="formRef"
                 class="dashboard__content scrollbar-y-w8"
                 label-position="left"
                 :model="formData"
                 :rules="rules"
                 label-width="120px"
                 require-asterisk-position="right"
                 status-icon>
            <el-form-item :label="$t('layout.searchValue')"
                          prop="targetPrefix">
                <echo-autocomplete v-model="formData.targetPrefix"
                                   type="dirname"
                                   class="padding-b8"
                                   :placeholder="$t('layout.inputSearchValue')" />
            </el-form-item>
            <el-form-item :label="$t('layout.replaceValue')"
                          prop="replacePrefix">
                <el-input v-model="formData.replacePrefix"
                          spellcheck="false"
                          :placeholder="$t('layout.inputReplaceValue')" />
            </el-form-item>
            <el-form-item required>
                <el-button type="primary"
                           :loading="btnLoading"
                           @click="submitForm(formRef)"> {{ $t('layout.replace') }} </el-button>
            </el-form-item>
            <el-form-item>
                <el-popover placement="top-start"
                            :width="500"
                            :title="$t('layout.functionIntro')"
                            trigger="hover">
                    <template #reference>
                        <span class="tips__reference"> {{ $t('layout.functionIntro') }} </span>
                    </template>
                    <div class="tips__content">
                        <p> {{ $t('tips.replaceDirnameFunctionIntroP1') }} </p>
                        <br>
                        <p> <span class="inline-list-title"> {{ $t('layout.example') }} </span> </p>
                        <p>{{ $t('tips.replaceDirnameFunctionIntroP2') }} </p>
                        <p>{{ $t('tips.replaceDirnameFunctionIntroP3') }} </p>
                        <p>{{ $t('tips.replaceDirnameFunctionIntroP4') }} </p>
                    </div>
                </el-popover>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, reactive, inject, watch, readonly, onMounted, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import { $t } from '@/locale'
import { VueInjectKey } from '@/constant/channel_key'
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
import MessageBox from '@/util/MessageBox'
import Message from '@/util/Message'
import { ElForm, ElFormItem, ElButton, type FormInstance, type FormRules } from 'element-plus'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'

const route = useRoute()
const btnLoading = ref(false)

const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()
const activeLibrary = readonly(inject<Ref<number>>(VueInjectKey.ACTIVE_LIBRARY)!)

const formRef = ref()
const formData = reactive({
    targetPrefix: '', // 要更改的值 
    replacePrefix: '', // 要替换成的值 
})

const rules = reactive<FormRules>({
    targetPrefix: [{
        validator: (rule, value: string, callback) => {
            value.trim().length > 0 ? callback() : callback($t('tips.inputValueNotEmpty'))
        },
        trigger: 'blur'
    }],
    replacePrefix: [{
        validator: (rule, value: string, callback) => {
            value.trim().length > 0 ? callback() : callback($t('tips.inputValueNotEmpty'))
        },
        trigger: 'blur'
    }],
})
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (!valid) return

        MessageBox.editConfirm().then(async () => {
            viewsTaskAfterRoutingStore.setBashboardRecords('refresh')
            viewsTaskAfterRoutingStore.setBashboardDirnames('refresh')

            btnLoading.value = true
            const result = await window.dataAPI.startsWithReplaceDirname(
                activeLibrary.value,
                formData.targetPrefix,
                formData.replacePrefix
            )
            result.code ? Message.success($t('msg.replaceSuccess')) : Message.error(result.msg!)
            btnLoading.value = false
        })
    })
}
const init = () => {
    formData.targetPrefix = ''
    formData.replacePrefix = ''
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

<style scoped>
.manage-explain {
    float: right;
    color: #7b7b7b;
    font-size: 12px;
}
</style>