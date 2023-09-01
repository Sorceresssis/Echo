<template>
    <div>
        <div class="tab-header fw-bold">
            <div class="flex-row">
                <img style="width: 120px; height: 120px;object-fit: contain; border-radius: 50%;"
                     src="../../../assets/images/logo.png">
                <div class="flex-1">
                    <h1></h1>
                </div>
            </div>
        </div>
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
import { shallowReactive, ref, onMounted, } from 'vue'
import { $t } from '@/locales'
import Tabs from '@/components/Tabs.vue'
import Records from '../dashboard/Records.vue'
import About from './About.vue'

// const 
const activeLabelIdx = ref<number>(0)
const tabs = shallowReactive([
    { id: 1, label: '记录' },
    { id: 2, label: '详细信息' },
])
const components = [
    Records,
    About
]

onMounted(() => {
}) 
</script>

<style></style>