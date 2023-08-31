<template>
	<div class="flex-col">
		<div class="dashboard__header">
			<div class="right-menu">
				<echo-autocomplete v-model="keyword"
								   class="menu-item search"
								   type="author"
								   :placeholder="'搜索'"
								   @keyup.enter="init" />
				<dash-drop-menu v-for="menu in dropdownMenus"
								class="menu-item"
								:menu="menu" />
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
								 class="author-icon"
								 @click="router.push(`/library/${activeLibrary}/author?id=${recmd.id}`)" />
					<div class="author-text">
						<h1 :title="recmd.name"
							@click="router.push(`/library/${activeLibrary}/author?id=${recmd.id}`)"> {{ recmd.name }} </h1>
						<p class="meta">
							<span class="inline-list-title">作品数</span>
							<a class="count">{{ recmd.worksCount }}</a>
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
					   small
					   :page-size="pageSize"
					   layout="prev, pager, next, jumper, total"
					   :total="total"
					   @current-change="hadnlePageChange" />
	</div>
</template>

<script setup lang='ts'>
import { ref, Ref, onMounted, inject, watch, watchEffect, } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { $t } from '@/locales/index'
import { debounce } from '@/util/debounce'
import useAuthorsDashStore from '@/store/authorsDashStore'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import DashDropMenu from '@/components/DashDropMenu.vue'
import Scrollbar from '@/components/Scrollbar.vue'
import Empty from '@/components/Empty.vue'
import LocalImage from '@/components/LocalImage.vue'

const route = useRoute()
const router = useRouter()
const pageSize = 5

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
const scrollbarRef = ref()
const loading = ref<boolean>(false)
const authorRecmds = ref<VO.AuthorRecommendation[]>([])

const keyword = ref<string>('')
const currentPage = ref<number>(1)
const total = ref<number>(0)

const queryAuthorRecmds = debounce(async () => {
	loading.value = true
	const page = await window.electronAPI.queryAuthorRecmds(
		1 || activeLibrary.value,
		{
			keyword: keyword.value,
			sortField: authorsDashStore.sortField,
			order: authorsDashStore.order,
			pn: currentPage.value,
			ps: pageSize
		}
	)
	total.value = page.total
	authorRecmds.value = page.rows
	loading.value = false
}, 100)

// pageChange 刷新数据, 重置滚动位置
const hadnlePageChange = function () {
	scrollbarRef.value.setScrollPosition(0)
	queryAuthorRecmds()
}
// 请求参数发送改变(activeLibrarykeyword , sortFild, order)	刷新数据, 重置滚动位置, 重置页码
const init = function () {
	scrollbarRef.value.setScrollPosition(0)
	currentPage.value = 1
	queryAuthorRecmds()
}
watch(() => [activeLibrary.value, authorsDashStore.sortField, authorsDashStore.order], init)
// 刷新数据, 保留滚动位置, 保留页码
watch(route, queryAuthorRecmds)
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
	color: var(--echo-emphasis-color);
	cursor: pointer;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
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