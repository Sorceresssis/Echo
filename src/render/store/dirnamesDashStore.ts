import { defineStore } from 'pinia'
import StoreId from './storeId'
import { getLocalStorage, setLocalStorage } from '@/util/LocalStorage'
import { isSameType } from '@/util/common'

type DirnameDashState = {
    sortField: DTO.QueryDirnameDetailsOptions['sortField'],
    order: 'ASC' | 'DESC'
}

const useDirnameDashStore = defineStore(StoreId.Dirname_Dash, {
    state: (): DirnameDashState => {
        const defaultState: DirnameDashState = {
            sortField: 'path',
            order: 'ASC'
        }
        const saved = getLocalStorage(StoreId.Dirname_Dash)
        if (saved && isSameType(saved, defaultState)) {
            return saved
        } else {
            setLocalStorage(StoreId.Dirname_Dash, defaultState)
            return defaultState
        }
    },
    actions: {
        handleSortField(field: DirnameDashState['sortField']) {
            this.sortField = field
            setLocalStorage(StoreId.Dirname_Dash, this.$state)
        },
        handleOrder(order: 'ASC' | 'DESC') {
            this.order = order
            setLocalStorage(StoreId.Dirname_Dash, this.$state)
        },
    }
})

export default useDirnameDashStore 