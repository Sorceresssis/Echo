<template>
    <tabs :components="componentList"
          v-model="activeComponentIdx">
        <template v-slot:header>
            <div class="tab-header">
                {{ $t('settings.settings') }}
            </div>
        </template>
    </tabs>
</template>

<script setup lang='ts'>
import { ref, shallowReactive } from 'vue'
import { $t } from '@/locales'
import Tabs from '@/components/Tabs.vue'
import SettingsSponsor from './SettingsSponsor.vue'
import SettingsGeneral from './SettingsGeneral.vue'
import SettingsHelp from './SettingsHelp.vue'

const activeComponentIdx = ref<number>(0)
const componentList = shallowReactive([
    { id: 1, name: '赞助', component: SettingsSponsor },
    { id: 2, name: '常规', component: SettingsGeneral },
    { id: 3, name: '帮助', component: SettingsHelp },
])
</script>

<style scoped></style>