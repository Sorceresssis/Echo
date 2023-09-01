import { defineStore } from 'pinia'
import StoreId from './storeId'
import { getLocalStorage, setLocalStorage } from '@/util/LocalStorage'

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
        const saved = getLocalStorage(StoreId.TAGS_DASH)
        // 纠错，如果存储的数据不符合预期，就使用默认值
        if (saved) {
            return saved
        } else {
            setLocalStorage(StoreId.TAGS_DASH, defaultState)
            return defaultState
        }
    },
    actions: {
        handleSortField(field: TagsDashState['sortField']) {
            this.sortField = field
            setLocalStorage(StoreId.TAGS_DASH, this.$state)
        },
        handleOrder(order: 'ASC' | 'DESC') {
            this.order = order
            setLocalStorage(StoreId.TAGS_DASH, this.$state)
        },
    }
})

export default useTagsDashStore