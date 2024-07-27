import { defineStore } from 'pinia'
import StoreId from './storeId'



const useLibraryStore = defineStore(StoreId.LIBRARY, {
    state: () => {
        return {
            isLoadingRoles: true,
            roles: [] as Entity.Role[]
        }
    },
    actions: {
        setIsLoadingRoles(isLoadingRoles: boolean) {
            this.isLoadingRoles = isLoadingRoles
        },
        setRoles(roles: Entity.Role[]) {
            this.roles = roles
        }
    }
})

export default useLibraryStore 