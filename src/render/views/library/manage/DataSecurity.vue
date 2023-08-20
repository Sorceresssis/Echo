<template>
    <div>
        <div>
            <label>新建备份</label>
            <el-input :placeholder="'输入备份名字'" />
            <button2>开始备份</button2>
        </div>
        <div>
            <!-- 备份列表  删除， 导入，  -->
            <el-select></el-select>
            <button2>导入备份</button2>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Button2 from '@/components/Button2.vue'
// 数据导出（导出的是 数据库和图片）
// 数据库备份，
// 给出一些建议：建议把保存数据的文件夹备份到其他地方，即时那天误删了 




</script>

<style scoped></style>