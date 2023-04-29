<template>
    <div class="manageData-wrap">
        <div class="Menu">
            <div v-for="(menuItem, index) in menuItems"
                 :class="activeCard == index ? 'Menu__item--active' : ''"
                 class="Menu__item"
                 @click="activeCard = index">
                {{ menuItem }}
            </div>
        </div>
        <div class="manageData__body">
            <KeepAlive>
                <div v-if="activeCard == 0">
                    标题
                    作者
                    tag
                    文件路径
                    文件名
                </div>
                <div v-else-if="activeCard == 1">
                    批量添加
                    添加的文件夹
                    tag
                    作者
                </div>
                <div v-else-if="activeCard == 2">
                    添加属性
                    tag
                    author

                </div>
                <div v-else-if="activeCard == 3">
                    批量删除，by 属性 文件夹， 作者， 标签
                </div>
                <div v-else-if="activeCard == 4">
                    更改 删除 属性
                    authorName1 -> authorName2
                </div>
            </KeepAlive>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
const menuItems = ['添加', '批量添加', '添加属性', '批量删除', '更改属性']
const activeCard = ref<number>(0)



</script>

<style scoped>
.manageData-wrap {
    padding: 15px 0;
}

.Menu {
    display: flex;
    border-bottom: 1.5px solid #ebebeb;
}

.Menu__item {
    height: 25px;
    width: 70px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    margin-right: 10px;
    line-height: 1;
    border-bottom: 3px solid #fff;
}

.Menu__item:hover {
    color: #887cf7;
}

.Menu__item--active {
    color: #887cf7;
    border-bottom: 3px solid #887cf7;
}

.manageData__body {
    height: 250px;
    padding: 10px 0;
    overflow: hidden;
}
</style>