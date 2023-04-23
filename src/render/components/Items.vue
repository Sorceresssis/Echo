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
             id="Items"
             :class="displayMode == display.thumbnail ? 'items--thumbnail' : 'items--extended'">
            <div v-for="item in items"
                 :key="item.id"
                 class="item-wrapper">
                <!-- 批量选择遮罩层 -->
                <div v-show="false"
                     class="item-mask">
                    <input type="checkbox"
                           name=""
                           id="">
                </div>
                <div class="item-inner"
                     @contextmenu="openCtm">
                    <div class="item__img-wrapper">
                        <div class="item__open">
                            <div @click="openItem(item.id)"><span class="iconfont">&#xe6e6;</span></div>
                            <div @click="openItemFolder(item.id)"><span class="iconfont">&#xe8a4;</span></div>
                            <div @click="openItemHyperlink(item.id)"><span class="iconfont">&#xe6c8;</span></div>
                        </div>
                        <img :src="`../assets/images/${item.id & 1 ? '2.jpg' : '屏幕截图 2022-11-08 192954.png'}`"
                             @error="($event.target as HTMLImageElement).src = '../assets/images/imageError.png'">
                    </div>
                    <div class="item__infoList item__title">
                        <div class="item__infoItem"
                             @mousedown="handleMouseDown"
                             @mousemove="handleMouseMove"
                             style="color: #474747;">
                            {{ item.title }}
                        </div>
                        <div class="item__infoItem"
                             @mousedown="handleMouseDown"
                             @mousemove="handleMouseMove">
                            <div>
                                <span class="tc">作者:</span>
                            </div>
                            <div>
                                <span v-for="(author, authorIndex) in item.authors == null ? [] : item.authors.split(',')">
                                    <span v-if="authorIndex != 0"> , </span>
                                    <span class="item__author"
                                          @click="router.push({ path: '/author', query: { authorID: item.authorsID.split(',')[authorIndex] } })">
                                        {{ author }}</span>
                                </span>
                            </div>
                        </div>
                        <div class="item__infoItem"
                             @mousedown="handleMouseDown"
                             @mousemove="handleMouseMove">
                            <span class="tc">标签:</span>
                            <span v-for="(tag) in item.tags == null ? [] : item.tags.split(',')"
                                  @click=""
                                  class="item__tag">
                                #{{ tag }}
                            </span>
                        </div>
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
        <context-menu v-model:show="isVisibleCtmItem"
                      :options="contextMenuOptions">
            <context-menu-item label="复制"
                               @click="" />
            <context-menu-item label="在新窗口中打开"
                               @click="" />
            <context-menu-item label="再资源管理器中打开"
                               @click="" />
            <context-menu-item label="打开链接"
                               @click="" />
            <context-menu-item label="删除"
                               @click="">
                <template #icon>
                    <span class="iconfont">&#xe61a;</span>
                </template>
            </context-menu-item>
            <context-menu-sperator />
            <context-menu-group label="移动到">
            </context-menu-group>
            <context-menu-item label="导出" />
        </context-menu>
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
enum display { thumbnail, extended }
const displayMode = inject<Ref<number>>('displayMode') as Ref<number>



// let a: string = (await window.electronAPI.getConfig()).userDataPath
// console.log(a.replaceAll("\\", "/") + `/image/${1}/coverImage/${1}.jpg`)


/******************** 打开 ********************/
const openItem = (itemID: number) => {
    window.electronAPI.createItemWinodw(activeLibrary.value.id, itemID)
}
const openItemFolder = async (itemID: number) => {
    console.log(await window.electronAPI.showItemInFolder('F:/Project/Github/echo/src/render/assets/images'));
}
const openItemHyperlink = (itemID: number) => {
    window.electronAPI.openUrlExternal(props.items[itemID].hyperlink)
}


/******************** 拖动title ,author, tag滚动条 ********************/
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


/******************** 右键菜单 ********************/
const isVisibleCtmItem = ref(false)
const contextMenuOptions = {
    zIndex: 3,
    minWidth: 300,
    x: 500,
    y: 200
}
const openCtm = (e: MouseEvent) => {
    contextMenuOptions.x = e.x
    contextMenuOptions.y = e.y
    isVisibleCtmItem.value = true
}
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
    padding: 10px;
    overflow-y: auto;
    justify-content: space-around;
    grid-gap: 20px;
    column-gap: 20px;
}

#Items::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
}

#Items::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #cfcfcf;
}

.item-wrapper {
    position: relative;
    cursor: pointer;
}

.item-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    z-index: 1;
}

.item__img-wrapper {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
}

.item__img-wrapper img {
    max-width: 100%;
    max-height: 100%;
}

/* thumbnail */
.items--thumbnail {
    grid-template-columns: repeat(auto-fill, 220px);
}

.items--thumbnail .item__img-wrapper {
    width: 100%;
    height: 180px;
}

.items--thumbnail .item__infoItem {
    padding: 2px 0;
    text-align: center;
    white-space: nowrap;
    overflow-x: auto;
}

/* extended */
.items--extended {
    grid-template-columns: repeat(auto-fill, minmax(100px, 610px));
}

.items--extended .item-inner {
    display: flex;
    padding: 0 5px;
    justify-content: left;
}

.items--extended .item__img-wrapper {
    width: 200px;
    height: 180px;
}

.items--extended .item__infoItem {
    display: flex;
    padding: 2px 0;
    flex-wrap: wrap;
    text-align: left;
}

.items--extended .item__infoList {
    flex: 1;
    margin-left: 20px;
}

.items--extended .item__title {
    font-size: 18px;
}

.items--thumbnail .tc {
    display: none;
}

.items--extended .tc {
    display: block;
    margin-right: 0 4px;
    font-size: 13px;
}

.items--extended .item__tag {
    margin: 2px 4px
}

.item__open {
    display: none;
    width: 100%;
    justify-content: center;
    position: absolute;
    bottom: 0;
}

.item-inner:hover .item__open {
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

.item__infoItem::-webkit-scrollbar {
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