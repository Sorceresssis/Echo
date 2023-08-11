<template>
    <div class="flex-col">
        <div class="dashboard__header">
            <div class="right-menu">
                <echo-autocomplete v-model="search"
                                   type="author"
                                   :placeholder="'搜索'" />
            </div>
        </div>
        <div class="dashboard__content scrollbar-y-w8">
            <ul class="author-recommendations">
                <li v-for="i in 20"
                    class="author-recommendation-item divider">
                    <img src="file://F:\Desktop\images\息屏.png"
                         class="author-icon fit--cover">
                    <div class="author-text">
                        <h1>ASK</h1>
                        <p class="meta inline-list">
                            <span>作品数</span>
                            <a>109</a>
                        </p>
                        <p class="caption">不允许二次加工，转载请标明出处
                            私信不常看非常抱歉
                            工作相关请邮件askzy94...</p>
                    </div>
                    <ul class="works">
                        <li>
                            <img src="file://F:\Desktop\images\5.png"
                                 class="fit--cover">
                        </li>
                        <li> <img src="file://F:\Desktop\images\43.jpg"
                                 class="fit--cover"> </li>
                        <li> <img src="file://F:\Desktop\images\4.jpg"
                                 class="fit--cover"> </li>
                        <li> <img src="file://F:\Desktop\images\1.png"
                                 class="fit--cover"> </li>
                    </ul>
                </li>
            </ul>
        </div>
        <el-pagination v-model:current-page="currentPage"
                       class="dashboard__footer"
                       background
                       small
                       :page-size="20"
                       layout="prev, pager, next, jumper"
                       :total="200"
                       @current-change="" />
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { $t } from '@locales/index'
import EchoAutocomplete from '@components/EchoAutocomplete.vue'

const search = ref<string>('')
const currentPage = ref<number>(1)
const handleCurrentChange = (page: number) => {
    currentPage.value = page
}
onMounted(() => {
    const data = {
        total: 100,
        currPage: 1,
        pageSize: 20,
        list: [
            {
                id: 1,
                name: 'ASK',
                works: [
                    'file://F:/Desktop/images/5.png',
                    'file://F:/Desktop/images/43.jpg',
                    'file://F:/Desktop/images/4.jpg',
                    'file://F:/Desktop/images/1.png'
                ]
            },
        ]
    }
})
</script>

<style>
.author-recommendations {
    padding: 10px 0;
    border-radius: 5px;
    box-shadow:
        0px 0px 0.3px rgba(0, 0, 0, 0.033),
        0px 0px 1.1px rgba(0, 0, 0, 0.044),
        0px 0px 5px rgba(0, 0, 0, 0.07);
    background-color: #fafafa;
}

.author-recommendation-item {
    --author-recommend-item-height: 110px;
    display: flex;
    height: var(--author-recommend-item-height);
    padding: 15px;
    font-size: 13px;
}

.author-recommendation-item:hover {
    background-color: #f0f0f0;
}

.author-icon {
    display: inline-block;
    width: var(--author-recommend-item-height);
    height: var(--author-recommend-item-height);
    vertical-align: middle;
    background-repeat: no-repeat;
    background-position: top;
    background-size: cover;
    background-color: #fff;
    border-radius: 50%;
    cursor: pointer;
}

.author-text {
    min-width: 0;
    flex: 1;
    margin-left: 10px;
}

.author-recommendation-item h1 {
    font-size: 16px;
    font-weight: bold;
    min-width: 0;
    color: #258fb8;
}

.author-recommendation-item .meta {
    margin: 4px 0;
}

.inline-list span:after {
    content: ":";
    margin: 0 5px 0 2px;
    color: #ccc;
}

.author-recommendation-item .caption {
    display: -webkit-box;
    margin: 6px 0;
    overflow: hidden;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
}

.author-recommendation-item .works {
    display: flex;
    align-items: center;
    width: 400px;
    margin-left: 8px;
}

.author-recommendation-item .works>li {
    position: relative;
    width: calc(var(--author-recommend-item-height) - 10px);
    height: calc(var(--author-recommend-item-height) - 10px);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .05);
}
</style>