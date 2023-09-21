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
				{{ titleBarTitle }}
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
import { useRoute, useRouter } from 'vue-router'
import { $t } from '@/locales'

const router = useRouter()
const route = useRoute()

const isMaxmize = ref<boolean>();
const windowMinmize = () => window.electronAPI.windowMinmize()
const windowMaxmize = () => window.electronAPI.windowMaxmize()
const windowClose = () => window.electronAPI.windowClose()


const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>
const activeLibraryDetail = inject<VO.LibraryDetail>('activeLibraryDetail') as VO.LibraryDetail
const titleBarTitle = ref<string>('')

const canGoBack = ref<boolean>(false)
const canGoForward = ref<boolean>(false)
watch(route, async () => {
	/* 监听路由变化，判断是否可以继续进行前进和后退来提示用户 */
	const position: number = window.history.state.position
	const length: number = window.history.length
	canGoBack.value = position !== 0   // 当前href的位置是第一个
	canGoForward.value = position !== length - 1   // 当前href的位置是最后一个

	/* 根据路由修改标题 */
	const currentPath: string = route.fullPath
	if (currentPath.startsWith('/library')) {
		const libraryID: number = Number.parseInt(currentPath.match(/\/library\/(\d+)/)![1]) // 获取libraryId
		if (libraryID === activeLibrary.value) return

		activeLibrary.value = libraryID
		const libDetail = (await window.electronAPI.queryLibraryDetail(activeLibrary.value)) // 根据libraryID获取library的名字
		Object.assign(activeLibraryDetail, libDetail)
		libDetail ? document.title = `${titleBarTitle.value = libDetail.name} - Echo` : router.push('/') // 如果打开的库已不存在，跳转到欢迎页
	}
	else {
		activeLibrary.value = 0
		if (currentPath.startsWith('/setting')) {
			titleBarTitle.value = $t('settings.settings')
			document.title = `${titleBarTitle.value} - Echo`
		} else {
			titleBarTitle.value = ''
			document.title = 'Echo'
		}
	}
})

onMounted(async () => {
	// 监听窗口最大化
	window.electronAPI.windowIsMaxmize((e: any, value: boolean) => isMaxmize.value = value)
})
</script>

<style scoped>
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