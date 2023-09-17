<template>
    <div>
        <div class="module-header module_title">
            {{ $t('settings.settings') }}
        </div>
        <tabs v-model="activeLabelIdx"
              :tabs="tabs">
        </tabs>
        <keep-alive>
            <component class="flex-1 overflow-hidden"
                       :is="components[activeLabelIdx] ">
            </component>
        </keep-alive>
    </div>
</template>

<script lang='ts' setup>
import { ref, shallowReactive } from 'vue'
import { $t } from '@/locales'
import Tabs from '@/components/Tabs.vue'
import SettingsSponsor from './SettingsSponsor.vue'
import SettingsGeneral from './SettingsGeneral.vue'
import SettingsHelp from './SettingsHelp.vue'

const activeLabelIdx = ref<number>(0)
const tabs = shallowReactive([
    { id: 1, label: '赞助' },
    { id: 2, label: '常规' },
    { id: 3, label: '帮助' },
])
const components = [
    SettingsSponsor,
    SettingsGeneral,
    SettingsHelp
] 
</script>