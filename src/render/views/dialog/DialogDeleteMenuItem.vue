<template>
    <el-dialog v-model="modelValue.isVis"
               align-center
               title="你确定要这样做吗"
               width="350px"
               class="dialog-confirm">
        <p class="row">
            此操作无法撤销。这将<span class="fw-bolder">永久删除</span>数据。
            <br>如果删除的是组，那么组下面的库<span class="fw-bolder">都会被删除</span>。
        </p>
        <p class="row">
            请输入<span class="fw-bolder select-text"> {{ modelValue.confirmName }} </span>进行确认。
        </p>
        <div class="row">
            <el-input v-model="modelValue.confirmInput"
                      spellcheck="false" />
        </div>
        <div class="row">
            <el-button :class="[modelValue.confirmName === modelValue.confirmInput ? 'confirmed' : 'no-confirm']"
                       :disabled="modelValue.confirmName !== modelValue.confirmInput"
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
    padding: 5px 0;
}

.el-button {
    width: 100%;
    border-color: #d5d8da;
}

.row .no-confirm,
.row .no-confirm:hover {
    color: #e68d94;
    background-color: #f6f8fa;
}

.confirmed {
    color: #cf222e;
}

.confirmed:hover {
    background-color: #a40e26;
    color: #fff;
}
</style>