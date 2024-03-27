<template>
    <el-dialog v-model="deleteInfo.isVis"
        class="dialog-confirm"
        :title="$t('tips.dangerousOperation')"
        width="420px"
        align-center>
        <p class="row fw-700">{{ $t('tips.deleteLibraryP1') }} </p>
        <p class="row"> {{ $t('tips.deleteLibraryP2') }} </p>
        <p class="row"> {{ $t('tips.deleteLibraryP3', { name: deleteInfo.confirmName }) }}</p>
        <div class="row">
            <el-input v-model="deleteInfo.confirmInput"
                spellcheck="false" />
        </div>
        <div class="row">
            <el-button :class="[deleteInfo.confirmName === deleteInfo.confirmInput ? 'confirmed' : 'no-confirm']"
                :disabled="deleteInfo.confirmName !== deleteInfo.confirmInput"
                @click="emit('handle-delete')">
                {{ $t('layout.iKnowTheConsequences') }}
            </el-button>
        </div>
    </el-dialog>
</template>

<script setup
    lang='ts'>

    defineProps<{
        deleteInfo: {
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
        user-select: text;
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