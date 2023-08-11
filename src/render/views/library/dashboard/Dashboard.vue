<template>
    <tabs :components="componentList"
          v-model="activeComponentIdx" />
</template>
  
<script lang="ts" setup>
import { shallowReactive, ref, Ref, inject, watch } from 'vue'
import { $t } from '@locales/index'
import Tabs from '../../../components/Tabs.vue'
import Records from './Records.vue'
import Authors from './Authors.vue'
import Tags from './Tags.vue'
import Dirnames from './Dirnames.vue'

// library变化时，重新渲染组件
const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>
const activeComponentIdx = ref<number>(0)
watch(() => activeLibrary.value, () => {
    activeComponentIdx.value = 0
})

const componentList = shallowReactive([
    { id: 1, name: '记录', component: Records },
    { id: 2, name: '作者', component: Authors },
    { id: 3, name: '标签', component: Tags },
    { id: 4, name: '目录', component: Dirnames },
])
</script>

<style></style>