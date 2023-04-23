<template>
    <div id="item">
        <div class="siderBar">
            <div id="itemInfo"
                 class="menuItem">
                <div class="menuTitle">信息</div>
                <div class="menuContent">
                    <div class="item__img"
                         style="display: flex; height: 200px; justify-content: center;">
                        <img style="max-width: 100%; max-height: 100%;"
                             src="../../assets/images/2.jpg"
                             alt="">
                    </div>
                    <div class="item__title">

                    </div>
                    <div class="item__tags"
                         style="display:  flex;">
                        <div>
                            tag:
                        </div>
                        <div style="display: flex; flex; flex-wrap: wrap;">
                            <span v-for="tag in itemInfo.tags"
                                  style="margin:0 5px">{{ tag }}</span>
                        </div>
                    </div>
                    <div>

                    </div>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                    <p>43434</p>
                </div>
            </div>
            <div id="seriesList"
                 class="menuItem">
                <div class="menuTitle">系列</div>
                <div class="menuContent">
                    <div v-for="series in seriesList"
                         class="series"
                         :key="series.id">
                        <div class="seriesName">
                            {{ series.title }}
                        </div>
                        <div>
                            <div v-for="item in series.items"
                                 :key="item.id"
                                 class="item">
                                {{ item.title }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ItemFolderDisplay></ItemFolderDisplay>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import ItemFolderDisplay from '../components/ItemFolderDisplay.vue'

type itemInfo = {
    id: number,
    title: string,
    tags: string[],
    date: string
}
const itemInfo = ref<itemInfo>({
    id: 1,
    title: 'fdfdfdfdfdfdfdff',
    tags: ['fdfdf', 'afagghg', 'fdf', 'fdfd', 'hhhsd', 'fagga', 'fd', 'fdfa', 'fafefe', 'fefef'],
    date: 'fd'
})



type item = {
    id: number,
    title: string
}
type series = {
    id: number,
    title: string,
    items: item[]
}
const seriesList = ref<series[]>([{
    id: 1,
    title: 'series1',
    items: [{
        id: 1,
        title: 'item1'
    }, {
        id: 2,
        title: 'item2'
    }]
}, {
    id: 2,
    title: 'series2',
    items: [{
        id: 1,
        title: 'item1'
    }, {
        id: 2,
        title: 'item2'
    }]
}, {
    id: 3,
    title: 'series3',
    items: [{
        id: 1,
        title: 'item1'
    }, {
        id: 2,
        title: 'item2'
    }]
}, {
    id: 4,
    title: 'series4',
    items: [{
        id: 1,
        title: 'item1'
    }, {
        id: 2,
        title: 'item2'
    }]
}, {
    id: 5,
    title: 'series5',
    items: [{
        id: 1,
        title: 'item1'
    }, {
        id: 2,
        title: 'item2'
    }]
}])
</script>

<style scoped>
#item {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.siderBar {
    display: flex;
    flex-direction: column;
    width: 300px;
}

.menuItem {
    overflow: hidden;
    /* 抵消menuTitle的高度 */
    padding-bottom: 32px;
}

.menuItem:nth-child(1) {
    padding-bottom: 0;
}

.menuTitle {
    height: 30px;
    line-height: 30px;
    padding: 0 5px;
    box-shadow: 0 0 3px 2px #e8e8e8;
    border-top: 1px solid #d7d7d7;
}


.menuContent {
    height: 100%;
    padding: 0 10px;
    overflow-y: scroll;
}

.menuContent::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
}

.menuContent::-webkit-scrollbar-thumb {
    background-color: #cfcfcf;
}

#itemInfo {
    flex: 1;
}

#itemInfo .menuContent>div {
    margin: 5px 0
}

#seriesList {
    height: 180px;
}

.fdf {
    border-top: 1px solid #d7d7d7;
}
</style>