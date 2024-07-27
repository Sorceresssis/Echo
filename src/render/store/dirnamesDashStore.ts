import { defineStore } from 'pinia'
import StoreId from './storeId'
import LocalStorage from '@/util/LocalStorage'
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
        const saved = LocalStorage.get<DirnameDashState>(StoreId.Dirname_Dash)
        if (saved && isSameType(saved, defaultState)) {
            return saved
        } else {
            LocalStorage.set(StoreId.Dirname_Dash, defaultState)
            return defaultState
        }
    },
    actions: {
        handleSortField(field: DirnameDashState['sortField']) {
            this.sortField = field
            LocalStorage.set(StoreId.Dirname_Dash, this.$state)
        },
        handleOrder(order: 'ASC' | 'DESC') {
            this.order = order
            LocalStorage.set(StoreId.Dirname_Dash, this.$state)
        },
    }
})

export default useDirnameDashStore 