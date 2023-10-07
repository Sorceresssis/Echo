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
            <el-form-item label="匹配值"
                          prop="targetPrefix">
                <echo-autocomplete v-model="formData.targetPrefix"
                                   type="dirname"
                                   class="padding-b8"
                                   :placeholder="'输入匹配的值'" />
            </el-form-item>
            <el-form-item label="替换值"
                          prop="replacePrefix">
                <el-input v-model="formData.replacePrefix"
                          spellcheck="false"
                          :placeholder="'输入替换值'" />
            </el-form-item>
            <el-form-item required>
                <el-button type="primary"
                           :loading="btnLoading"
                           @click="submitForm(formRef)">替换</el-button>
            </el-form-item>
            <el-form-item>
                <el-popover placement="top-start"
                            :width="500"
                            :title="'目录从头部分替换'"
                            trigger="hover">
                    <template #reference>
                        <span class="tips__reference">功能解释</span>
                    </template>
                    <div style="font-size: 12px;">
                        以文件夹目录为基本单位，批量从头开始替换路径。
                        一定要是绝对路径
                        比如:你要把所有目录名中包含F:\d的记录替换为F:\test\，就可以使用该功能，

                        比如要把所有目录名中的F:\替换为F:\test\，就可以使用该功能，

                        * 以目录为基本单位匹配不是以字符为基本单位匹配 F:\foor\b 是无法与 F:\foor\b 匹配的
                        * 一下是C:\foo\bar\baz\qux 的匹配表
                        * C:\foo\bar\baz\q 不符合
                        * C:\foo\bar\ba 不符合
                        * C:\foo\bar\baz\qux 符合
                        * C:\foo\bar\baz 符合
                        * C:\ 符合
                        * C: 非法路径
                        * C 非法路径

                        还有就是无法更改其他操作系统的路径，如果安装在windows上，就只能更改windows类型的路径

                        该操作会把dirname中的前缀 替换为新的前缀，

                        可能需要等待一些时间
                        批量替换
                        路径合并

                        F:\foor\bar\baz
                        输入：F:\foor\b -> F:\bar\ 是无法替换的，这不是简单的字符串替换，而是路径替换，要以目录为基本单位。
                    </div>
                </el-popover>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, reactive, inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
import MessageBox from '@/util/MessageBox'
import Message from '@/util/Message'
import { type FormInstance, type FormRules } from 'element-plus'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'

const route = useRoute()
const btnLoading = ref(false)

const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()
const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>

const formRef = ref()
const formData = reactive({
    // 要更改的值
    targetPrefix: '',
    // 要替换成的值 
    replacePrefix: '',
})

const rules = reactive<FormRules>({
    targetPrefix: [{
        validator: (rule, value: string, callback) => {
            value.trim().length > 0 ? callback() : callback('不能为空')
        },
        trigger: 'blur'
    }],
    replacePrefix: [{
        validator: (rule, value: string, callback) => {
            value.trim().length > 0 ? callback() : callback('不能为空')
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
            const result = await window.electronAPI.startsWithReplaceDirname(
                activeLibrary.value,
                formData.targetPrefix,
                formData.replacePrefix
            )
            result.code ? Message.success('替换成功') : Message.error(result.msg!)
            btnLoading.value = false
        })
    })
}
const init = () => {
    formData.targetPrefix = ''
    formData.replacePrefix = ''
}
watch(route, init)
</script>

<style scoped>
.manage-explain {
    float: right;
    color: #7b7b7b;
    font-size: 12px;
}
</style>