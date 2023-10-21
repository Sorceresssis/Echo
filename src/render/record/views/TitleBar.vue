<template>
    <div class="titlebar flex-row">
        <div>
            <span :title="'搜索标题'"
                  class="iconfont no-drag"
                  @click="searchTitle">&#xe8ba;</span>
            <span :title="'浏览器中打开链接'"
                  class="iconfont no-drag"
                  :class="record.hyperlink ? '' : 'disabled'"
                  @click="openInBrowser(record.hyperlink)">&#xe612;</span>
            <span :title="'在资源管理器中打开'"
                  class="iconfont no-drag"
                  :class="record.resourcePath ? '' : 'disabled'"
                  @click="openInExplorer(record.resourcePath)">&#xe73e;</span>
            <span :title="'相似推荐'"
                  class="iconfont no-drag"
                  @click="openSimilarDrawer">&#xe620;</span>
            <span :title="'全部信息'"
                  class="iconfont no-drag"
                  :class="[route.fullPath === '/' ? 'active' : '']"
                  @click="router.push('/')">&#xe6c9;</span>
            <span :title="'编辑'"
                  class="iconfont no-drag"
                  :class="[route.fullPath.startsWith('/manage') ? 'active' : '']"
                  @click="router.push(`/manage?record_id=${record.id}`)">&#xe722;</span>
        </div>
        <div class="titlebar__title flex-1 min-width-0 textover--ellopsis">
            <span> {{ record.title }} </span>
        </div>
        <div class="flex">
            <span :title="$t('titlebar.minimize')"
                  class="iconfont no-drag"
                  @click="windowMinmize">&#xe67a;</span>
            <span v-if="isMaxmize"
                  :title="$t('titlebar.restore')"
                  class="iconfont no-drag"
                  @click="windowMaxmize">&#xe607;</span>
            <span v-else
                  :title="$t('titlebar.maximize')"
                  class="iconfont no-drag"
                  @click="windowMaxmize">&#xe606;</span>
            <span :title="$t('titlebar.close')"
                  class="iconfont no-drag"
                  @click="windowClose">&#xe685;</span>
        </div>
        <el-drawer v-model="similarDrawerVisible"
                   direction="btt"
                   size="380px"
                   class="similar-record-drawer">
            <template #header="{ close, titleId, titleClass }">
                <h4 :id="titleId"
                    :class="titleClass"> {{ '相似推荐' }} </h4>
            </template>
            <div v-if="similarRecords.length"
                 v-loading.lock="similarLoading"
                 class="record-recommendations thumbnail-records scrollbar-x-h8"
                 style="display: flex; flex: 1; padding-bottom: 20xp;"
                 @mousedown="startScroll">
                <record-card v-for="recmd in similarRecords"
                             :key="recmd.id"
                             :recmd="recmd"
                             :selected="false"
                             :can-push-to-author-page="false">
                </record-card>
            </div>
            <empty v-else-if="!similarLoading"
                   :title="'暂无相似推荐'" />
        </el-drawer>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, inject, watch, readonly, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { $t } from '@/locale'
import { openInBrowser, openInExplorer, internetSearch } from '@/util/systemUtil'
import { useDragScroll } from '@/util/common'
import RecordCard from '@/components/RecordCard.vue'
import Empty from '@/components/Empty.vue'

const router = useRouter()
const route = useRoute()
const { startScroll } = useDragScroll()

const activeLibrary = readonly(inject<Ref<number>>('activeLibrary')!)
const record = readonly(inject<VO.RecordDetail>('record')!)

const isMaxmize = ref<boolean>()
window.electronAPI.windowIsMaxmize((e: any, value: boolean) => isMaxmize.value = value)
const windowMinmize = () => window.electronAPI.windowMinmize()
const windowMaxmize = () => window.electronAPI.windowMaxmize()
const windowClose = () => window.electronAPI.windowClose()

const searchTitle = function () {
    window.electronAPI.queryLibraryDetail(activeLibrary.value).then(libDetail => {
        if (!libDetail) return
        const t = record.title + (libDetail.useAuxiliarySt ? `  ${libDetail.auxiliarySt}` : '')
        internetSearch(t)
    })
}

// 展示相似的record的抽屉
const similarDrawerVisible = ref(false)
const similarRecords = ref<VO.RecordRecommendation[]>([])
const similarLoading = ref(false)
const openSimilarDrawer = (function () {
    let queryed = false
    return () => {
        similarDrawerVisible.value = true

        if (queryed) return

        similarLoading.value = true
        window.electronAPI.querySimilarRecordRecmds(activeLibrary.value, record.id, 8).then(recmds => {
            similarRecords.value = recmds
            queryed = true
            similarLoading.value = false
        })
    }
})()

watch(route, async () => {
    // TODO 变化 ，刷新reacrd detail console.log(route.fullPath); 
    // TODO 右键菜单
    document.title = `${record.title}`
})
</script>

<style scoped>
.titlebar {
    padding: 0 10px;
}

.no-drag {
    padding: 5px 10px;
    cursor: pointer;
}

.active {
    color: var(--echo-theme-color);
}

span:not(.disabled):hover {
    color: var(--echo-theme-color);
}


.demonstration {
    color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>