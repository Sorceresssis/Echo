<template>
    <div class="flex-col">
        <div style="height: 40px; padding: 4px 18px 4px 4px;">
            <echo-autocomplete v-model="search"
                               type="dirname" />
        </div>
        <div class="flex-1 scrollbar-y-w8"
             style="  padding: 4px 10px 4px 4px;">
            <ul class="tags adaptive-grid">
                <li v-for="dirname in dirnames"
                    :key="dirname.id">
                    <span>{{ dirname.value }}</span>
                    <span class="operate">
                        <span class="iconfont">&#xe85c;</span>
                        <span class="iconfont">&#xe722;</span>
                        <span class="iconfont">&#xe636;</span>
                    </span>
                </li>
            </ul>
        </div>
        <div class="dashboard-pagination">
            <el-pagination v-model:current-page="currentPage1"
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
import EchoAutocomplete from '@components/EchoAutocomplete.vue'

const search = ref<string>('')

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
    display: grid;
    justify-content: space-around;
    grid-template-columns: 1fr;
    /* column-gap: 20px;
    row-gap: 20px; */
}

.tags {
    padding: 10px 0;
}

.tags li {
    /* height: 40px; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 20px;
    border-radius: 5px;
    font-size: 13px;
}

.tags li:hover {
    background-color: #fff;
    box-shadow:
        0px 0px 0.3px rgba(0, 0, 0, 0.033),
        0px 0px 1.1px rgba(0, 0, 0, 0.044),
        0px 0px 5px rgba(0, 0, 0, 0.07);
}

.tags li .operate {
    visibility: hidden;
}

.tags li:hover .operate {
    visibility: visible;
}

.tags .operate span {
    padding: 5px;
}

.tags .operate span:hover {
    color: var(--echo-theme-color);
}
</style>