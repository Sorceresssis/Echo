<template>
    <div id="itemsAuthor">
        <div id="authors">
            <ul>
                <li v-for="(author) in authors"
                    :key="author.id">
                    <div class="author">
                        <div class="authorInfo">
                            <div class="profile">
                                <img class="coverImage"
                                     :src="author.profile"
                                     @error="($event.target as HTMLImageElement).src = '../assets/images/profile.png'">
                            </div>
                            <div class="authorText">
                                <div class="authorName">{{ author.name }}</div>
                                <div style="font-size: 12px; margin: 4px  0;">数据量</div>
                                <div class="authorIntro">{{ author.intro }}</div>
                            </div>
                        </div>
                        <div class="authorWorks">
                            <div class="worksItem">
                                <img class="coverImage"
                                     src="../assets/images/2.jpg"
                                     alt="gf">
                            </div>
                            <div class="worksItem">
                                <img class="coverImage"
                                     src="../assets/images/1.jpg"
                                     alt="gf">
                            </div>
                            <div class="worksItem">
                                <img class="coverImage"
                                     src=""
                                     alt="gf">
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <Items :active-library="activeLibrary"></Items>
    </div>
</template>
  
<script lang="ts" setup>
import Items from './Items.vue'

const props = defineProps<{
    activeLibrary: library
}>()



interface author {
    id: number,
    name: string,
    intro: string,
    profile: string,
    coverImage: string[]
}
let authors: author[] = [
    { id: 1, name: "吉号f复合肥呵呵呵呵fd好fdf好fdfdf", intro: "fdf丰富的地方反对啊啊啊啊啊反对法地方反对啊啊啊反对法地方反对法反对", profile: "../assets/images/1.jpg", coverImage: ["../assets/images/1.jpg"] },
    { id: 1, name: "她她她", intro: "hfnvoojeohjf8909", profile: "../assets/images/4.jpg", coverImage: [] },
    { id: 3, name: "obhoio", intro: "fdffjl", profile: "../assets/images/1.jpg", coverImage: [] },
    { id: 5, name: "吉号好好", intro: "fdf丰富的地方反对法反对", profile: "../assets/images/1.jpg", coverImage: ["../assets/images/1.jpg"] },
    { id: 6, name: "她她她", intro: "hfnvoojeohjf8909", profile: "../assets/images/1.jpg", coverImage: [] },
    { id: 7, name: "obhoio", intro: "fdffjl", profile: "../assets/images/1.jpg", coverImage: [] },
    { id: 8, name: "吉号好好", intro: "fdf丰富的地方反对法反对", profile: "../assets/images/1.jpg", coverImage: ["../assets/images/1.jpg"] },
    { id: 9, name: "她她她", intro: "hfnvoojeohjf8909", profile: "../assets/images/1.jpg", coverImage: [] },
    { id: 10, name: "obhoio", intro: "fdffjl", profile: "../assets/images/1.jpg", coverImage: [] }
]

</script>

<style scoped>
#itemsAuthor {
    flex: 1;
    overflow: hidden;
    display: flex;
}

#authors {
    width: 300px;
    overflow-y: auto;
}

#authors::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
}

#authors::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: #cfcfcf;
}

.author {
    padding: 10px 0;
    border-bottom: 1px solid #d6dee5;
}

li:nth-child(1) .author {
    border-top: 1px solid #d6dee5;
}

.author:hover {
    background-color: #ededed;
}

.authorInfo {
    height: 86px;
    display: flex;
    justify-content: left;
    align-items: start;
    padding: 5px 10px;
    overflow: hidden;
}

.profile {
    width: 86px;
    height: 86px;
    flex-shrink: 0;
}

.profile>img {
    border-radius: 43px;
}

.authorText {
    width: 187px;
    margin-left: 10px;
    overflow: hidden;
}

.authorName {
    height: 20px;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fd9e16;
}

.authorIntro {
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.authorWorks {
    display: flex;
    height: 110px;
    margin: 5px 10px;
}

.worksItem {
    width: 88px;
    margin: 2px;
}

.coverImage {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>