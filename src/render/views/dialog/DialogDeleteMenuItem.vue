<template>
    <el-dialog v-model="modelValue.isVis"
               align-center
               title="你确定要这样做吗"
               width="350px"
               class="dialog-confirm">
        <p>
            此操作<span style="font-weight: 700;">无法</span>撤销。这将永久删除数据
        </p>
        <p>
            请输入 <span style="font-weight: 700; user-select: text;">{{ modelValue.confirmName }}</span>
            进行确认。
        </p>
        <el-input class="diaglog-input"
                  v-model="modelValue.confirmInput" />
        <span class="dialog-footer">
            <el-button type="primary"
                       :class="{ 'confirmed': modelValue.confirmName == modelValue.confirmInput }"
                       @click="emit('')">
                我明白后果，确认删除
            </el-button>
        </span>
    </el-dialog>
</template>

<script setup lang='ts'>
const props = defineProps<{
    modelValue: {
        isVis: boolean,
        confirmName: string,
        confirmInput: string
    }
}>()
const emit = defineEmits<{
    handleDelete: () => void
}>() 
</script>

<style scoped></style>