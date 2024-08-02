<template>
	<div class="flex-col">
		<div class="dashboard__header">
			<div class="right-menu">
				<echo-autocomplete v-model="keyword"
								   type="author"
								   class="menu-item search"
								   :placeholder="$t('layout.search')"
								   @keyup.enter="handleQueryParamsChange" />
				<!-- TODO -->
				<!-- <dash-drop-menu v-if="roleDropdownMenu.items"
								class="menu-item"
								:menu="roleDropdownMenu"
								:loading="libraryStore.isLoadingRoles"
								@command="handleQueryParamsChange" /> -->
				<dash-drop-menu class="menu-item"
								:menu="sortDropdownMenu" />
			</div>
		</div>
		<scrollbar v-loading="loading"
				   ref="scrollbarRef"
				   class="dashboard__content scrollbar-y-w8">
			<empty v-if="authorRecmds.length === 0" />
			<ul v-else
				class="author-recommendations">
				<li v-for="recmd in authorRecmds"
					:key="recmd.id"
					class="author-recommendation-item divider">
					<local-image :src="recmd.avatar"
								 class="author-icon avatar-icon"
								 @click="router.push(RouterPathGenerator.libraryAuthor(activeLibrary, recmd.id))" />
					<div class="author-info">
						<h1 :title="recmd.name"
							class="name cursor--pointer"
							@click="router.push(RouterPathGenerator.libraryAuthor(activeLibrary, recmd.id))">
							{{ recmd.name }}
						</h1>
						<p class="meta fz-12">
							<span class="inline-list-title"> {{ $t('layout.numberOfWorks') }}</span>
							<a class="count">{{ recmd.record_count }}</a>
						</p>
						<p class="caption"> {{ recmd.intro }} </p>
					</div>
					<ul class="works">
						<li v-for="piece in recmd.masterpieces"
							:key="piece.id"
							:title="piece.title">
							<local-image :src="piece.cover"
										 class="fit--cover" />
						</li>
						<li v-for="i in (3 - recmd.masterpieces.length)">
						</li>
					</ul>
				</li>
			</ul>
		</scrollbar>
		<el-pagination v-model:current-page="currentPage"
					   class="dashboard__footer"
					   background
					   size="small"
					   :page-size="pageSize"
					   layout="prev, pager, next, jumper, total"
					   :total="total"
					   @current-change="handlePageChange" />
	</div>
</template>

<script setup lang='ts'>
import { ref, Ref, onMounted, inject, watch, computed, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import RouterPathGenerator from '@/router/router_path_generator';
import { $t } from '@/locale'
import { debounce } from '@/util/common'
import { VueInjectKey } from '@/constant/channel_key';
import useLibraryStore from '@/store/libraryStore'
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
import useAuthorsDashStore from '@/store/authorsDashStore'
import { ElPagination } from 'element-plus'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import DashDropMenu from '@/components/DashDropMenu.vue'
import Scrollbar from '@/components/Scrollbar.vue'
import Empty from '@/components/Empty.vue'
import LocalImage from '@/components/LocalImage.vue'

const route = useRoute()
const router = useRouter()

const scrollbarRef = ref()
const loading = ref<boolean>(false)

const activeLibrary = inject<Ref<number>>(VueInjectKey.ACTIVE_LIBRARY)!;

const libraryStore = useLibraryStore()
const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()
const authorsDashStore = useAuthorsDashStore()

const roleDropdownMenu = reactive<DashDropMenu>({
	HTMLElementTitle: 'role',
	title: '&#xe60d;',
	items: []
})

const sortDropdownMenu: DashDropMenu = {
	HTMLElementTitle: $t('layout.sortBy'),
	title: '&#xe81f;',
	items: [
		{
			title: $t('layout.name'),
			divided: false,
			click: () => authorsDashStore.handleSortField('name'),
			dot: () => authorsDashStore.sortField === 'name'
		},
		{
			title: $t('layout.time'),
			divided: false,
			click: () => authorsDashStore.handleSortField('time'),
			dot: () => authorsDashStore.sortField === 'time'
		},
		{
			title: $t('layout.ascending'),
			divided: true,
			click: () => authorsDashStore.handleOrder('ASC'),
			dot: () => authorsDashStore.order === 'ASC'
		},
		{
			title: $t('layout.descending'),
			divided: false,
			click: () => authorsDashStore.handleOrder('DESC'),
			dot: () => authorsDashStore.order === 'DESC'
		},
	]
}

const authorRecmds = ref<VO.AuthorRecommendation[]>([])
const keyword = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = 20
const total = ref<number>(0)

const queryAuthorRecmds = debounce(async () => {
	loading.value = true
	const pagedRes = await window.dataAPI.queryAuthorRecmds(
		activeLibrary.value,
		{
			keyword: keyword.value,
			sortField: authorsDashStore.sortField,
			order: authorsDashStore.order,
			roleFilterMode: authorsDashStore.roleFilterMode,
			role: authorsDashStore.role,
			pn: currentPage.value,
			ps: pageSize
		}
	)
	total.value = pagedRes.page.total_count
	authorRecmds.value = pagedRes.results
	loading.value = false
}, 100)

// pageChange 刷新数据, 重置滚动位置
const handlePageChange = function (pn: number) {
	scrollbarRef.value?.setScrollPosition(0)
	currentPage.value = pn
	queryAuthorRecmds()
}
// 请求参数发送改变(activeLibrarykeyword , sortFild, order)	刷新数据, 重置滚动位置, 重置页码
const handleQueryParamsChange = function () {
	handlePageChange(1)
}
const init = async function () {
	// authorsDashStore.setRole('None')

	keyword.value = ''
	handleQueryParamsChange()
}

// 刷新数据, 保留滚动位置, 保留页码
watch(() => [authorsDashStore.sortField, authorsDashStore.order], handleQueryParamsChange)
watch(route, () => {
	switch (viewsTaskAfterRoutingStore.bashboardAuthors) {
		case 'init':
			init()
			break
		case 'refresh':
			queryAuthorRecmds()
			break
	}
	viewsTaskAfterRoutingStore.setBashboardAuthors('none')
})
onMounted(init)
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
	cursor: pointer;
}

.author-recommendation-item .works {
	display: flex;
	align-items: center;
	width: 402px;
	margin-left: 4px;
}

.author-recommendation-item .works>li {
	width: 130px;
	height: var(--author-recommend-item-height);
	border: 1px solid #e1e1e1;
	box-sizing: border-box;
	margin-left: 4px;
}
</style>