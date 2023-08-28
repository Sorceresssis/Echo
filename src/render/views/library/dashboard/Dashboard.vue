<template>
    <div>
        <tabs v-model="activeLabelIdx"
              :tabs="tabs" />
        <keep-alive>
            <component class="flex-1 overflow-hidden"
                       :is="components[activeLabelIdx] ">
            </component>
        </keep-alive>
    </div>
</template>
  
<script lang="ts" setup>
import { shallowReactive, ref, Ref, inject, watch } from 'vue'
import { $t } from '@/locales/index'
import Tabs from '@/components/Tabs.vue'
import Records from './Records.vue'
import Authors from './Authors.vue'
import Tags from './Tags.vue'
import Dirnames from './Dirnames.vue'
import Recycled from './Recycled.vue'
import About from './About.vue'

const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>
watch(() => activeLibrary.value, () => {
    activeLabelIdx.value = 0
})


const activeLabelIdx = ref<number>(0)
const tabs = shallowReactive([
    { id: 1, label: '记录' },
    { id: 2, label: '作者' },
    { id: 3, label: '标签' },
    { id: 4, label: '目录' },
    { id: 5, label: '回收站' },
    { id: 6, label: '关于' }
])
const components = [
    Records,
    Authors,
    Tags,
    Dirnames,
    Recycled,
    About,
]  
</script> 