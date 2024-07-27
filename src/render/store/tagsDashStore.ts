import { defineStore } from 'pinia'
import StoreId from './storeId'
import LocalStorage from '@/util/LocalStorage'
import { isSameType } from '@/util/common'

type TagsDashState = {
    sortField: DTO.QueryTagDetailsOptions['sortField'],
    order: 'ASC' | 'DESC'
}

const useTagsDashStore = defineStore(StoreId.TAGS_DASH, {
    state: (): TagsDashState => {
        const defaultState: TagsDashState = {
            sortField: 'title',
            order: 'ASC'
        }
        const saved = LocalStorage.get<TagsDashState>(StoreId.TAGS_DASH)
        if (saved && isSameType(saved, defaultState)) {
            return saved
        } else {
            LocalStorage.set(StoreId.TAGS_DASH, defaultState)
            return defaultState
        }
    },
    actions: {
        handleSortField(field: TagsDashState['sortField']) {
            this.sortField = field
            LocalStorage.set(StoreId.TAGS_DASH, this.$state)
        },
        handleOrder(order: 'ASC' | 'DESC') {
            this.order = order
            LocalStorage.set(StoreId.TAGS_DASH, this.$state)
        },
    }
})

export default useTagsDashStore