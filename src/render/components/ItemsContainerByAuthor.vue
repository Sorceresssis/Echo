<template>
    <div>
        <div id="authorsList">
            <ul>
                <li>
                    <div class="author">
                        <div class="author__name"></div>
                    </div>
                </li>
                <li v-for="(author ) in authors"
                    :key="author.id">
                    <div class="author">
                        <div class="author__profile">
                            <div class="author__avatar">
                                <img class="image--cover"
                                     :src="author.profile"
                                     @error="($event.target as HTMLImageElement).src = '../assets/images/profile.png'">
                            </div>
                            <div class="author__info">
                                <div class="author__name">{{ author.name }}</div>
                                <div style="font-size: 12px; margin: 4px  0;">数据量</div>
                                <div class="author__intro">{{ author.intro }}</div>
                            </div>
                        </div>
                        <div class="author__works">
                            <div v-for="(work) in author.works"
                                 class="author__work">
                                <img class="image--cover"
                                     src="../assets/images/2.jpg"
                                     @error="($event.target as HTMLImageElement).src = '../assets/images/nodata.png'">
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <Items :items="items"
               v-loading="isVisibleLoading"></Items>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, watch, inject, onMounted } from 'vue'
import Items from './Items.vue'
import { debounce } from '../util/debounce'

const activeLibrary = inject<Ref<library>>('activeLibrary') as Ref<library>
const items = ref<itemProfile[]>([])


// 第一次启动，更新activeLibrary

onMounted(async () => {
})
items.value = await window.electronAPI.getItems(activeLibrary.value.id)

type author = {
    id: number,
    name: string,
    intro: string,
    profile: string,
    works: string[],
}

const isVisibleLoading = ref<boolean>(false)
const authors = ref<author[]>([
    { id: 1, name: "吉号f复", intro: "fdf丰富的地方反对", profile: "../assets/images/2.jpg", works: ["../assets/images/2.jpg", "../assets/images/2.jpg", "../assets/images/屏幕截图 2022-11-08 192954.png"] },
    { id: 1, name: "她她她", intro: "hfnvoojeohjf8909", profile: "../assets/images/4.jpg", works: [] },
    { id: 3, name: "obhoio", intro: "fdffjl", profile: "../assets/images/2.jpg", works: [] },
    { id: 5, name: "吉号好好", intro: "fdf丰富的地方反对法反对", profile: "../assets/images/2.jpg", works: ["../assets/images/2.jpg"] },
    { id: 6, name: "她她她", intro: "hfnvoojeohjf8909", profile: "../assets/images/2.jpg", works: [] },
    { id: 7, name: "obhoio", intro: "fdffjl", profile: "../assets/images/2.jpg", works: [] },
    { id: 8, name: "吉号好好", intro: "fdf丰富的地方反对法反对", profile: "../assets/images/2.jpg", works: ["../assets/images/2.jpg"] },
    { id: 9, name: "她她她", intro: "hfnvoojeohjf8909", profile: "../assets/images/2.jpg", works: [] },
    { id: 10, name: "obhoio", intro: "fdffjl", profile: "../assets/images/2.jpg", works: [] }
])
watch([activeLibrary], debounce(async (newValue) => {
    isVisibleLoading.value = true
    items.value = await window.electronAPI.getItems(newValue[0].id);
    isVisibleLoading.value = false
}, 200), {
    deep: true
})





</script>

<style scoped>
#authorsList {
    overflow-y: auto;
    padding: 5px;
}

#authorsList::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
}

#authorsList::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #cfcfcf;
}

.author {
    width: 267px;
    padding: 15px 10px;
    margin-bottom: 10px;
    background-color: #fff;
    box-shadow: 0 0 3px 2px #e8e7ea;
}

.author:hover {
    background-color: #ececec;
}

.author__profile {
    height: 86px;
    display: flex;
    justify-content: left;
    align-items: start;
    margin-bottom: 10px;
    overflow: hidden;
}

.author__avatar {
    width: 86px;
    height: 86px;
    flex-shrink: 0;
}

.author__avatar>img {
    border-radius: 43px;
}

.author__info {
    width: 171px;
    margin-left: 10px;
    overflow: hidden;
}

.author__name {
    height: 20px;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fd9e16;
}

.author__intro {
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.author__works {
    display: flex;
    height: 110px;
}

.author__work {
    width: 85px;
    margin: 0 2px;
}

.image--cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>