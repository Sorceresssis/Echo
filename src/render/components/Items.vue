<template>
    <div id="Items">
        <div v-for="(item, index) in items"
             :key="item.id"
             class="item">
            <!-- 屏障 -->
            <div>
            </div>
            <!-- 内容 -->
            <div>
                <div class="img-wrapper">
                    <img :src=item.coverImage
                         alt=""
                         srcset="">
                </div>
                <div class="title">{{ item.title }}</div>
                <div class="authors">
                    <span v-for="(author) in item.authors.split(',')"
                          class="author">
                        {{ author }}
                    </span>
                </div>
                <div class="tags">
                    <span v-for="(tag) in item.tags.split(',')"
                          class="tagItem">
                        {{ tag }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
const items = reactive([
    {
        id: 1,
        title: "致性别为蒙娜丽莎的你致性别为蒙娜丽莎的你致性别为蒙娜丽莎的你致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef,fdfdfd,fdfdfdf,fdfdfd,fdfdfsfs",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "",
        tags: "",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    },
    {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "",
        tags: "",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "",
        tags: "",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "",
        tags: "",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    }, {
        id: 1,
        title: "致性别为蒙娜丽莎的你",
        authors: "",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/1.jpg",
    },
    {
        id: 2,
        title: "致性别为蒙娜丽莎的你",
        authors: "tah,fdf",
        tags: "fdfdf,fefe,efef,feffefe,fefef",
        coverImage: "../assets/images/屏幕截图 2022-11-08 192954.png",
    },
])


</script>

<style scoped>
#Items {
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