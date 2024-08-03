<template>
    <div class="titlebar flex-row">
        <div>
            <span :title="$t('layout.back')"
                  class="iconfont no-drag"
                  :class="[routerCanBack ? '' : 'disabled']"
                  @click="routerCanBack && router.back()">&#xe66d;</span>
            <span :title="$t('layout.forward')"
                  class="iconfont no-drag"
                  :class="[routerCanForward ? '' : 'disabled']"
                  @click="routerCanForward && router.forward()">&#xe66c;</span>
        </div>
        <div class="titlebar__title flex-1 textover--ellopsis"> {{ titleBarTitle }} </div>
        <div class="flex">
            <span :title="$t('layout.settings')"
                  class="iconfont no-drag"
                  @click="router.push(RouterPathGenerator.settings())">&#xe657;</span>
            <span class="iconfont no-drag"
                  @click="windowMinmize">&#xe67a;</span>
            <span v-if="isMaxmize"
                  class="iconfont no-drag"
                  @click="windowMaxmize">&#xe607;</span>
            <span v-else
                  class="iconfont no-drag"
                  @click="windowMaxmize">&#xe606;</span>
            <span class="iconfont no-drag"
                  @click="windowClose">&#xe685;</span>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { Ref, ref, inject, watch } from 'vue'
import { $t } from '@/locale'
import { useRoute, useRouter } from 'vue-router'
import RouterPathGenerator from '@/router/router_path_generator';
import { VueInjectKey } from '@/constant/channel_key';
import IndexedDB from '@/util/indexed_db';
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
import useLibraryStore from '@/store/libraryStore'
import Message from '@/util/Message'

const isMaxmize = ref<boolean>(false);
window.electronAPI.windowIsMaxmize((e: any, value: boolean) => isMaxmize.value = value)
const windowMinmize = () => window.electronAPI.windowMinmize()
const windowMaxmize = () => window.electronAPI.windowMaxmize()
const windowClose = () => window.electronAPI.windowClose()

const router = useRouter()
const route = useRoute()

const activeLibrary = inject<Ref<number>>(VueInjectKey.ACTIVE_LIBRARY)!;
const activeLibraryDetail = inject<VO.LibraryDetail>(VueInjectKey.ACTIVE_LIBRARY_DETAIL)!;

const libraryStore = useLibraryStore()
const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()

const titleBarTitle = ref<string>('')
const routerCanBack = ref<boolean>(false)
const routerCanForward = ref<boolean>(false)

let lastAuthorId = 0

watch(route, () => {
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
    if (route.params.libraryId !== void 0) {
        const newlibraryId = Number.parseInt(route.params.libraryId as string)
        // 如果切换了库，那么就需要重置一些组件的状态，如果是进入设置页面(activeLibrary == 0)，那么就不需要重置

        // library
        if (activeLibrary.value !== newlibraryId) {
            viewsTaskAfterRoutingStore.setAllViews('init')
            // 很重要，否则切换库后，作者页会显示上一个库的作者
            lastAuthorId = 0

            // Roles 数据
            libraryStore.setLoadingLibrary(true)
            libraryStore.setLoadingRoles(true)
            libraryStore.setRoles([])
            window.dataAPI.getRoles(newlibraryId).then((res) => {
                if (res.code) {
                    libraryStore.setRoles(res.data!)
                } else {
                    Message.error(res.msg)
                }
            }).finally(() => {
                libraryStore.setLoadingLibrary(false)
                libraryStore.setLoadingRoles(false)
                activeLibrary.value = newlibraryId
            })

            // 加载库详情, 不需要加载完。
            window.dataAPI.queryLibraryDetail(newlibraryId).then(libDetail => {
                if (libDetail !== void 0) {
                    document.title = `${titleBarTitle.value = libDetail.name} - Echo`
                    Object.assign(activeLibraryDetail, libDetail)
                    return
                }
                router.push(RouterPathGenerator.welcome())
            }).catch(() => {
                router.push(RouterPathGenerator.welcome())
            })
        }

        // 在同一个lib下切换作者，刷新页面
        const authorId = route.params.authorId ? Number.parseInt(route.params.authorId as string) : void 0
        if ((authorId && authorId !== lastAuthorId)) {
            viewsTaskAfterRoutingStore.setAuthorRecords('init')
            lastAuthorId = authorId
        }
    } else {
        const fullPath: string = route.fullPath
        if (fullPath.startsWith('/settings')) {
            titleBarTitle.value = $t('layout.settings')
            document.title = `${titleBarTitle.value} - Echo`
        } else if (fullPath.startsWith('/')) {
            titleBarTitle.value = ''
            document.title = 'Echo'
        }
    }
})

const libraryDB = new IndexedDB('library')
libraryDB.open((db) => {
})
</script>

<style scoped>
.titlebar {
    padding-right: 10px;
}

.titlebar__title {
    text-align: center;
    padding: 0 20px;
}

.no-drag {
    padding: 5px 10px;
    cursor: pointer;
}

.no-drag:not(.disabled):hover {
    color: var(--echo-theme-color);
}

.active {
    color: var(--echo-theme-color);
}
</style>