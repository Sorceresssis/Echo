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
            <span :title="'相似'"
                  class="iconfont no-drag">&#xe67c;</span>
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
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, inject, watch, readonly } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { $t } from '@/locale'
import { openInBrowser, openInExplorer, internetSearch } from '@/util/systemUtil'

const activeLibrary = readonly(inject<Ref<number>>('activeLibrary')!)
const record = readonly(inject<VO.RecordDetail>('record')!)

const router = useRouter()
const route = useRoute()

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

watch(route, async () => {
    // TODO 变化 ，刷新reacrd detail console.log(route.fullPath);

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
</style>