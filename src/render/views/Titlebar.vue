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
                @click="router.push(hrefGenerator.settings())">&#xe657;</span>
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

<script setup
    lang='ts'>
    import { Ref, ref, inject, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import hrefGenerator from '@/router/hrefGenerator'
    import { $t } from '@/locale'
    import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'

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

    const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()

    let lastAuthorId = 0

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
        if (route.params.libraryId !== void 0) {
            const libraryId = Number.parseInt(route.params.libraryId as string)
            // 如果切换了库，那么就需要重置一些组件的状态，如果是进入设置页面(activeLibrary == 0)，那么就不需要重置

            // lib改变，刷新lib路由下的所有页面
            if (activeLibrary.value !== libraryId) {
                viewsTaskAfterRoutingStore.setAllViews('init')
                activeLibrary.value = libraryId
                // 很重要，否则切换库后，作者页会显示上一个库的作者
                lastAuthorId = 0
            }

            // 在同一个lib下切换作者，刷新页面
            const authorId = route.params.authorId ? Number.parseInt(route.params.authorId as string) : void 0
            if ((authorId && authorId !== lastAuthorId)) {
                viewsTaskAfterRoutingStore.setAuthorRecords('init')
                lastAuthorId = authorId
            }

            window.electronAPI.queryLibraryDetail(libraryId).then(libDetail => {
                if (libDetail !== void 0) {
                    document.title = `${titleBarTitle.value = libDetail.name} - Echo`
                    Object.assign(activeLibraryDetail, libDetail)
                } else {
                    router.push(hrefGenerator.welcome()) // 数据库查不到这个库，跳转到欢迎页
                }
            }).catch(() => {
                router.push(hrefGenerator.welcome())
            })
        } else {
            activeLibrary.value = 0
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