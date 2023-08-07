<template>
    <div class="flex-col">
        <div style="height: 40px; padding: 4px 18px 4px 4px;">
            <echo-autocomplete v-model="search"
                               type="tag" />
        </div>
        <div class="flex-1 scrollbar-y-w8">
            <ul class="tags adaptive-grid">
                <li v-for="tag in tags"
                    :key="tag.id">
                    <span>{{ tag.tag }}</span>
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
const tags = ref<any>([
    { id: 1, tag: '版本控制' },
    { id: 2, tag: 'git' },
    { id: 3, tag: 'vue' },
    { id: 4, tag: 'github' },
    { id: 5, tag: 'java' },
    { id: 6, tag: 'bitbucket' },
    { id: 7, tag: 'gitlab' },
    { id: 8, tag: 'svn' },
    { id: 9, tag: 'c#' },
    { id: 10, tag: 'c++' },
    { id: 11, tag: 'c' },
    { id: 12, tag: 'python' },
    { id: 13, tag: 'javascript' },
    { id: 14, tag: 'typescript' },
    { id: 15, tag: 'html' },
    { id: 16, tag: 'css' },
    { id: 17, tag: 'kafuka' },
    { id: 18, tag: 'redis' },
    { id: 19, tag: 'mysql' },
    { id: 20, tag: 'oracle' },
    { id: 21, tag: 'sqlserver' },
    { id: 22, tag: 'mongodb' },
    { id: 23, tag: 'sqlite' },
    { id: 24, tag: 'postgresql' },
    { id: 25, tag: 'mariadb' },
    { id: 26, tag: 'memcached' },
    { id: 27, tag: 'elasticsearch' },
    { id: 28, tag: 'nginx' },
    { id: 29, tag: 'apache' },
    { id: 30, tag: 'tomcat' },
    { id: 31, tag: 'docker' },
    { id: 32, tag: 'kubernetes' },
    { id: 33, tag: 'linux' },
    { id: 34, tag: 'windows' },
    { id: 35, tag: 'macos' },
    { id: 36, tag: 'unix' },
    { id: 37, tag: 'android' },
    { id: 38, tag: 'ios' },
    { id: 39, tag: 'flutter' },
    { id: 40, tag: 'react' },
    { id: 41, tag: 'angular' },
    { id: 42, tag: 'vue' },
    { id: 43, tag: 'jquery' },
    { id: 44, tag: 'bootstrap' },
    { id: 45, tag: 'element-ui' },
    { id: 46, tag: 'iview' },
    { id: 47, tag: 'ant-design' },
    { id: 48, tag: 'vant' },
    { id: 49, tag: 'vuetify' },
    { id: 50, tag: 'quasar' },
    { id: 51, tag: 'tailwindcss' },
    { id: 52, tag: 'bulma' },
    { id: 53, tag: 'materializecss' },
    { id: 54, tag: 'material-ui' },
    { id: 55, tag: 'chakra-ui' },
    { id: 56, tag: 'tailwindcss' },
    { id: 57, tag: 'element-plus' },
])

</script>

<style scoped>
.adaptive-grid {
    display: grid;
    justify-content: space-around;
    grid-template-columns: repeat(auto-fill, 350px);
    /* column-gap: 20px;
    row-gap: 20px; */
}

.tags {
    padding: 10px 0;
}

.tags li {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
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
    margin-left: 10px;
}

.tags .operate span:hover {
    color: var(--echo-theme-color);
}
</style>