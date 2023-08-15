<template>
    <tabs :components="componentList"
          v-model="activeComponentIdx">
        <template v-slot:header>
            <div class="tab-header fw-bold">
                <div class="flex-row">
                    <img style="width: 150px; height: 150px;object-fit: contain; border-radius: 50%;"
                         src="../../../assets/images/logo.png">
                    <div class="flex-1">
                        <h1></h1>

                    </div>
                </div>
            </div>
        </template>
    </tabs>
</template>
  
<script lang="ts" setup>
import { shallowReactive, ref, } from 'vue'
import { $t } from '@locales/index'
import Tabs from '@/components/Tabs.vue'
import Records from '../dashboard/Records.vue'
import About from './About.vue'

const activeComponentIdx = ref<number>(0)
const componentList = shallowReactive([
    { id: 1, name: '记录', component: Records },
    { id: 5, name: '详细信息', component: About }
])
</script>

<style></style>