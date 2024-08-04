<template>
    <div class="flex-col">
        <div class="dashboard__header">
            <div class="left-menu">
                <span class="left-menu-btn"
                      @click="addRole"> {{ '添加' }} </span>
            </div>
        </div>
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
import { ref, Ref, readonly, inject, } from 'vue'
import { $t } from '@/locale'
import { VueInjectKey } from '@/constant/channel_key'
import { writeClibboard } from '@/util/systemUtil'
import MessageBox from '@/util/MessageBox'
import useLibraryStore from '@/store/libraryStore'
import Scrollbar from '@/components/Scrollbar.vue'
import Empty from '@/components/Empty.vue'
import Message from '@/util/Message'

const scrollbarRef = ref()
const roleNameMaxLen = 50

const activeLibrary = readonly(inject<Ref<number>>(VueInjectKey.ACTIVE_LIBRARY)!)

const libraryStore = useLibraryStore()

const addRole = () => {
    MessageBox.editPrompt((value: string) => {
        const reg = /\S/
        if (!reg.test(value)) return $t('tips.inputValueNotEmpty')
        const maxLen = roleNameMaxLen
        if (value.length > maxLen) return $t('tips.lengthLimitExceeded', { count: maxLen })
        return true
    }, '').then(({ value }) => {
        return MessageBox.addConfirm().then(async () => {
            const trimValue = value.trim()
            if (trimValue === '') return
            const res = await window.dataAPI.createRole(activeLibrary.value, trimValue)
            if (res.code) {
                libraryStore.roles.push({ id: 0, name: trimValue })
            } else {
                Message.error(res.msg)
            }
        })
    })
}

const editRole = (id: number, oldValue: string) => {
    MessageBox.editPrompt((value: string) => {
        const reg = /\S/
        if (!reg.test(value)) return $t('tips.inputValueNotEmpty')
        const maxLen = roleNameMaxLen
        if (value.length > maxLen) return $t('tips.lengthLimitExceeded', { count: maxLen })
        return true
    }, oldValue).then(({ value }) => {
        MessageBox.editConfirm().then(async () => {
            const trimValue = value.trim()
            if (trimValue === '' || trimValue === oldValue) return
            await window.dataAPI.editRole(activeLibrary.value, { id, name: trimValue })
            const queryRoleRes = await window.dataAPI.getRoles(activeLibrary.value)
            if (queryRoleRes.code && queryRoleRes.data) {
                libraryStore.roles = queryRoleRes.data
            }
        })
    })
}

const deleteRole = (id: number) => {
    MessageBox.deleteConfirm().then(async () => {
        await window.dataAPI.deleteRole(activeLibrary.value, id)
        libraryStore.roles = libraryStore.roles.filter(role => role.id !== id)
    })
}

</script>

<style scoped>
.adaptive-grid {
    row-gap: 8px;
    grid-template-columns: repeat(auto-fill, 350px);
}

.left-menu-btn {
    margin-right: 20px;
    cursor: pointer;
}

.left-menu-btn:not(.disabled):hover {
    color: var(--echo-theme-color);
}
</style>