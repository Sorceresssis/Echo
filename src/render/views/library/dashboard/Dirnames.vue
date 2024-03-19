<template>
    <div class="flex-col">
        <div class="dashboard__header">
            <div class="right-menu">
                <echo-autocomplete v-model="keyword"
                    type="dirname"
                    class="menu-item search"
                    :placeholder="$t('layout.search')"
                    @keyup.enter="handleQueryParamsChange" />
                <dash-drop-menu v-for="menu in dropdownMenus"
                    class="menu-item"
                    :menu="menu" />
            </div>
        </div>
        <scrollbar v-loading="loading"
            ref="scrollbarRef"
            class="dashboard__content scrollbar-y-w8">
            <empty v-if="dirnames.length === 0" />
            <ul v-else
                class="adaptive-grid">
                <li class="dashboard-text-card"
                    v-for="dirname in dirnames"
                    :key="dirname.id">
                    <div class="content">
                        <span :title="dirname.path"
                            class="textover--ellopsis">{{ dirname.path }}</span>
                        <span class="count">{{ dirname.recordCount }}</span>
                    </div>
                    <div class="operate">
                        <span class="iconfont"
                            :title="$t('layout.openInFileExplorer')"
                            @click="openInExplorer(dirname.path)">&#xe73e;</span>
                        <span class="iconfont"
                            :title="$t('layout.copyToClipboard')"
                            @click="writeClibboard(dirname.path)">&#xe85c;</span>
                        <span class="iconfont"
                            :title="$t('layout.edit')"
                            @click="editDirname(dirname.id, dirname.path)">&#xe722;</span>
                        <span class="iconfont"
                            :title="$t('layout.delete')"
                            @click="deleteDirname(dirname.id)">&#xe636;</span>
                    </div>
                </li>
            </ul>
        </scrollbar>
        <el-pagination v-model:current-page="currentPage"
            class="dashboard__footer"
            background
            small
            layout="prev, pager, next, jumper, total"
            :page-size="pageSize"
            :total="total"
            @current-change="handlePageChange" />
    </div>
</template>

<script setup
    lang='ts'>
    import { ref, Ref, inject, onMounted, watch, readonly } from 'vue'
    import { useRoute } from 'vue-router'
    import { $t } from '@/locale'
    import { writeClibboard, openInExplorer } from '@/util/systemUtil'
    import MessageBox from '@/util/MessageBox'
    import { debounce } from '@/util/common'
    import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
    import useDirnamesDashStore from '@/store/dirnamesDashStore'
    import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
    import DashDropMenu from '@/components/DashDropMenu.vue'
    import Empty from '@/components/Empty.vue'
    import Scrollbar from '@/components/Scrollbar.vue'
    import Message from '@/util/Message'

    const route = useRoute()
    const scrollbarRef = ref()
    const loading = ref<boolean>(false)

    const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()
    const dirnamesDashStore = useDirnamesDashStore()

    const dropdownMenus = [{
        HTMLElementTitle: $t('layout.sortBy'),
        title: '&#xe81f;',
        items: [
            {
                title: $t('layout.time'),
                divided: false,
                click: () => dirnamesDashStore.handleSortField('time'),
                dot: () => dirnamesDashStore.sortField === 'time'
            },
            {
                title: $t('layout.path'),
                divided: false,
                click: () => dirnamesDashStore.handleSortField('path'),
                dot: () => dirnamesDashStore.sortField === 'path'
            },
            {
                title: $t('layout.ascending'),
                divided: true,
                click: () => dirnamesDashStore.handleOrder('ASC'),
                dot: () => dirnamesDashStore.order === 'ASC'
            },
            {
                title: $t('layout.descending'),
                divided: false,
                click: () => dirnamesDashStore.handleOrder('DESC'),
                dot: () => dirnamesDashStore.order === 'DESC'
            },
        ]
    }]

    const activeLibrary = readonly(inject<Ref<number>>('activeLibrary')!)
    const dirnames = ref<VO.DirnameDetail[]>([])
    const keyword = ref<string>('')
    const currentPage = ref<number>(1)
    const pageSize = 30
    const total = ref<number>(0)

    const deleteDirname = (id: number) => {
        MessageBox.deleteConfirm().then(async () => {
            await window.electronAPI.deleteDirname(activeLibrary.value, id)
            queryDirnames()
        })
    }
    const editDirname = (id: number, oldValue: string) => {
        MessageBox.editPrompt(
            (value: string) => {
                const reg = /\S/
                if (!reg.test(value)) return $t('tips.inputValueNotEmpty')
                return true
            }, oldValue
        ).then(({ value }) => {
            MessageBox.editConfirm().then(async () => {
                const trimValue = value.trim()
                if (trimValue === '' || trimValue === oldValue) return

                const result = await window.electronAPI.editDirname(activeLibrary.value, id, value)
                if (result.code === 0) Message.error(result.msg!)
                queryDirnames()
            })
        },)
    }
    const queryDirnames = debounce(async () => {
        loading.value = true
        const page = await window.electronAPI.queryDirnameDetails(
            activeLibrary.value,
            {
                keyword: keyword.value,
                sortField: dirnamesDashStore.sortField,
                order: dirnamesDashStore.order,
                pn: currentPage.value,
                ps: pageSize
            }
        )
        total.value = page.total
        dirnames.value = page.rows
        loading.value = false
    }, 100)
    const handlePageChange = function (pn: number) {
        scrollbarRef.value?.setScrollPosition(0)
        currentPage.value = pn
        queryDirnames()
    }
    const handleQueryParamsChange = function () {
        handlePageChange(1)
    }
    const init = function () {
        keyword.value = ''
        handleQueryParamsChange()
    }

    watch(() => [dirnamesDashStore.sortField, dirnamesDashStore.order], handleQueryParamsChange)
    watch(route, () => {
        switch (viewsTaskAfterRoutingStore.bashboardDirnames) {
            case 'init':
                init()
                break
            case 'refresh':
                queryDirnames()
                break
        }
        viewsTaskAfterRoutingStore.setBashboardDirnames('none')
    })
    onMounted(init)
</script>

<style scoped>
    .adaptive-grid {
        row-gap: 8px;
        grid-template-columns: 1fr;
    }
</style>