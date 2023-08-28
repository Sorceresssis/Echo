import { defineStore } from 'pinia'
import StoreId from './storeId'
import { getLocalStorage, setLocalStorage } from '@/util/LocalStorage'

type AuthorsDashState = {
    sortField: 'time' | 'name',
    order: 'ASC' | 'DESC'
}

const useAuthorsDashStore = defineStore(StoreId.AUTHORS_DASH, {
    state: (): AuthorsDashState => {
        const defaultState: AuthorsDashState = {
            sortField: 'time',
            order: 'ASC'
        }

        const saved = getLocalStorage(StoreId.AUTHORS_DASH)
        if (saved) {
            return saved
        } else {
            setLocalStorage(StoreId.AUTHORS_DASH, defaultState)
            return defaultState
        }
    },
    actions: {
        handleSortField(field: 'time' | 'name') {
            this.sortField = field
            setLocalStorage(StoreId.AUTHORS_DASH, this.$state)
        },
        handleOrder(order: 'ASC' | 'DESC') {
            this.order = order
            setLocalStorage(StoreId.AUTHORS_DASH, this.$state)
        },
    }
})

export default useAuthorsDashStore