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
            <ul class="adaptive-grid">
                <li class="dashboard-text-card"
                    v-for="dir in dirnames"
                    :key="dir.id">
                    <span>{{ dir.value }}</span>
                    <span class="operate">
                        <span class="iconfont"
                              @click="writeClibboard(dir.value)">&#xe85c;</span>
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
import { ref, reactive } from 'vue'
import { writeClibboard } from '@/util/systemUtil'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'

const search = ref<string>('')
const currentPage = ref<number>(1)

const dirnames = ref<any>([
    { id: 1, value: "F:\\Project\\Github\echo\\node_modules\\electron\dist", itemCount: 1 },
    { id: 2, value: 'F:\\Project\\Github\\echo', itemCount: 43 },
    { id: 3, value: 'F:\\Project\Github\\echo\\node_modules\@imengyu\vue3-context-menu\examples', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
    { id: 4, value: 'D:\\Work\\Microsoft VS Code\\bin', itemCount: 99 },
])

</script>

<style scoped>
.adaptive-grid {
    grid-template-columns: 1fr;
}
</style>