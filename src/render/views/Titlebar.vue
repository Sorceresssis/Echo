<template>
    <div class="titlebar flex-row">
        <div>
            <span :title="$t('titlebar.back')"
                  class="iconfont no-drag"
                  :class="[canGoBack ? '' : 'disabled']"
                  @click="router.go(-1)">&#xe66d;</span>
            <span :title="$t('titlebar.forward')"
                  class="iconfont no-drag"
                  :class="[canGoForward ? '' : 'disabled']"
                  @click="router.go(1)">&#xe66c;</span>
        </div>
        <div class="titlebar__title flex-1 min-width-0 textover--ellopsis">
            <span>
                {{ activeLibrary.name }}
            </span>
        </div>
        <div class="flex">
            <span :title="$t('titlebar.setting')"
                  class="iconfont no-drag"
                  @click="router.push('/setting')">&#xe657;</span>
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
import { onMounted, ref, Ref, inject, watch } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '../locales'

const router = useRouter()

const isMaxmize = ref<boolean>();
const windowMinmize = () => window.electronAPI.windowMinmize()
const windowMaxmize = () => window.electronAPI.windowMaxmize()
const windowClose = () => window.electronAPI.windowClose()


const activeLibrary = inject<Ref<library>>('activeLibrary') as Ref<library>

const canGoBack = ref<boolean>(false)
const canGoForward = ref<boolean>(false)
watch(router.currentRoute, () => {
    /* 监听路由变化，判断是否可以继续进行前进和后退来提示用户 */
    const position: number = window.history.state.position
    const length: number = window.history.length
    canGoBack.value = position !== 0   // 当前href的位置是第一个
    canGoForward.value = position !== length - 1   // 当前href的位置是最后一个

    /* 根据路由修改标题 */
    const currentPath: string = router.currentRoute.value.fullPath
    if (currentPath.startsWith('/library')) {
        document.title = `${activeLibrary.value.name} - Echo`
    }
    else {
        activeLibrary.value = { id: 0, name: '' }  // 重置当前激活的库
        if (currentPath.startsWith('/setting')) {
            document.title = `${t('settings.settings')} - Echo`
        } else {
            document.title = `Echo`
        }
    }
})

onMounted(async () => {
    // 监听窗口最大化
    window.electronAPI.windowIsMaxmize((e: any, value: boolean) => isMaxmize.value = value)
    console.log(await window.electronAPI.getLibraryNameByID(1));

})
</script>

<style scoped>
.titlebar {
    margin-right: 10px;
    font-size: 13px;
    color: #333333;
}

.disabled {
    color: #b9b9b9;
}

.titlebar__title {
    text-align: center;
    padding: 0 10px;
}

span,
i {
    padding: 5px 10px;
}

span:not(.disabled):hover {
    color: var(--echo-theme-color);
}
</style>