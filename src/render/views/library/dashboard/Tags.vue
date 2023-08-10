<template>
    <div class="flex-col">
        <div class="dashboard__header">
            <div class="right-menu">
                <echo-autocomplete v-model="search"
                                   type="tag"
                                   class="menu-item"
                                   :placeholder="'搜索'" />
                <el-dropdown :title="dropdown.HTMLElementTitle"
                             class="menu-item"
                             trigger="click">
                    <button-1><span class="iconfont"
                              v-html="dropdown.title"></span></button-1>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="item in dropdown.menu"
                                              @click="item.click"
                                              :divided="item.divided">
                                <span :class="[true ? 'dot' : '']"
                                      class="beforeIcon">
                                    {{ item.title }}
                                </span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="dashboard__content scrollbar-y-w8">
            <empty v-if="tags.length === 0" />
            <ul v-else
                class="adaptive-grid">
                <li class="dashboard-text-card"
                    v-for="tag in tags"
                    :key="tag.id">
                    <span>{{ tag.value }}</span>
                    <span class="operate">
                        <span class="iconfont"
                              @click="writeClibboard(tag.value)">&#xe85c;</span>
                        <span class="iconfont"
                              @click="">&#xe722;</span>
                        <span class="iconfont"
                              @click="">&#xe636;</span>
                    </span>
                </li>
            </ul>
        </div>
        <div class="dashboard__pagination">
            <el-pagination v-model:current-page="currentPage"
                           background
                           small
                           :page-size="20"
                           layout="prev, pager, next, jumper"
                           :total="200"
                           @current-change="" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, watch, onMounted } from 'vue'
import { writeClibboard } from '@/util/systemUtil'
import { $t } from '@/locales/index'
import Button1 from '@/components/Button1.vue'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import Empty from '@/components/Empty.vue'

const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(40)
const dropdown = {
    HTMLElementTitle: $t('mainContainer.sort'),
    title: '&#xe81f;',
    menu: [
        { title: $t('mainContainer.time'), divided: false, click: 1 },
        { title: $t('mainContainer.hits'), divided: false, click: 1 },
        { title: $t('mainContainer.title'), divided: false, click: 1 },
        { title: $t('mainContainer.ascending'), divided: true, click: 1 },
        { title: $t('mainContainer.descending'), divided: false, click: 1 },
    ]
}
onMounted(() => {
})

type QueryAttributesOptions = {
    queryWork: string
    sortField: 'date' | 'text'
    asc: boolean
    pn: number
    ps: number
}

const tags = ref<any[]>([
])
watch(() => [search, currentPage], () => [

])

const queryTags = (pn: number, ps: number, keyWork: string) => {

}
</script>

<style scoped>
.adaptive-grid {
    grid-template-columns: repeat(auto-fill, 350px);
}
</style>