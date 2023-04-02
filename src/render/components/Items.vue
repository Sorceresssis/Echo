<template>
    <div class="fullBox"
         v-loading="isVisibleLoading">
        <!-- 没有一个item -->
        <div v-if="items.length == 0"
             id="emptyLibrary"
             class="fullBox">
            该库还没有任何东西哦~
        </div>
        <!-- 有item -->
        <div v-else
             id="Items">
            <div v-for="(item, index) in items"
                 :key="item.id"
                 class="item">
                <!-- 屏障 -->
                <div>
                </div>
                <!-- 内容 -->
                <div>
                    <div class="img-wrapper">
                        <img :src="`../assets/images/${1}.jpg`"
                             alt=""
                             srcset=""
                             @error="($event.target as HTMLImageElement).src = '../assets/images/imageError.png'">

                    </div>
                    <div class="title">{{ item.title }}</div>
                    <div class="authors">
                        <span v-for="(author) in item.authors == null ? [] : item.authors.split(',')"
                              class="author">
                            {{ author }}
                        </span>
                    </div>
                    <div class="tags">
                        <span v-for="(tag) in item.tags == null ? [] : item.tags.split(',')"
                              class="tagItem">
                            {{ tag }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue'
import { debounce } from '../util/debounce'

const props = defineProps<{
    activeLibrary: library

}>()

const isVisibleLoading = ref<boolean>(false)
watch(() => [props.activeLibrary], debounce(async (newValue) => {
    // 改网页标题
    document.title = newValue[0].name == '' ? 'Echo' : newValue[0].name + " - Echo";
    isVisibleLoading.value = true
    items.value = await window.electronAPI.getItems(newValue[0].id);
    isVisibleLoading.value = false
}, 200))

// let a: string = (await window.electronAPI.getConfig()).userDataPath
// console.log(a.replaceAll("\\", "/") + `/image/${1}/coverImage/${1}.jpg`)
interface item {
    id: number
    title: string
    isFav: number
    hyperlink: string | null
    flieName: string | null
    folder_id: number
    tags: string | null
    authorsID: string | null
    authors: string | null
}

const items = ref<item[]>([])


</script>

<style scoped>
.fullBox {
    display: flex;
    width: 100%;
    height: 100%;
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
    /* height: 240px; */
    cursor: pointer;
    user-select: text;
}

.img-wrapper {
    display: flex;
    width: 100%;
    height: 180px;
    justify-content: center;
    align-items: center;
}

.img-wrapper img {
    max-width: 100%;
    max-height: 100%;
}

.title {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.authors {
    height: 20px;
    text-align: center;
    overflow-x: auto;
}

.author {
    margin: 0 4px;
}

.tags {
    height: 20px;
    text-align: center;
    overflow-x: auto;
}

.tags::-webkit-scrollbar {
    display: none;
}

.tagItem {
    margin: 0 8px;
    color: pink;
    border-radius: 4px;
}

.tagItem:hover {}
</style>