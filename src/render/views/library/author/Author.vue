<template>
    <div>
        <div class="module-header flex-row">
            <local-image :src="authorDetail.avatar"
                         class="avatar-icon"
                         style="width: 100px; " />
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
import { shallowReactive, ref, Ref, onMounted, inject, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { $t } from '@/locales'
import Tabs from '@/components/Tabs.vue'
import Scrollbar from '@/components/Scrollbar.vue'
import LocalImage from '@/components/LocalImage.vue'
import Records from '../dashboard/Records.vue'
import About from './About.vue'

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
const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>
const activeLabelIdx = ref<number>(0)
const tabs = shallowReactive([
    { id: 1, label: '记录' },
    { id: 2, label: '详细信息' },
])
const components = [
    { component: Records, props: { type: 'author' } },
    { component: About, props: { info: authorDetail } }
]

const init = async () => {
    const id = route.query.id as string
    const res = await window.electronAPI.queryAuthorDetail(activeLibrary.value, parseInt(id))
    Object.assign(authorDetail, res)
}

watch(route, init)
onMounted(init)
</script>