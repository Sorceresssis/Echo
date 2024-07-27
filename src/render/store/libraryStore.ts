import { defineStore } from 'pinia'
import StoreId from './storeId'


const useLibraryStore = defineStore(StoreId.LIBRARY, {
    state: () => {
        return {
            isLoadingLibrary: false,
            isLoadingRoles: true,
            roles: [] as Entity.Role[]
        }
    },
    actions: {
        setLoadingLibrary(state: boolean) {
            this.isLoadingLibrary = state
        },
        setLoadingRoles(state: boolean) {
            this.isLoadingRoles = state
        },
        setRoles(roles: Entity.Role[]) {
            this.roles = roles
        }
    }
})

export default useLibraryStore 