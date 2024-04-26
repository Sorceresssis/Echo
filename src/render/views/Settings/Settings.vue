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
                :is="components[activeLabelIdx]">
            </component>
        </keep-alive>
    </div>
</template>

<script lang='ts' setup>
import { ref, shallowReactive } from 'vue'
import { $t } from '@/locale'
import Tabs from '@/components/Tabs.vue'
import SettingsSponsor from './SettingsSponsor.vue'
import SettingsGeneral from './SettingsGeneral.vue'
import SettingsHelp from './SettingsHelp.vue'

const activeLabelIdx = ref<number>(0)
const tabs = shallowReactive([
    { id: 1, label: $t('settings.sponsor') },
    { id: 2, label: $t('settings.general') },
    { id: 3, label: $t('settings.help') },
])
const components = [
    SettingsSponsor,
    SettingsGeneral,
    SettingsHelp
] 
</script>