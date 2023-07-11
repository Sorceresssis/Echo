<template>
    <el-dialog v-model="modelValue.isVis"
               align-center
               title="你确定要这样做吗"
               width="350px"
               class="dialog-confirm">
        <p class="row">
            此操作无法撤销。这将<span class="fw-bolder">永久删除</span>数据
        </p>
        <p class="row">
            请输入<span class="fw-bolder select-contain"> {{ modelValue.confirmName }} </span>进行确认。
        </p>
        <div class="row">
            <el-input v-model="modelValue.confirmInput" />
        </div>
        <div class="row">
            <el-button :class="{ 'confirmed': modelValue.confirmName == modelValue.confirmInput }"
                       :disabled="modelValue.confirmName != modelValue.confirmInput"
                       @click="emit('handle-delete')">
                我明白后果，确认删除
            </el-button>
        </div>
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
    (e: 'handle-delete'): void
}>() 
</script>

<style scoped>
.row {
    margin-bottom: 10px;
}

.el-button {
    background-color: #a40e26 !important;
    color: #fff !important;
}

.confirmed {
    background-color: #a40e26;
    ;
    color: #fff;
}
</style>