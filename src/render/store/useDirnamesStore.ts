import { defineStore } from 'pinia'
import StoreId from './storeId'

const useRecordsDashStore = defineStore(StoreId.RECORDS_DASH, {
    state: () => {
        // 读取本地存储 

        return {
            view: "thumbnail",
            filter: [false, false, false],
            sortField: "date",
            asc: true,
        }
    },
    actions: {

    }
})

export default useRecordsDashStore 