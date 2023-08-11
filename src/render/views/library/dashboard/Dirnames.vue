<template>
    <div class="flex-col">
        <div class="dashboard__header">
            <div class="right-menu">
                <echo-autocomplete v-model="search"
                                   type="dirname"
                                   :placeholder="'搜索'" />
            </div>
        </div>
        <div class="dashboard__content scrollbar-y-w8">
            <empty v-if="dirnames.length === 0" />
            <ul v-else
                class="adaptive-grid">
                <li class="dashboard-text-card"
                    v-for="dirname in dirnames"
                    :key="dirname.id">
                    <div>
                        <span>{{ dirname.value }}</span>
                        <span class="count">{{ dirname.count }}</span>
                    </div>
                    <div class="operate">
                        <span class="iconfont"
                              @click="writeClibboard(dirname.value)">&#xe85c;</span>
                        <span class="iconfont"
                              @click="">&#xe722;</span>
                        <span class="iconfont"
                              @click="">&#xe636;</span>
                    </div>
                </li>
            </ul>
        </div>
        <el-pagination v-model:current-page="currentPage"
                       class="dashboard__footer"
                       background
                       small
                       :page-size="pageSize"
                       layout="prev, pager, next, jumper"
                       :total="total"
                       @current-change="" />
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, inject, onMounted } from 'vue'
import { $t } from '@/locales/index'
import { writeClibboard } from '@/util/systemUtil'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'


// const dropdownMenu = {
//     HTMLElementTitle: $t('mainContainer.sort'),
//     title: '&#xe81f;',
//     items: [
//         {
//             title: $t('mainContainer.time'),
//             divided: false,
//             click: () => tagsDashStore.handleSortField('date'),
//             dot: () => tagsDashStore.sortField === 'date'
//         },
//         {
//             title: '文本',
//             divided: false,
//             click: () => tagsDashStore.handleSortField('text'),
//             dot: () => tagsDashStore.sortField === 'text'
//         },
//         {
//             title: $t('mainContainer.ascending'),
//             divided: true,
//             click: () => tagsDashStore.handleAsc(true),
//             dot: () => tagsDashStore.asc
//         },
//         {
//             title: $t('mainContainer.descending'),
//             divided: false,
//             click: () => tagsDashStore.handleAsc(false),
//             dot: () => !tagsDashStore.asc
//         },
//     ]
// }
const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>
const pageSize = 30
const dirnames = ref<TextAttribute[]>([])

const search = ref<string>('')
const currentPage = ref<number>(1)
const total = ref<number>(0)
const queryDirnames = async () => {
    const resp = await window.electronAPI.queryDirnames(
        activeLibrary.value,
        {
            queryWork: search.value,
            sortField: 'date',
            asc: true,
            pn: currentPage.value,
            ps: pageSize
        }
    )
    dirnames.value = resp.data
    total.value = resp.total
}

onMounted(() => {
    queryDirnames()
})
</script>

<style scoped>
.adaptive-grid {
    row-gap: 8px;
    grid-template-columns: 1fr;
}
</style>