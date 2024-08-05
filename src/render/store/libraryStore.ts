import { defineStore } from 'pinia'
import StoreId from './storeId'
import Message from '@/util/Message'


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
        },
        getRoles(libraryId: number) {
            return new Promise<void>((resolve) => {
                this.setLoadingRoles(true)
                this.setRoles([])
                window.dataAPI.getRoles(libraryId).then((res) => {
                    if (res.code) {
                        this.setRoles(res.data!)
                    } else {
                        Message.error(res.msg)
                    }
                }).finally(() => {
                    this.setLoadingRoles(false)
                    resolve()
                })
            })
        }
    }
})

export default useLibraryStore 