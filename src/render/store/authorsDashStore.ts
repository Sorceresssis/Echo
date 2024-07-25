import { defineStore } from 'pinia'
import StoreId from './storeId'
import Message from '@/util/Message'

type AuthorsDashState = {
    sortField: DTO.QueryAuthorRecommendationsOptions['sortField']
    order: 'ASC' | 'DESC',
    role: string | 0 | 1 // 1: all. 0: none  切换lib要重置
    rolesLoading: boolean
    roles: string[]
}

const rolesMap = new Map<number, string[]>()

const useAuthorsDashStore = defineStore(StoreId.AUTHORS_DASH, {
    state: (): AuthorsDashState => {
        const defaultState: AuthorsDashState = {
            sortField: 'name',
            order: 'ASC',
            role: 1,
            rolesLoading: true,
            roles: []
        }

        return defaultState
    },
    actions: {
        handleSortField(field: AuthorsDashState['sortField']) {
            this.sortField = field
        },
        handleOrder(order: 'ASC' | 'DESC') {
            this.order = order
        },
        handleRole(role: string | 0 | 1) {
            this.role = role
        },
        getRoles(libraryId: number) {
            const saved = rolesMap.get(libraryId)
            if (saved) {
                this.rolesLoading = false
                this.roles = saved
            } else {
                this.updateRoles(libraryId)
            }
        },
        updateRoles(libraryId: number) {
            this.rolesLoading = true
            window.dataAPI.getAuthorRoles(libraryId).then(res => {
                if (res.code === 0) {
                    Message.error(res.msg)
                    return
                }

                rolesMap.set(libraryId, res.data)
                this.roles = res.data
            }).catch(() => {
                this.roles = []
            }).finally(() => {
                this.rolesLoading = false
            })
        }
    }
})

export default useAuthorsDashStore