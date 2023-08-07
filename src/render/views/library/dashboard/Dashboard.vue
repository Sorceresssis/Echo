<template>
    <tabs :components="componentList"></tabs>
</template>
  
<script lang="ts" setup>
import { ref, shallowReactive } from 'vue'
import { $t } from '@locales/index'
import Tabs from '../../../components/Tabs.vue'
import Records from './Records.vue'
import Authors from './Authors.vue'
import Tags from './Tags.vue'
import Dirnames from './Dirnames.vue'


const componentList = shallowReactive([
    { id: 1, name: '记录', component: Records },
    { id: 2, name: '作者', component: Authors },
    { id: 3, name: '标签', component: Tags },
    { id: 4, name: '目录', component: Dirnames },
])
</script>

<style></style>