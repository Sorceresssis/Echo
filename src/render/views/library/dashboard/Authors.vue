<template>
    <div class="flex-col">
        <div class="dashboard__header">
            <div class="right-menu">
                <echo-autocomplete v-model="search"
                                   class="menu-item search"
                                   type="author"
                                   :placeholder="'搜索'"
                                   @keyup.enter="" />
                <dash-drop-menu v-for="menu in dropdownMenus"
                                class="menu-item"
                                :menu="menu" />
            </div>
        </div>
        <scrollbar class="dashboard__content scrollbar-y-w8"
                   :reset-listener="scrollbarListenerSource">
            <ul class="author-recommendations">
                <li v-for="recmd in authorRecmds"
                    :key="recmd.id"
                    class="author-recommendation-item divider">
                    <local-image :src="'F:\\Desktop\\images\\息屏.png'"
                                 class="author-icon"
                                 @click="router.push(`/library/${activeLibrary}/author?id=${1}`)" />
                    <div class="author-text">
                        <h1 @click="router.push(`/library/${activeLibrary}/author?id=${1}`)">ASK</h1>
                        <p class="meta">
                            <span class="inline-list-title">作品数</span>
                            <a class="count">109</a>
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
        </scrollbar>
        <el-pagination v-model:current-page="currentPage"
                       class="dashboard__footer"
                       background
                       small
                       :page-size="pageSize"
                       layout="prev, pager, next, jumper, total"
                       :total="total" />
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, onMounted, inject, onActivated, onDeactivated, nextTick, watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { $t } from '@/locales/index'
import useAuthorsDashStore from '@/store/authorsDashStore'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import DashDropMenu from '@/components/DashDropMenu.vue'
import Scrollbar from '@/components/Scrollbar.vue'
import LocalImage from '@/components/LocalImage.vue'

const router = useRouter()
const pageSize = 20

const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>
const authorsDashStore = useAuthorsDashStore()
const dropdownMenus = [{
    HTMLElementTitle: $t('mainContainer.sort'),
    title: '&#xe81f;',
    items: [
        {
            title: $t('mainContainer.time'),
            divided: false,
            click: () => authorsDashStore.handleSortField('time'),
            dot: () => authorsDashStore.sortField === 'time'
        },
        {
            title: '名字',
            divided: false,
            click: () => authorsDashStore.handleSortField('name'),
            dot: () => authorsDashStore.sortField === 'name'
        },
        {
            title: '升序',
            divided: true,
            click: () => authorsDashStore.handleOrder('ASC'),
            dot: () => authorsDashStore.order === 'ASC'
        },
        {
            title: '降序',
            divided: false,
            click: () => authorsDashStore.handleOrder('DESC'),
            dot: () => authorsDashStore.order === 'DESC'
        },
    ]
}]

// 监听源
const scrollbarListenerSource = ref<boolean>(true)
watch(() => activeLibrary.value, () => {
    scrollbarListenerSource.value = !scrollbarListenerSource.value
})

const search = ref<string>('')
const currentPage = ref<number>(1)
const total = ref<number>(0)
// VO.AuthorRecommendation
const authorRecmds = ref<any[]>([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
    { id: 13 },
    { id: 14 },
    { id: 15 },
    { id: 16 },
    { id: 17 },
    { id: 18 },
    { id: 19 },
    { id: 20 }
])


watch(() => currentPage.value, () => {
    scrollbarListenerSource.value = !scrollbarListenerSource.value
})

const queryAuthorRecmds = () => {
    // const options = {
    //     queryWork: search.value,
    //     sortField: authorsDashStore.sortField,
    //     order: authorsDashStore.order,
    //     pn: currentPage.value,
    //     ps: pageSize
    // }
    // authorRecmds.value = await authorService.queryAuthorRecommendations(options)
}
onMounted(() => {
    total.value = 100
    queryAuthorRecmds()
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
    width: var(--author-recommend-item-height);
    height: var(--author-recommend-item-height);
    border-radius: 50%;
    cursor: pointer;
    object-fit: cover;
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
    cursor: pointer;
}

.author-recommendation-item .meta {
    margin: 4px 0;
}

.author-recommendation-item .count {
    color: var(--echo-emphasis-color);
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