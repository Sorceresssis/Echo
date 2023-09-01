import { defineStore } from 'pinia'
import StoreId from './storeId'
import { getLocalStorage, setLocalStorage } from '@/util/LocalStorage'

type RecordsView = 'compact' | 'thumbnail' | 'extended'
type SortField = 'date' | 'title' | 'rate'
type RecordsDashState = {
    view: RecordsView,
    filter: [boolean, boolean, boolean],
    sortField: SortField,
    asc: boolean,
}

const useRecordsDashStore = defineStore(StoreId.RECORDS_DASH, {
    state: (): RecordsDashState => {
        // 默认值
        const defaultState: RecordsDashState = {
            view: "thumbnail",
            filter: [false, false, false],
            sortField: "date",
            asc: true,
        }
        // 读取本地存储
        const saved = getLocalStorage(StoreId.RECORDS_DASH)
        if (saved) {
            return saved
        } else {
            setLocalStorage(StoreId.RECORDS_DASH, defaultState)
            return defaultState
        }
    },
    actions: {
        handleView(view: RecordsView) {
            this.view = view
            setLocalStorage(StoreId.RECORDS_DASH, this.$state)
        },
        handleFilter(key: number) {
            this.filter[key] = !this.filter[key]
            setLocalStorage(StoreId.RECORDS_DASH, this.$state)
        },
        handleSortField(field: SortField) {
            this.sortField = field
            setLocalStorage(StoreId.RECORDS_DASH, this.$state)
        },
        handleAsc(asc: boolean) {
            this.asc = asc
            setLocalStorage(StoreId.RECORDS_DASH, this.$state)
        },
    }
})

export default useRecordsDashStore 