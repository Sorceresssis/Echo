<template>
    <div>
        <tabs v-model="activeLabelIdx"
              :tabs="tabs" />
        <keep-alive>
            <component class="flex-1 overflow-hidden"
                       :is="components[activeLabelIdx].component"
                       :="components[activeLabelIdx].props">
            </component>
        </keep-alive>
    </div>
</template>
  
<script lang="ts" setup>
import { shallowReactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { $t } from '@/locale'
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
import Tabs from '@/components/Tabs.vue'
import Records from './Records.vue'
import Authors from './Authors.vue'
import Tags from './Tags.vue'
import Dirnames from './Dirnames.vue'
import Recycled from './Recycled.vue'
import About from './About.vue'

const route = useRoute()
const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()
watch(route, () => {
    switch (viewsTaskAfterRoutingStore.bashboard) {
        case 'init':
            activeLabelIdx.value = 0
            break
    }
    viewsTaskAfterRoutingStore.setBashboard('none')
})

const activeLabelIdx = ref<number>(0)
const tabs = shallowReactive([
    { id: 1, label: $t('layout.records') },
    { id: 2, label: $t('layout.authors') },
    { id: 3, label: $t('layout.tags') },
    { id: 4, label: $t('layout.dirnames') },
    { id: 5, label: $t('layout.recycleBin') },
    { id: 6, label: $t('layout.aboutLibrary') }
])
const components = [
    { component: Records, props: { type: 'common' } },
    { component: Authors, props: {} },
    { component: Tags, props: {} },
    { component: Dirnames, props: {} },
    { component: Recycled, props: { type: 'recycled' } },
    { component: About, props: {} },
]
</script> 