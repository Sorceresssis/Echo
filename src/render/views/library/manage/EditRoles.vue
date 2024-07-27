<template>
    <div class="flex-col">
        <scrollbar v-loading="libraryStore.isLoadingRoles"
                   ref="scrollbarRef"
                   class="dashboard__content scrollbar-y-w8">
            <empty v-if="libraryStore.roles.length === 0" />
            <ul v-else
                class="adaptive-grid">
                <li class="dashboard-text-card"
                    v-for="role in libraryStore.roles"
                    :key="role.id">
                    <div class="content">
                        <span :title="role.name"
                              class="textover--ellopsis">{{ role.name }}</span>
                    </div>
                    <div class="operate">
                        <span class="iconfont"
                              :title="$t('layout.copyToClipboard')"
                              @click="writeClibboard(role.name)">&#xe85c;</span>
                        <span class="iconfont"
                              :title="$t('layout.edit')"
                              @click="editRole(role.id, role.name)">&#xe722;</span>
                        <span class="iconfont"
                              :title="$t('layout.delete')"
                              @click="deleteRole(role.id)">&#xe636;</span>
                    </div>
                </li>
            </ul>
        </scrollbar>
    </div>
</template>

<script setup lang='ts'>
import { ref, inject } from 'vue'
import { $t } from '@/locale'
import { writeClibboard } from '@/util/systemUtil'
import MessageBox from '@/util/MessageBox'
import useLibraryStore from '@/store/libraryStore'
import Scrollbar from '@/components/Scrollbar.vue'
import Empty from '@/components/Empty.vue'

const scrollbarRef = ref()

const roleNameMaxLen = 50
const libraryStore = useLibraryStore()

const editRole = (id: number, oldValue: string) => {
    MessageBox.editPrompt((value: string) => {
        const reg = /\S/
        if (!reg.test(value)) return $t('tips.inputValueNotEmpty')
        const maxLen = roleNameMaxLen
        if (value.length > maxLen) return $t('tips.lengthLimitExceeded', { count: maxLen })
        return true
    }, oldValue).then(({ value }) => {
        return MessageBox.editConfirm().then(async () => {
            const trimValue = value.trim()
            if (trimValue === '' || trimValue === oldValue) return

            // window.dataAPI
        })
    })
}

const deleteRole = (id: number) => {
    MessageBox.deleteConfirm().then(async () => {

    })
}
</script>

<style scoped>
.adaptive-grid {
    row-gap: 8px;
    grid-template-columns: repeat(auto-fill, 350px);
}
</style>