import { defineStore } from 'pinia'
import StoreId from './storeId'

type RecordsView = 'thumbnail' | 'extended'
type SortField = 'date' | 'title' | 'rate'
type RecordsDashState = {
    view: RecordsView,
    filter: [boolean, boolean, boolean],
    sortField: SortField,
    asc: boolean,
}

const useRecordsDashStore = defineStore(StoreId.RECORDS_DASH, {
    state: (): RecordsDashState => {
        // 读取本地存储
        window.localStorage.getItem(StoreId.RECORDS_DASH)

        return {
            view: "thumbnail",
            filter: [false, false, false],
            sortField: "date",
            asc: true,
        }
    },
    actions: {
        handleView(view: RecordsView) {
            this.view = view
            this.__save()
        },
        handleFilter(key: number) {
            this.filter[key] = !this.filter[key]
            this.__save()
        },
        handleSortField(field: SortField) {
            this.sortField = field
        },
        handleAsc(asc: boolean) {
            this.asc = asc
        },
        __save() {
            window.localStorage.setItem(StoreId.RECORDS_DASH, JSON.stringify(this.$state))
        }
    }
})

export default useRecordsDashStore 