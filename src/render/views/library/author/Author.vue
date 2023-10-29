<template>
    <div>
        <div class="module-header flex-row">
            <local-image :src="authorDetail.avatar"
                         class="avatar-icon" />
            <div class="author-info">
                <h1 :title="authorDetail.name"
                    class="name"> {{ authorDetail.name }} </h1>
                <p class="meta fz-12">
                    <span class="inline-list-title"> {{ $t('layout.numberOfWorks') }} </span>
                    <a class="count">{{ authorDetail.recordCount }}</a>
                </p>
                <p class="caption"
                   style="font-size: 12px;"> {{ authorDetail.intro }} </p>
            </div>
            <div class="operate">
                <span class="iconfont"
                      :title="$t('layout.edit')"
                      @click="router.push(hrefGenerator.libraryEditAuthor(activeLibrary, authorDetail.id))">&#xe722;</span>
                <span class="iconfont"
                      :title="$t('layout.delete')"
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
import { shallowReactive, ref, Ref, onMounted, inject, reactive, readonly, watch, onActivated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
import hrefGenerator from '@/router/hrefGenerator'
import MessageBox from '@/util/MessageBox'
import Message from '@/util/Message'
import { $t } from '@/locale'
import Tabs from '@/components/Tabs.vue'
import LocalImage from '@/components/LocalImage.vue'
import Records from '../dashboard/Records.vue'
import About from './About.vue'

const router = useRouter()
const route = useRoute()

const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()

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
    { id: 1, label: $t('layout.records') },
    { id: 2, label: $t('layout.detailInfo') },
])
const components = [
    { component: Records, props: { type: 'author' } },
    { component: About, props: { info: authorDetail } }
]

const deleteAuthor = async () => {
    MessageBox.deleteConfirm().then(() => {
        viewsTaskAfterRoutingStore.setBashboardAuthors('refresh')
        window.electronAPI.deleteAuthor(activeLibrary.value, authorDetail.id).then((res) => {
            res ? router.back() : Message.error($t('msg.deleteFailed'))
        })
    })
}
const queryAuthorDetail = async () => {
    const id = route.params.authorId as string
    const res = await window.electronAPI.queryAuthorDetail(activeLibrary.value, parseInt(id))
    Object.assign(authorDetail, res)
}

const init = async () => {
    activeLabelIdx.value = 0  // 重置标签页
    queryAuthorDetail()  // 加载新的作者信息
}

watch(route, () => {
    switch (viewsTaskAfterRoutingStore.authorRecords) {
        case 'init':
            init()
            break
        case 'refresh':
            queryAuthorDetail()
            break
    }
})
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