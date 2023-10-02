<template>
    <div>
        <div class="module-header flex-row">
            <local-image :src="authorDetail.avatar"
                         class="avatar-icon" />
            <div class="author-info">
                <h1 :title="authorDetail.name"
                    class="name"> {{ authorDetail.name }} </h1>
                <p class="meta">
                    <span class="inline-list-title">作品数</span>
                    <a class="count">{{ authorDetail.recordCount }}</a>
                </p>
                <p class="caption"
                   style="font-size: 12px;"> {{ authorDetail.intro }} </p>
            </div>
            <div class="operate">
                <span class="iconfont"
                      :title="'编辑'"
                      @click="router.push(hrefGenerator.libraryManage(activeLibrary, `author_id=${authorDetail.id}`))">&#xe722;</span>
                <span class="iconfont"
                      :title="'删除'"
                      @click="deleteAuthor">&#xe636;</span>
            </div>
        </div>
        <tabs v-model="activeLabelIdx"
              :tabs="tabs" />
        <keep-alive>
            <component class="flex-1 overflow-hidden"
                       :is="components[activeLabelIdx].component"
                       :="(components[activeLabelIdx].props as any)">
            </component>
        </keep-alive>
    </div>
</template>
  
<script lang="ts" setup>
import { shallowReactive, ref, Ref, onMounted, inject, reactive, readonly } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { $t } from '@/locale'
import Tabs from '@/components/Tabs.vue'
import LocalImage from '@/components/LocalImage.vue'
import Records from '../dashboard/Records.vue'
import About from './About.vue'
import MessageBox from '@/util/MessageBox'
import Message from '@/util/Message'
import hrefGenerator from '@/router/hrefGenerator'

const router = useRouter()
const route = useRoute()
const authorDetail = reactive<VO.AuthorDetail>({
    id: 0,
    name: '',
    avatar: '',
    intro: '',
    createTime: '',
    modifiedTime: '',
    recordCount: 0
})
const activeLibrary = readonly(inject<Ref<number>>('activeLibrary')!)
const activeLabelIdx = ref<number>(0)
const tabs = shallowReactive([
    { id: 1, label: '记录' },
    { id: 2, label: '详细信息' },
])
const components = [
    { component: Records, props: { type: 'author' } },
    { component: About, props: { info: authorDetail } }
]

const deleteAuthor = async () => {
    MessageBox.deleteConfirm(() => {
        window.electronAPI.deleteAuthor(activeLibrary.value, authorDetail.id).then((res) => {
            res ? router.back() : Message.error('删除失败')
            // BUG 打开作者详情页后， 无法切换library
            // BUG 在本页切换作者，不刷新
        })
    })
}

const init = async () => {
    const id = route.query.id as string
    if (id === void 0) {
        router.back()
        return
    }
    const res = await window.electronAPI.queryAuthorDetail(activeLibrary.value, parseInt(id))
    res === void 0 ? router.back() : Object.assign(authorDetail, res)
}

// watch(route, init) // BUG router.back 是导致route 无法切换librarary的原因 
onMounted(init)
</script>

<style scoped>
.avatar-icon {
    width: 100px;
}

.operate span {
    color: var(--echo-text-);
    padding: 5px;
    margin-right: 5px;
}

.operate span:hover {
    color: var(--echo-theme-color);
}
</style>