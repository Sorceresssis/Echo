import { defineStore } from 'pinia'
import StoreId from './storeId'
import { getLocalStorage, setLocalStorage } from '@/util/LocalStorage'

type TagsDashState = {
    sortField: AttributeSortField,
    asc: boolean,
}

const useTagsDashStore = defineStore(StoreId.TAGS_DASH, {
    state: (): TagsDashState => {
        const defaultState: TagsDashState = {
            sortField: 'date',
            asc: true
        }
        const saved = getLocalStorage(StoreId.TAGS_DASH)
        if (saved) {
            return saved
        } else {
            setLocalStorage(StoreId.TAGS_DASH, defaultState)
            return defaultState
        }
    },
    actions: {
        handleSortField(field: AttributeSortField) {
            this.sortField = field
            setLocalStorage(StoreId.TAGS_DASH, this.$state)
        },
        handleAsc(asc: boolean) {
            this.asc = asc
            setLocalStorage(StoreId.TAGS_DASH, this.$state)
        },
    }
})

export default useTagsDashStore