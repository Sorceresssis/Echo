<template>
    <div class="flex-col">
        <div class="el-form-item asterisk-left">
            <label class="el-form-item__label">新建数据库备份</label>
            <div class="el-form-item__content">
                <button2>打开数据位置</button2>
            </div>
        </div>
        <div class="el-form-item asterisk-left">
            <label class="el-form-item__label">说明</label>
            <div class="el-form-item__content">
                images是数据库文件，images里是图片文件
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { reactive } from 'vue'
import Button2 from '@/components/Button2.vue'
// 数据导出（导出的是 数据库和图片）
// 数据库备份，
// 给出一些建议：建议把保存数据的文件夹备份到其他地方，即时那天误删了 

const formData = reactive({
    tagTitle: '',
    seriesName: '',
})


</script>

<style scoped>
.el-form-item__label {
    width: 120px;
    justify-content: flex-start;
}
</style>