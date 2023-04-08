<template>
    <div class="fullBox"
         id="itemsWrapper">
        <!-- 没有一个item -->
        <div v-if="items.length == 0"
             id="emptyLibrary"
             class="fullBox">
            该库还没有任何东西哦~
        </div>
        <!-- 有item -->
        <div v-else
             id="Items">
            <div v-for="(item, itemIndex) in items"
                 :key="item.id"
                 class="item">
                <!-- 屏障 -->
                <!-- <div></div> -->
                <!-- 内容 -->
                <div>
                    <div class="item__img-wrapper">
                        <div class="item__open">
                            <div @click="openItem(item.id)"><span class="iconfont">&#xe6e6;</span></div>
                            <div @click="openItemFolder(item.id)"><span class="iconfont">&#xe8a4;</span></div>
                            <div @click="openItemHyperlink(item.id)"><span class="iconfont">&#xe6c8;</span></div>
                        </div>
                        <img :src="`../assets/images/${item.id & 1 ? '屏幕截图 2022-11-08 192954.png' : '2.jpg'}`"
                             @error="($event.target as HTMLImageElement).src = '../assets/images/imageError.png'">
                    </div>
                    <div class="item__infoList"
                         @mousedown="handleMouseDown"
                         @mousemove="handleMouseMove"
                         style="color: #474747;">
                        {{ item.title }}
                    </div>
                    <div class="item__infoList"
                         @mousedown="handleMouseDown"
                         @mousemove="handleMouseMove">
                        <span v-for="(author, authorIndex) in item.authors == null ? [] : item.authors.split(',')">
                            <span v-if="authorIndex != 0"> , </span> <span class="item__author"
                                  @click="router.push({ path: '/author', query: { authorID: item.authorsID.split(',')[authorIndex] } })">{{
                                      author
                                  }}</span>
                        </span>
                    </div>
                    <div class="item__infoList"
                         @mousedown="handleMouseDown"
                         @mousemove="handleMouseMove">
                        <span v-for="(tag) in item.tags == null ? [] : item.tags.split(',')"
                              @click=""
                              class="item__tag">
                            #{{ tag }}
                        </span>
                    </div>
                </div>

            </div>
            <!-- el-backtop 最好放在target对象的内部,让el-backtop和target对象一起消失和出现
                    当target被router或者component切换时,不会报错
                    Error in mounted hook: "Error: target is not existed:
                -->
            <el-backtop target="#Items"
                        :bottom="80"
                        :right="80">
                <span class="iconfont">&#xe616;</span>
            </el-backtop>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, inject, } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{
    items: item[]
}>()
const activeLibrary = inject<Ref<library>>('activeLibrary') as Ref<library>
// let a: string = (await window.electronAPI.getConfig()).userDataPath
// console.log(a.replaceAll("\\", "/") + `/image/${1}/coverImage/${1}.jpg`)

const openItem = (itemID: number) => {
    window.electronAPI.createItemWinodw(activeLibrary.value.id, itemID)
}
const openItemFolder = async (itemID: number) => {
    console.log(await window.electronAPI.showItemInFolder('F:/Project/Github/echo/src/render/assets/images'));
}
const openItemHyperlink = (itemID: number) => {
    window.electronAPI.openUrlExternal(props.items[itemID].hyperlink)
}

const isMouseDown = ref(false)
const handleMouseDown = (event: MouseEvent) => {
    isMouseDown.value = true
}
const handleMouseMove = (event: MouseEvent) => {
    if (isMouseDown.value) {
        (event.currentTarget as HTMLDivElement).scrollLeft -= event.movementX
    }
}
document.addEventListener('mouseup', () => {
    isMouseDown.value = false
})
</script>

<style scoped>
.fullBox {
    display: flex;
    flex: 1;
    overflow: hidden;
}

#emptyLibrary {
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #6d757a;
}

#Items {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, 220px);
    justify-content: space-around;
    grid-gap: 30px;
    column-gap: 20px;
    padding: 10px;
    overflow-y: auto;
}

#Items::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
}

#Items::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #cfcfcf;
}

.item {
    position: relative;
    cursor: pointer;
}

.item__img-wrapper {
    display: flex;
    position: relative;
    width: 100%;
    height: 180px;
    justify-content: center;
    align-items: center;
}

.item__img-wrapper img {
    max-width: 100%;
    max-height: 100%;
}

.item__open {
    display: none;
    width: 100%;
    justify-content: center;
    position: absolute;
    bottom: 0;
}

.item:hover .item__open {
    display: flex;
    background-color: rgba(246, 246, 248, .7);
}

.item__open>div {
    border-radius: 50%;
    margin: 5px 10px;
    padding: 10px;
    background-color: rgba(0, 0, 0, .5);
    text-align: center;
    color: rgba(255, 255, 255, .7);
}

.item__open>div:hover {
    background-color: rgba(0, 0, 0, .8);
    color: #fff;
}

.iconfont {
    font-size: 20px !important;
}

.item__infoList {
    padding: 2px 0;
    text-align: center;
    white-space: nowrap;
    overflow-x: auto;
}

.item__infoList::-webkit-scrollbar {
    display: none;
}

.item__author {
    font-size: 13px;
    color: #258fb8;
}

.item__author:hover {
    color: #fd9e16;
}

.item__tag {
    margin: 0 4px;
    font-size: 13px;
    padding: 1px 5px;
    border-radius: 3px;
    color: #fff;
    background-color: #aaa;
}

.item__tag:hover {
    background-color: #444;
}
</style>