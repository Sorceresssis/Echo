<template>
    <div class="titlebar flex-row">
        <div>
            <span :title="$t('titlebar.back')"
                  class="iconfont no-drag"
                  :class="[routerCanBack ? '' : 'disabled']"
                  @click="routerCanBack && router.back()">&#xe66d;</span>
            <span :title="$t('titlebar.forward')"
                  class="iconfont no-drag"
                  :class="[routerCanForward ? '' : 'disabled']"
                  @click="routerCanForward && router.forward()">&#xe66c;</span>
        </div>
        <div class="titlebar__title flex-1 textover--ellopsis"> {{ titleBarTitle }} </div>
        <div class="flex">
            <span :title="$t('titlebar.setting')"
                  class="iconfont no-drag"
                  @click="router.push(hrefGenerator.settings())">&#xe657;</span>
            <i>|</i>
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
import { Ref, ref, inject, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import hrefGenerator from '@/router/hrefGenerator'
import { $t } from '@/locale'

const router = useRouter()
const route = useRoute()

const isMaxmize = ref<boolean>(false);
window.electronAPI.windowIsMaxmize((e: any, value: boolean) => isMaxmize.value = value)
const windowMinmize = () => window.electronAPI.windowMinmize()
const windowMaxmize = () => window.electronAPI.windowMaxmize()
const windowClose = () => window.electronAPI.windowClose()

const titleBarTitle = ref<string>('')

const routerCanBack = ref<boolean>(false)
const routerCanForward = ref<boolean>(false)

const activeLibrary = inject<Ref<number>>('activeLibrary')!
const activeLibraryDetail = inject<VO.LibraryDetail>('activeLibraryDetail')!

watch(route, async () => {
    /**
     * 读取路由的位置,判断是否可以继续进行前进或者后退.
     */
    const position: number = window.history.state.position
    const length: number = window.history.length
    routerCanBack.value = position !== 0   // 当前href的位置是第一个
    routerCanForward.value = position !== length - 1   // 当前href的位置是最后一个

    /**
     * 如果路由参数中有libraryId,那么就是打开了一个库，需要修改标题为库名, 并且激活这个库.
     * 让其他组件可以读取到这个库的信息.
     */
    const libraryId = route.params.libraryId as string | undefined
    if (libraryId !== void 0) {
        const libDetail = (await window.electronAPI.queryLibraryDetail(Number.parseInt(libraryId)))
        if (libDetail !== void 0) {
            document.title = `${titleBarTitle.value = libDetail.name} - Echo`
            activeLibrary.value = libDetail.id // 激活这个库
            Object.assign(activeLibraryDetail, libDetail)
        } else {
            router.push(hrefGenerator.welcome()) // 数据库查不到这个库，跳转到欢迎页
        }
    } else {
        activeLibrary.value = 0
        const fullPath: string = route.fullPath
        if (fullPath.startsWith('/settings')) {
            titleBarTitle.value = $t('settings.settings')
            document.title = `${titleBarTitle.value} - Echo`
        } else if (fullPath.startsWith('/')) {
            titleBarTitle.value = ''
            document.title = 'Echo'
        }
    }
})
</script>

<style scoped>
.titlebar__title {
    text-align: center;
    padding: 0 20px;
}

span,
i {
    padding: 5px 10px;
}

span:not(.disabled):hover {
    color: var(--echo-theme-color);
}
</style>